'use client';

export function FileteadoCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 28"
      width="48"
      height="28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M48 28 C42 24, 36 18, 28 13 C22 10, 16 11, 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 26 C40 22, 34 17, 26 12 C20 9, 14 11, 10 16" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
      <path d="M12 16 C10 12, 6 11, 5 14" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
      <circle cx="22" cy="13" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="22" cy="13" r="2" fill="currentColor" opacity="0.13" />
      <circle cx="22" cy="13" r="1" fill="currentColor" opacity="0.22" />
      <circle cx="38" cy="19" r="0.8" fill="currentColor" opacity="0.15" />
      <circle cx="44" cy="24" r="0.6" fill="currentColor" opacity="0.1" />
    </svg>
  );
}
