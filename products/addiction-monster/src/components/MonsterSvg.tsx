type Props = {
  /** 0..1 — relative size of the monster (1 = full menace) */
  scale: number;
  /** body color */
  color: string;
  /** rendered box size in px (the monster scales inside it) */
  box?: number;
  bob?: boolean;
};

/**
 * A chunky, slightly-menacing-but-beatable blob monster. It renders inside a
 * fixed box and shrinks toward the floor as `scale` drops, so a shrinking
 * monster visibly leaves empty space above itself.
 */
export default function MonsterSvg({ scale, color, box = 260, bob = true }: Props) {
  const s = Math.max(0.08, Math.min(1, scale));
  const size = box * s;

  return (
    <div
      style={{ width: box, height: box }}
      className="relative mx-auto flex items-end justify-center"
    >
      {/* floor shadow */}
      <div
        className="absolute bottom-1 rounded-[50%] bg-black/40"
        style={{ width: size * 0.7, height: Math.max(6, size * 0.09) }}
      />
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={bob ? "monster-bob relative" : "relative"}
        aria-hidden
      >
        {/* horns */}
        <path d="M55 52 Q42 18 68 30 Q62 44 66 54 Z" fill={color} stroke="#0d0a18" strokeWidth="4" />
        <path d="M145 52 Q158 18 132 30 Q138 44 134 54 Z" fill={color} stroke="#0d0a18" strokeWidth="4" />
        {/* body */}
        <path
          d="M100 34
             C 146 34 172 66 172 108
             C 172 138 158 158 140 168
             L 146 186 L 124 174
             C 116 177 108 178 100 178
             C 92 178 84 177 76 174
             L 54 186 L 60 168
             C 42 158 28 138 28 108
             C 28 66 54 34 100 34 Z"
          fill={color}
          stroke="#0d0a18"
          strokeWidth="5"
        />
        {/* belly */}
        <ellipse cx="100" cy="132" rx="34" ry="26" fill="#ffffff" opacity="0.14" />
        {/* eyes */}
        <ellipse cx="76" cy="92" rx="15" ry="17" fill="#fff" />
        <ellipse cx="124" cy="92" rx="15" ry="17" fill="#fff" />
        <circle cx="79" cy="96" r="6.5" fill="#0d0a18" />
        <circle cx="121" cy="96" r="6.5" fill="#0d0a18" />
        {/* angry brows */}
        <path d="M60 74 L 90 82" stroke="#0d0a18" strokeWidth="5" strokeLinecap="round" />
        <path d="M140 74 L 110 82" stroke="#0d0a18" strokeWidth="5" strokeLinecap="round" />
        {/* mouth with teeth */}
        <path d="M72 126 Q 100 144 128 126 Q 100 152 72 126 Z" fill="#0d0a18" />
        <path d="M84 130 L 89 137 L 94 130 Z" fill="#fff" />
        <path d="M106 130 L 111 137 L 116 130 Z" fill="#fff" />
      </svg>
    </div>
  );
}
