/** Vòng tròn trắng góc phải — tỏa ra */
export function CardGlowCircles() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/25 transition-transform duration-500 group-hover:scale-110"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-2 top-2 h-24 w-24 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-110"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-8 top-10 h-14 w-14 rounded-full bg-white/25 transition-transform duration-500 delay-75 group-hover:scale-125"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-16 top-20 h-8 w-8 rounded-full bg-white/30 transition-transform duration-500 delay-100 group-hover:scale-125"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-6 right-4 h-16 w-16 rounded-full bg-white/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-black/10"
        aria-hidden
      />
    </>
  );
}

export const LEARN_GRADIENTS = [
  "from-amber-400 via-orange-400 to-amber-600",
  "from-orange-400 via-orange-500 to-red-500",
  "from-rose-400 via-red-500 to-rose-700",
  "from-yellow-400 via-amber-500 to-orange-600",
];

export const TEST_GRADIENTS = [
  "from-emerald-400 via-teal-500 to-emerald-700",
  "from-teal-400 via-cyan-500 to-teal-700",
  "from-green-400 via-emerald-500 to-green-700",
  "from-lime-400 via-emerald-500 to-teal-600",
];

export function gradientCardClass(gradient) {
  return `group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg text-white transition-all duration-300 hover:-translate-y-1 hover:brightness-105`;
}
