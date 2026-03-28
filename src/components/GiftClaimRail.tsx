import { useEffect, useMemo, useState } from "react";
import { useCurrentUserStatus, useGiftClaim } from "@/hooks/useAccount";
import { formatFCoinAmount } from "@/utils/currency";

const GIFT_AMOUNT = 500;

export default function GiftClaimRail() {
  const {
    data: currentUser,
    isError,
    isLoading,
    refetch,
  } = useCurrentUserStatus();
  const claimGift = useGiftClaim();
  const [now, setNow] = useState(() => Date.now());
  const nextGiftAtTime = useMemo(() => {
    if (!currentUser?.nextGiftAt) {
      return null;
    }

    const parsed = new Date(currentUser.nextGiftAt).getTime();
    return Number.isFinite(parsed) ? parsed : null;
  }, [currentUser?.nextGiftAt]);

  useEffect(() => {
    if (currentUser?.giftAvailable || !nextGiftAtTime) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentUser?.giftAvailable, nextGiftAtTime]);

  useEffect(() => {
    if (currentUser?.giftAvailable || !nextGiftAtTime) {
      return;
    }

    const delay = Math.max(nextGiftAtTime - Date.now(), 0);
    const timeoutId = window.setTimeout(() => {
      refetch();
    }, delay + 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentUser?.giftAvailable, nextGiftAtTime, refetch]);

  if (isLoading && !currentUser) {
    return (
      <section className="gift-claim-rail app-panel-subtle overflow-hidden">
        <div className="gift-claim-shell">
          <div className="gift-claim-loading-block h-4 w-28" />
          <div className="gift-claim-loading-block h-16 w-full" />
          <div className="gift-claim-loading-grid">
            <div className="gift-claim-loading-block h-20 w-full" />
            <div className="gift-claim-loading-block h-20 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !currentUser) {
    return (
      <section className="gift-claim-rail app-panel-subtle overflow-hidden">
        <div className="gift-claim-shell">
          <div className="gift-claim-topline">
            <span className="gift-claim-icon">
              <span className="material-symbols-outlined">redeem</span>
            </span>
            <div>
              <p className="eyebrow">Desk gift</p>
              <h2 className="gift-claim-title">Reward sync unavailable</h2>
            </div>
          </div>

          <p className="gift-claim-copy">
            We could not load your 12-hour gift status right now.
          </p>

          <button className="action-secondary gift-claim-action" onClick={() => refetch()} type="button">
            Retry reward status
          </button>
        </div>
      </section>
    );
  }

  const countdown = formatGiftCountdown(nextGiftAtTime, now);
  const isClaimReady = currentUser.giftAvailable;

  return (
    <section className="gift-claim-rail app-panel-subtle overflow-hidden">
      <div className="gift-claim-shell">
        <div className="gift-claim-topline">
          <span className="gift-claim-icon">
            <span className="material-symbols-outlined">redeem</span>
          </span>

          <div className="gift-claim-stamp">
            <span>Live bonus</span>
            <strong>{formatFCoinAmount(GIFT_AMOUNT, { maximumFractionDigits: 0 })}</strong>
          </div>
        </div>

        <div className="gift-claim-countdown">
          <strong>{isClaimReady ? "Claim your Gift" : "Claim your Gift soon"}</strong>
        </div>

        <button
          className={`gift-claim-action ${
            isClaimReady ? "action-primary" : "action-secondary"
          }`}
          disabled={!isClaimReady || claimGift.isPending}
          onClick={() => claimGift.mutate()}
          type="button"
        >
          {claimGift.isPending
            ? "Receiving gift..."
            : isClaimReady
              ? `Receive ${formatFCoinAmount(GIFT_AMOUNT, {
                  maximumFractionDigits: 0,
                })}`
              : `Back in ${countdown}`}
        </button>
      </div>
    </section>
  );
}

function formatGiftCountdown(nextGiftAtTime: number | null, now: number) {
  if (!nextGiftAtTime) {
    return "--:--:--";
  }

  const remainingMs = Math.max(nextGiftAtTime - now, 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}
