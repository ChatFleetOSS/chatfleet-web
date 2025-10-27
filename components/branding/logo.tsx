"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const LogoMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 72 48"
    role="img"
    aria-hidden="true"
    className={cn("h-10 w-auto", className)}
  >
    <path
      fill="#0B4EA2"
      d="M26 0c12.15 0 22 8.28 22 18.5 0 4.78-2.01 9.16-5.36 12.58l3.1 10.78-12.06-5.4c-2.41.69-4.99 1.04-7.68 1.04C13.84 37.5 4 29.22 4 19S13.84 0 26 0Z"
    />
    <path
      fill="#1C8EF5"
      d="M46 8c9.39 0 17 6.55 17 14.63 0 3.58-1.51 6.87-4.03 9.43l2.33 8.1-9.1-3.94c-1.82.46-3.76.71-5.78.71C36.03 36.93 29 30.38 29 22.3 29 14.2 36.03 8 46 8Z"
    />
    <path
      fill="#54C2FF"
      d="M55.5 18C61.29 18 66 22.45 66 28c0 2.7-1.2 5.17-3.21 7.09l1.93 6.21-7.65-3.3c-1.39.33-2.87.5-4.4.5-5.79 0-10.5-4.3-10.5-9.6 0-5.32 4.71-9.9 10.33-9.9Z"
    />
    <circle cx="20" cy="17" r="2.3" fill="#FFFFFF" />
    <circle cx="28" cy="17" r="2.3" fill="#FFFFFF" />
    <circle cx="36" cy="17" r="2.3" fill="#FFFFFF" />
    <circle cx="44" cy="23" r="1.8" fill="#FFFFFF" />
    <circle cx="51" cy="23" r="1.8" fill="#FFFFFF" />
    <circle cx="58" cy="23" r="1.8" fill="#FFFFFF" />
  </svg>
);

export const Logo = ({ className }: LogoProps) => (
  <Link
    href="/"
    className={cn("flex items-center gap-3 text-[#0B4EA2]", className)}
    aria-label="ChatFleet home"
  >
    <LogoMark />
    <span className="text-xl font-semibold">ChatFleet</span>
  </Link>
);
