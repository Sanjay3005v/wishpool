import confetti from "canvas-confetti";

export function fireConfetti() {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FF2E93", "#A6FF00", "#7928CA", "#FFD166", "#00F0FF"],
  });
}

export function fireSchoolPrideConfetti() {
  const end = Date.now() + 1.5 * 1000;
  const colors = ["#FF2E93", "#A6FF00", "#FFD166"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
