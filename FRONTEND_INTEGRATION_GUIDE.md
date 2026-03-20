# Frontend Integration Guide

This document explains how a frontend application should integrate with the current Predictor backend.

It is written for a frontend engineer who needs to:

- call the REST API correctly
- implement authentication and token refresh
- connect to the SSE stream for live updates
- understand error handling, rate limits, and backend constraints
- know what the backend currently does and does not expose

This guide reflects the current implementation in this repository, not an idealized future API.

## 1. Backend Summary

This backend is a Spring Boot application with:

- JWT-based access tokens
- refresh-token rotation
- Google sign-in
- optional demo username/password auth
- public market read endpoints
- protected mutation endpoints
- SSE for market events
- PostgreSQL, Redis, Flyway, and Spring Security under the hood

The API is centered around binary prediction markets. Every market currently resolves to one of two outcomes:

- `YES`
- `NO`

Important integration fact:

- this backend is stateless for access tokens
- it does not use cookie-based auth
- it returns tokens in JSON bodies
- the frontend is responsible for attaching the access token on protected requests

## 2. Base URL and Versioning

All routes are versioned under `/v1`.

Example:

```text
https://api.example.com/v1/markets
```

Recommended frontend environment variables:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

If you use Next.js:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## 3. Route Matrix

### Public routes

- `POST /v1/auth/google`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `POST /v1/auth/demo/register` if demo auth is enabled
- `POST /v1/auth/demo/login` if demo auth is enabled
- `GET /v1/markets`
- `GET /v1/markets/{marketId}`
- `GET /v1/stream/events`

### Protected routes

- `GET /v1/auth/me`
- `POST /v1/markets`
- `POST /v1/markets/{marketId}/resolve`
- `POST /v1/markets/{marketId}/trades`
- `GET /v1/users`

Important authorization note:

- there is currently no role-based access control
- any authenticated user can call protected routes, including market creation and market resolution
- the frontend should not assume there is an admin-only distinction unless the backend is extended later

## 4. Authentication Model

There are two auth modes exposed by the backend:

- Google sign-in
- optional demo auth

### 4.1 Google sign-in flow

The intended browser flow is:

1. Frontend gets a Google ID token from Google Sign-In.
2. Frontend sends that ID token to `POST /v1/auth/google`.
3. Backend verifies the Google token.
4. Backend creates or updates the local user.
5. Backend returns:
   - an app access token
   - an app refresh token
   - access-token lifetime in seconds

Request:

```http
POST /v1/auth/google
Content-Type: application/json
```

```json
{
  "tokenId": "google-id-token-from-client"
}
```

Success response:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "opaque-refresh-token",
  "expiresInSeconds": 900
}
```

Notes:

- `expiresInSeconds` is the actual response field name
- the current default access-token lifetime is 900 seconds, which is 15 minutes
- the refresh token is a backend-issued opaque token, not a JWT

### 4.2 Demo auth flow

Demo auth is only available when `app.demo.auth.enabled=true`.

This is enabled in the `demo` profile and disabled by default in normal development config.

Register request:

```http
POST /v1/auth/demo/register
Content-Type: application/json
```

```json
{
  "username": "demo_user",
  "password": "demo_pass",
  "email": "demo@example.com"
}
```

Login request:

```http
POST /v1/auth/demo/login
Content-Type: application/json
```

```json
{
  "username": "demo_user",
  "password": "demo_pass"
}
```

Both endpoints return the same token shape:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "opaque-refresh-token",
  "expiresInSeconds": 900
}
```

### 4.3 Access token usage

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

Example:

```http
GET /v1/auth/me
Authorization: Bearer eyJ...
```

The backend extracts the authenticated user from the JWT subject claim. The frontend should treat the access token as opaque and should not rely on decoding it for application state.

### 4.4 Refresh flow

When the access token expires or a protected call returns `401`, the frontend should:

1. call `POST /v1/auth/refresh`
2. replace both the access token and refresh token with the new values
3. retry the original request once

Request:

```http
POST /v1/auth/refresh
Content-Type: application/json
```

```json
{
  "refreshToken": "current-refresh-token"
}
```

Success response:

```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token",
  "expiresInSeconds": 900
}
```

Very important:

- refresh tokens are rotated
- after a successful refresh, the old refresh token becomes invalid
- if you keep using the old refresh token, the backend will return `401`

