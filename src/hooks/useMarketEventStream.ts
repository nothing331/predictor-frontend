import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/api/client";
import {
  parseDomainEvent,
  type MarketResolvedEvent,
  type TradeExecutedEvent,
} from "@/features/markets/marketEvents";

export type MarketStreamStatus =
  | "idle"
  | "connecting"
  | "live"
  | "reconnecting"
  | "live-delayed";

type UseMarketEventStreamOptions = {
  enabled: boolean;
  marketId: string;
  onMarketResolved?: (event: MarketResolvedEvent) => void | Promise<void>;
  onReconnectNeeded?: () => Promise<void>;
  onTradeExecuted?: (event: TradeExecutedEvent) => void | Promise<void>;
};

const reconnectBackoffMs = [1000, 2000, 5000, 10000, 15000];
const liveDelayMs = 3000;

export function useMarketEventStream({
  enabled,
  marketId,
  onMarketResolved,
  onReconnectNeeded,
  onTradeExecuted,
}: UseMarketEventStreamOptions) {
  const [status, setStatus] = useState<MarketStreamStatus>(
    enabled ? "connecting" : "idle",
  );
  const tradeHandlerRef = useRef(onTradeExecuted);
  const resolvedHandlerRef = useRef(onMarketResolved);
  const reconnectHandlerRef = useRef(onReconnectNeeded);

  tradeHandlerRef.current = onTradeExecuted;
  resolvedHandlerRef.current = onMarketResolved;
  reconnectHandlerRef.current = onReconnectNeeded;

  useEffect(() => {
    if (!enabled || !marketId) {
      setStatus("idle");
      return;
    }

    let isStopped = false;
    let activeStream: EventSource | null = null;
    let reconnectAttempt = 0;
    let reconnectTimer = 0;
    let delayedTimer = 0;

    const clearTimers = () => {
      window.clearTimeout(reconnectTimer);
      window.clearTimeout(delayedTimer);
    };

    const closeStream = () => {
      activeStream?.close();
      activeStream = null;
    };

    const scheduleLiveDelay = () => {
      window.clearTimeout(delayedTimer);
      delayedTimer = window.setTimeout(() => {
        if (!isStopped) {
          setStatus((current) =>
            current === "connecting" ? "live-delayed" : current,
          );
        }
      }, liveDelayMs);
    };

    const openStream = () => {
      if (isStopped) {
        return;
      }

      closeStream();
      clearTimers();
      setStatus("connecting");
      scheduleLiveDelay();

      const eventSource = new EventSource(
        `${API_BASE_URL}v1/stream/events?marketId=${encodeURIComponent(marketId)}`,
      );

      activeStream = eventSource;

      eventSource.onopen = () => {
        if (isStopped || activeStream !== eventSource) {
          return;
        }

        reconnectAttempt = 0;
        window.clearTimeout(delayedTimer);
        setStatus("live");
      };

      eventSource.addEventListener("TradeExecuted", (event) => {
        if (isStopped || activeStream !== eventSource) {
          return;
        }

        const parsed = parseDomainEvent((event as MessageEvent<string>).data);
        if (parsed.type !== "TradeExecuted") {
          return;
        }

        void tradeHandlerRef.current?.(parsed);
      });

      eventSource.addEventListener("MarketResolved", (event) => {
        if (isStopped || activeStream !== eventSource) {
          return;
        }

        const parsed = parseDomainEvent((event as MessageEvent<string>).data);
        if (parsed.type !== "MarketResolved") {
          return;
        }

        void resolvedHandlerRef.current?.(parsed);
      });

      eventSource.onerror = () => {
        if (isStopped || activeStream !== eventSource) {
          return;
        }

        closeStream();
        clearTimers();
        attemptReconnect();
      };
    };

    const attemptReconnect = () => {
      if (isStopped) {
        return;
      }

      setStatus("reconnecting");

      const waitTime =
        reconnectBackoffMs[
          Math.min(reconnectAttempt, reconnectBackoffMs.length - 1)
        ];
      reconnectAttempt += 1;

      reconnectTimer = window.setTimeout(async () => {
        if (isStopped) {
          return;
        }

        try {
          await reconnectHandlerRef.current?.();
        } catch {
          attemptReconnect();
          return;
        }

        if (isStopped) {
          return;
        }

        openStream();
      }, waitTime);
    };

    openStream();

    return () => {
      isStopped = true;
      clearTimers();
      closeStream();
    };
  }, [enabled, marketId]);

  return { status };
}
