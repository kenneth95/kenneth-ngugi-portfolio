/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_PHOTO = "/default-photo.svg";

type LogoImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

/**
 * Renders a circular logo image (company / school logo) sourced from the
 * spreadsheet. If no URL is provided, or the URL fails to load, it falls
 * back to a default generic placeholder image instead of a broken-image
 * icon or an empty box.
 */
export function LogoImage({ src, alt, className }: LogoImageProps) {
  const [imageError, setImageError] = useState(false);

  const baseClassName = cn(
    "size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none",
    className
  );

  const resolvedSrc = !src || imageError ? DEFAULT_PHOTO : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={baseClassName}
      onError={() => setImageError(true)}
    />
  );
}
