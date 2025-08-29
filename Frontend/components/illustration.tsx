"use client";

interface SvgIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

interface PngIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SvgIllustration({
  src,
  alt,
  className = "",
  width,
  height,
}: SvgIllustrationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <picture>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto max-w-full object-cover"
          style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
        />
      </picture>
    </div>
  );
}

export function PngIllustration({
  src,
  alt,
  className = "",
  width = 300,
  height = 200,
}: PngIllustrationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <picture>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto max-w-full object-contain rounded-lg"
          style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
        />
      </picture>
    </div>
  );
}

