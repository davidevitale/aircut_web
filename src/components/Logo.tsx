import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="AirCut, torna alla home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/brand/wordmark.png"
        alt="aircut"
        width={320}
        height={130}
        priority
        style={{ height: 26, width: "auto" }}
      />
    </Link>
  );
}

export function BirdMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/brand/icon.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
