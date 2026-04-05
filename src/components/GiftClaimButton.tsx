import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimGift } from "@/api/auth";
import { AuthStore } from "@/store/authStore";

export default function GiftClaimButton() {
  const giftAvailable = AuthStore((state) => state.giftAvailable);
  const nextGiftAt = AuthStore((state) => state.nextGiftAt);
  const updateBalance = AuthStore((state) => state.updateBalance);
  const updateGift = AuthStore((state) => state.updateGift);
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: claimGift,
    onSuccess: (data) => {
      updateBalance(data.balance);
      updateGift(data.giftAvailable, data.nextGiftAt);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (giftAvailable || !nextGiftAt) {
      setCountdown("");
      return;
    }

    const tick = () => {
      const remaining = new Date(nextGiftAt).getTime() - Date.now();

      if (remaining <= 0) {
        setCountdown("");
        updateGift(true, null);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [giftAvailable, nextGiftAt, updateGift]);

  if (giftAvailable) {
    return (
      <button
        type="button"
        className="chip chip-primary"
        disabled={claimMutation.isPending}
        onClick={() => claimMutation.mutate()}
      >
        <span className="material-symbols-outlined text-[1rem]">
          redeem
        </span>
        {claimMutation.isPending ? "Claiming..." : "Claim \u0192500"}
      </button>
    );
  }

  if (countdown) {
    return (
      <span className="chip chip-soft !border-transparent !bg-transparent font-mono">
        <span className="material-symbols-outlined text-[1rem]">schedule</span>
        {countdown}
      </span>
    );
  }

  return null;
}