This means your frontend must always overwrite the stored refresh token with the newest one.

### 4.5 Logout behavior

Logout request:

```http
POST /v1/auth/logout
Content-Type: application/json
```

```json
{
  "refreshToken": "current-refresh-token"
}
```

Success response:

- HTTP `204 No Content`

Important nuance:

- logout revokes the refresh token
- logout does not actively invalidate already-issued access tokens
- because access tokens are stateless JWTs, an existing access token may continue working until its expiry time

Frontend implication:

- on logout, clear local auth state immediately
- do not wait for the current access token to expire

### 4.6 Current user endpoint

Request:

```http
GET /v1/auth/me
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "userId": "google-sub-or-demo-user-id",
  "email": "user@example.com",
  "name": "Display Name",
  "pictureUrl": "https://...",
  "balance": 1000.00
}
```

Notes:

- the field is `name`, not `displayName`
- `balance` is returned as a JSON number
- this is the best endpoint to hydrate the authenticated user after login or app reload

## 5. Recommended Frontend Auth State

Minimum auth state:

- `accessToken`
- `refreshToken`
- `accessTokenExpiresAt`
- `user`
- `isAuthenticated`

Recommended behavior:

1. On login success, store tokens and compute `accessTokenExpiresAt`.
2. Call `/v1/auth/me` to hydrate the app user.
3. Attach `Authorization: Bearer <accessToken>` to protected requests.
4. On `401`, try one refresh attempt.
5. If refresh fails, clear auth state and redirect to login.

Reasonable token-storage options:

- in-memory only: safest against persistent XSS, but user loses session on full page reload
- localStorage: easiest, but more exposed to XSS
- sessionStorage: similar tradeoff, but not persistent across browser restarts

Because this backend currently returns tokens in JSON rather than setting `HttpOnly` cookies, the frontend must consciously choose a storage strategy. If security hardening becomes a priority later, migrating to cookie-based refresh tokens would be worth considering.

## 6. REST API Details

### 6.1 Create market

Request:

```http
POST /v1/markets
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "name": "Will BTC hit 150k this year?",
  "description": "Binary market for year-end BTC price",
  "liquidity": 50.0
}
```

Fields:

- `name`: required, non-blank
- `description`: optional
- `liquidity`: optional, must be greater than `0`

Success response:

```json
{
  "status": "success",
  "message": "Market created successfully.",
  "marketId": "Will-BTC-hit-150k-this-year?-20260316-153000"
}
```

Important notes:

- `marketId` is generated from the market name plus a timestamp
- treat `marketId` as an opaque backend identifier
- if a market with the same name already exists, backend returns `409 Conflict`

Conflict response:

```json
{
  "error": "Market with this name already exists."
}
```

### 6.2 Get all markets

Request:

```http
GET /v1/markets
GET /v1/markets?status=OPEN
GET /v1/markets?status=RESOLVED
```

Success response:

```json
[
  {
    "marketId": "market-1",
    "marketName": "Will team A win?",
    "marketDescription": "Binary market",
    "status": "OPEN",
    "resolvedOutcome": null
  }
]
```

Notes:

- `status` filter only meaningfully supports `OPEN` and `RESOLVED`
- invalid `status` values currently return an empty array rather than a validation error

### 6.3 Get market by ID

Request:

```http
GET /v1/markets/{marketId}
```

Success response:

```json
{
  "marketId": "market-1",
  "marketName": "Will team A win?",
  "marketDescription": "Binary market",
  "status": "OPEN",
  "resolvedOutcome": null
}
```

If not found:

- HTTP `404`
- response body may be empty

### 6.4 Resolve market

Request:

```http
POST /v1/markets/{marketId}/resolve
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "outcomeId": "YES"
}
```

Accepted values:

- `YES`
- `NO`

The backend uppercases before enum conversion, so lowercase values also work in practice.

Success response:

```json
{
  "status": "success",
  "message": "Market resolved successfully.",
  "marketId": "market-1",
  "resolvedOutcome": "YES"
}
```

### 6.5 Buy shares

Request:

```http
POST /v1/markets/{marketId}/trades
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "outcome": "YES",
  "amount": 25
}
```

Request semantics:

