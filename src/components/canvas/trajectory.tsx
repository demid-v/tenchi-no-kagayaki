"use client";

import { useMemo } from "react";
import { Color } from "three";

const Trajectory = ({
  radius,
  eccentricity = 0,
  segments = 256,
  color = new Color(0.15, 0.15, 0.15),
  rotation = 0,
  center = [0, 0],
  lineWidth = 1,
}: {
  radius: number;
  eccentricity?: number;
  segments?: number;
  color?: string | number | Color;
  rotation?: number;
  center?: [number, number];
  lineWidth?: number;
}) => {
  const positions = useMemo(() => {
    const pts = new Float32Array((segments + 1) * 3);

    const cx = center[0] ?? 0;
    const cy = center[1] ?? 0;

    const c = Math.cos(rotation);
    const s = Math.sin(rotation);

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const x0 = Math.cos(t) * radius;
      const y0 = Math.sin(t) * (radius - eccentricity);

      const x = x0 * c - y0 * s + cx;
      const y = x0 * s + y0 * c + cy;

      const idx = i * 3;
      pts[idx] = x;
      pts[idx + 1] = y;
      pts[idx + 2] = -1;
    }

    return pts;
  }, [radius, eccentricity, segments, rotation, center]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        attach="material"
        color={color}
        linewidth={lineWidth}
        toneMapped={false}
      />
    </line>
  );
};

export default Trajectory;
