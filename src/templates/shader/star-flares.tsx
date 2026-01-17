"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-flares.frag";
import vertexShader from "~/templates/shader/glsl/star.vert";

export const StarFlaresShader = ({
  pixels = 100,
  rotationSpeed = 0.1,
  rotation = 0,
  stormWidth = 0.2,
  stormDitherWidth = 0.07,
  circleAmount = 2,
  circleScale = 1,
  scale = 1,
  size = 1.6,
  octaves = 4,
  shouldDither = true,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0,
  ref,
}: {
  pixels?: number;
  rotationSpeed?: number;
  rotation?: number;
  stormWidth?: number;
  stormDitherWidth?: number;
  circleAmount?: number;
  circleScale?: number;
  scale?: number;
  size?: number;
  octaves?: number;
  shouldDither?: boolean;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = useMemo(
    () => [new Vector4(1, 0.647, 0), new Vector4(1, 1, 0.894118)],
    [],
  );

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        time_speed: { value: rotationSpeed },
        rotation: { value: rotation },
        colors: { value: colorPalette },
        storm_width: { value: stormWidth },
        storm_dither_width: { value: stormDitherWidth },
        circle_amount: { value: circleAmount },
        circle_scale: { value: circleScale },
        scale: { value: scale },
        size: { value: size },
        OCTAVES: { value: octaves },
        shoul_dither: { value: shouldDither },
        seed: { value: seed },
        time: { value: time },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