- `outcome` must be `YES` or `NO`
- input is case-insensitive
- `amount` is the amount of money the user wants to spend
- the backend computes how many shares that amount buys under LMSR pricing

Success response:

```json
{
  "status": "success",
  "message": "Trade executed successfully.",
  "tradeId": "trade-uuid",
  "sharesBought": 12.345,
  "cost": 25,
  "outcome": "YES"
}
```

Frontend notes:

- the request is budget-based, not share-count-based
- `sharesBought` is computed by the backend
- use the returned `cost` and `sharesBought` for confirmation UI

### 6.6 Get users

Request:

```http
GET /v1/users
Authorization: Bearer <accessToken>
```

Success response:

```json
[
  {
    "userId": "user-1"
  }
]
```

Important note:

- this endpoint currently returns only `userId`
- it does not return names, emails, or profile images

## 7. What the Backend Currently Does Not Expose

This part is especially important for frontend planning.

The current API does not expose:

- portfolio positions per user
- per-market user holdings
- current YES/NO price in REST responses
- current `qYes` and `qNo` in REST responses
- order history endpoints
- trade list endpoints
- admin roles or permissions
- event replay for SSE

Practical impact:

- you can build market lists, auth flows, create/resolve actions, and buy actions
- you can display trade confirmations from mutation responses
- you can react to SSE event notifications
- you cannot build a full portfolio page from public API alone
- you cannot fully reconstruct current market odds from the existing REST API contract alone

If the frontend needs live price cards, portfolio balances by market, or trade history views, the backend will need additional endpoints or richer DTOs.

## 8. SSE Integration

### 8.1 SSE endpoint

Request:

```http
GET /v1/stream/events
Accept: text/event-stream
```

Optional filtered request:

```http
GET /v1/stream/events?marketId=market-1
Accept: text/event-stream
```

Behavior:

- connection stays open
- server pushes named events
- clients can subscribe to all markets or one market
- heartbeat comments are sent every 15 seconds

### 8.2 Event names

The backend emits these SSE event names:

- `MarketCreated`
- `TradeExecuted`
- `MarketResolved`

### 8.3 Event payload shape

Every event payload follows this general shape:

```json
{
  "eventId": "uuid",
  "type": "TradeExecuted",
  "occurredAt": "2026-03-16T10:20:30Z",
  "marketId": "market-1",
  "payload": {}
}
```

#### MarketCreated payload

```json
{
  "eventId": "uuid",
  "type": "MarketCreated",
  "occurredAt": "2026-03-16T10:20:30Z",
  "marketId": "market-1",
  "payload": {
    "marketName": "Will team A win?"
  }
}
```

#### TradeExecuted payload

```json
{
  "eventId": "uuid",
  "type": "TradeExecuted",
  "occurredAt": "2026-03-16T10:20:30Z",
  "marketId": "market-1",
  "payload": {
    "tradeId": "trade-uuid",
    "userId": "user-1",
    "outcome": "YES",
    "shareCount": 12.345,
    "cost": 25
  }
}
```

#### MarketResolved payload

```json
{
  "eventId": "uuid",
  "type": "MarketResolved",
  "occurredAt": "2026-03-16T10:20:30Z",
  "marketId": "market-1",
  "payload": {
    "outcomeId": "YES"
  }
}
```

### 8.4 Browser implementation notes

For a normal browser frontend, the easiest client is native `EventSource`.

Example:

```ts
const es = new EventSource(`${API_BASE_URL}/v1/stream/events`);
```

If you want market-specific events:

```ts
const es = new EventSource(
  `${API_BASE_URL}/v1/stream/events?marketId=${encodeURIComponent(marketId)}`
);
```

Listen by event name:

```ts
es.addEventListener("TradeExecuted", (event) => {
  const data = JSON.parse((event as MessageEvent).data);
});
```

### 8.5 Important auth nuance with EventSource

Native browser `EventSource` does not let you attach an `Authorization` header.

That matters less here because:

- this SSE endpoint is public
- backend permits anonymous connections
- rate limiting falls back to IP if no authenticated principal is present

Frontend implication:

- if you use native browser `EventSource`, expect the SSE connection to be anonymous
- do not design the current SSE stream as a private user-specific channel

If private authenticated SSE is ever needed later, you would need one of these:

