"use client";

import type { CSSProperties } from "react";
import styles from "./GlassTypography.module.css";

type GlassTypographyProps = {
  text: string;
  size?: number | string;
  className?: string;
};

type GlassStyle = CSSProperties & {
  "--glass-type-size"?: string;
  "--depth-offset"?: string;
  "--depth-z"?: string;
  "--depth-opacity"?: number;
};

const extrusionSteps = [1, 2, 3, 4, 5];

export function GlassTypography({
  text,
  size = "inherit",
  className = "",
}: GlassTypographyProps) {
  const resolvedSize = typeof size === "number" ? `${size}px` : size;
  const rootStyle = { "--glass-type-size": resolvedSize } as GlassStyle;

  return (
    <span
      className={`${styles.glassType} ${className}`}
      style={rootStyle}
      role="text"
      aria-label={text.replace(/\n/g, " ")}
    >
      <span className={styles.extrusion} aria-hidden="true">
        {extrusionSteps.map((step) => (
          <span
            key={step}
            className={styles.depthLayer}
            style={{
              "--depth-offset": `${step * .009}em`,
              "--depth-z": `${step * -.01}em`,
              "--depth-opacity": .34 - step * .025,
            } as GlassStyle}
          >
            {text}
          </span>
        ))}
      </span>

      <span className={`${styles.layer} ${styles.edge}`} aria-hidden="true">
        {text}
      </span>
      <span className={`${styles.layer} ${styles.face}`} aria-hidden="true">
        {text}
      </span>
      <span className={`${styles.layer} ${styles.reflection}`} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