- cookie-based auth
- a fetch-based SSE polyfill that supports headers
- a different transport such as WebSockets

### 8.6 Reconnect and state recovery

This backend explicitly expects the client recovery rule to be:

1. on reconnect, fetch REST snapshots first
2. then reopen the stream

Why this matters:

- the backend does not implement replay from `Last-Event-ID`
- events contain `eventId`, but the server does not use them for resume support
- if the client disconnects, missed events are not replayed automatically

Recommended reconnect strategy:

1. detect `error` or closed connection
2. wait with backoff
3. refetch current REST state
4. reopen the stream

Suggested backoff sequence:

- 1 second
- 2 seconds
- 5 seconds
- 10 seconds
- 15 seconds max

### 8.7 What SSE is good for in this app

Use SSE to:

- refresh market lists when a market is created
- refresh a market detail page when a trade happens
- switch a market to resolved state when it resolves
- show lightweight real-time notifications

Do not assume SSE alone gives you enough data to derive complete market state. For example, trade events tell you that a trade happened, but they do not include a full market snapshot or current probabilities.

## 9. Error Handling

The backend has two different error-response styles, and the frontend should handle both.

### 9.1 Standard API error shape

Most application errors use:

```json
{
  "timestamp": "2026-03-16T18:44:36",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid outcome: MAYBE"
}
```

Common cases:

- invalid business action
- invalid Google token
- refresh token expired
- illegal trade input
- rate limiting through the global exception path
- generic internal server errors

### 9.2 Security 401 shape

Missing or invalid access tokens on protected routes return a different shape:

```json
{
  "status": 401,
  "error": "Unauthorized"
}
```

Important frontend note:

- do not assume every error response has `message`
- for `401`, key off the HTTP status first

### 9.3 Validation edge case

The backend currently does not add a custom handler for Spring validation errors like `MethodArgumentNotValidException`.

That means malformed or invalid request bodies may return Spring Boot's default validation response rather than the custom `ErrorResponse` shape.

Frontend implication:

- always treat HTTP status as the primary source of truth
- parse error JSON defensively
- support unknown error shapes

## 10. Rate Limits

Current configured limits:

- trade-related protected mutation routes: `30` requests per `60` seconds
- SSE connection attempts: `20` requests per `60` seconds

Important details:

- the rate limiter uses Redis
- if Redis is unavailable, rate limiting is configured to fail closed
- fail-closed means requests can be rejected with `429` even when the user has not truly exceeded quota

What the frontend should do:

- on `429`, show a user-friendly retry message
- back off before retrying
- avoid aggressive reconnect loops for SSE
- debounce or disable rapid repeat trade submissions

Good trade UX:

- disable the buy button while a trade request is in flight
- prevent double-submission
- surface the server error message when available

## 11. CORS and Deployment Notes

This codebase currently does not include explicit CORS configuration.

That means if your frontend runs on a different origin, for example:

- frontend: `https://app.example.com`
- backend: `https://api.example.com`

then the backend will likely need CORS configuration before browser requests work cleanly in production.

Frontend developer takeaway:

- if you see browser CORS failures, this is a backend configuration issue, not a frontend bug
- coordinate allowed origins, methods, and headers with the backend deploy setup

At minimum, protected cross-origin requests will need `Authorization` allowed in CORS headers.

## 12. Recommended Frontend Data Layer Design

A clean frontend architecture would separate:

- `authClient`
- `apiClient`
- `sseClient`
- query/state hooks or stores

### `authClient` responsibilities

- Google sign-in exchange
- demo login/register if used
- token storage
- refresh
- logout
- current-user bootstrap

### `apiClient` responsibilities

- base URL
- JSON parsing
- bearer token injection
- single retry on refresh after `401`
- normalized error handling

### `sseClient` responsibilities

- open stream
- subscribe by event type
- reconnect with backoff
- trigger REST refetch after reconnect or event receipt

## 13. Suggested TypeScript Shapes

These are good frontend-side types based on the current API.

```ts
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};
```

```ts
export type AuthUser = {
  userId: string;
  email: string | null;
  name: string | null;
  pictureUrl: string | null;
  balance: number;
};
```

```ts
export type MarketSummary = {
  marketId: string;
  marketName: string;
  marketDescription: string | null;
  status: "OPEN" | "RESOLVED";
  resolvedOutcome: "YES" | "NO" | null;
};
```

```ts
export type TradeResponse = {
  status: string;
  message: string;
  tradeId: string;
  sharesBought: number;
  cost: number;
  outcome: "YES" | "NO";
};
```

```ts
export type DomainEvent =
  | {
      eventId: string;
      type: "MarketCreated";
      occurredAt: string;
      marketId: string;
      payload: { marketName: string };
    }
  | {
      eventId: string;
      type: "TradeExecuted";
      occurredAt: string;
      marketId: string;
      payload: {
        tradeId: string;
        userId: string;
        outcome: "YES" | "NO";
        shareCount: number;
        cost: number;
      };
    }
  | {
      eventId: string;
      type: "MarketResolved";
      occurredAt: string;
      marketId: string;
      payload: { outcomeId: "YES" | "NO" };
    };
```

## 14. Recommended Request Patterns

### App startup

1. Load tokens from storage.
2. If no refresh token exists, show signed-out state.
3. If access token exists, try `/v1/auth/me`.
4. If that fails with `401`, try refresh.
5. If refresh succeeds, retry `/v1/auth/me`.
6. If refresh fails, clear auth state.

### After login

1. Receive token response.
2. Save access token and refresh token.
3. Fetch `/v1/auth/me`.
4. Navigate into the app.
5. Optionally open SSE stream after authenticated app bootstrap.

### Market list page

1. Fetch `/v1/markets`.
2. Open SSE stream.
3. On `MarketCreated`, refetch the market list.
4. On `MarketResolved`, refetch affected market or market list.
5. On reconnect, refetch then reopen stream.

### Market detail page

1. Fetch `/v1/markets/{marketId}`.
2. Open `/v1/stream/events?marketId={marketId}`.
3. On `TradeExecuted`, refetch market detail.
4. On `MarketResolved`, refetch market detail.

Because detail responses are currently minimal, if you want richer live market data later, backend DTOs will need to expand.

## 15. Known Contract Quirks and Sharp Edges

These are easy places for frontend confusion.

- Token response field is `expiresInSeconds`, not `expiresIn`.
- `/v1/auth/me` returns `name`, not `displayName`.
- `/v1/users` currently returns only `userId`.
- `/v1/markets` and `/v1/markets/{id}` return minimal market summaries, not live pricing fields.
- `GET /v1/markets/{id}` may return a bare `404` with empty body.
- Protected-route `401` responses do not use the full standard error structure.
- Native browser `EventSource` cannot attach bearer auth headers.
- Refresh tokens rotate and must always be replaced client-side.
- Logout revokes refresh token, not existing access JWTs.
- Any authenticated user can currently create, resolve, trade, and list users because no role model exists yet.

## 16. Backend Changes the Frontend May Soon Need

If the frontend roadmap includes a richer trading product, these are the most likely backend additions worth requesting:

- market DTOs that include current YES price and NO price
- endpoint for a user's positions and holdings
- endpoint for trade history
- endpoint for a single user's portfolio summary
- admin/owner authorization around market creation and resolution
- standardized validation error payloads
- explicit CORS configuration
- optional cookie-based refresh token flow
- SSE replay or snapshot/version support

## 17. Frontend Delivery Checklist

A frontend engineer should confirm all of the following before calling integration complete:

- base API URL is environment-driven
- Google client ID is environment-driven
- access token is attached to protected routes
- token refresh overwrites both tokens
- failed refresh clears auth state
- `/v1/auth/me` is used to hydrate the user
- logout clears local state immediately
- SSE reconnect uses backoff
- REST state is refetched on SSE reconnect
- `429` is handled gracefully
- UI does not assume all errors include `message`
- UI does not assume market responses include pricing or positions
- deployment plan includes backend CORS configuration

## 18. Final Recommendation

If you are building the frontend now, the most reliable approach is:

- use REST as the source of truth
- use SSE as an invalidation and notification channel
- keep auth handling centralized in one client module
- design the UI around the data the backend actually returns today

For the current backend, that means the frontend can confidently implement:

- sign-in
- session persistence with refresh
- current-user bootstrap
- market list
- market detail summary
- create market
- resolve market
- buy shares
- live event reactions

But if you want a polished trading UI with positions, prices, and portfolio analytics, you should expect at least a small second round of backend API additions.
