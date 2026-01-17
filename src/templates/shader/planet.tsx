"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/planet.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

export const PlanetShader = ({
  pixels = 100,
  lightIntensity = 0.1,
  lightPos = new Vector2(0.39, 0.7),
  rotation = 0,
  rotationSpeed = 0.1,
  ditherSize = 2,
  lightBorder1 = 0.4,
  lightBorder2 = 0.6,
  colors,
  size = 10,
  octaves = 20,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0,
  shouldDither = true,
  ref,
}: {
  pixels?: number;
  lightIntensity?: number;
  lightPos?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  ditherSize?: number;
  lightBorder1?: number;
  lightBorder2?: number;
  colors?: Vector4[];
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  shouldDither?: boolean;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = useMemo(
    () =>
      colors
        ? colors
        : [
            new Vector4(155 / 255, 158 / 255, 184 / 255, 1),
            new Vector4(71 / 255, 97 / 255, 124 / 255, 1),
            new Vector4(53 / 255, 57 / 255, 85 / 255, 1),
          ],
    [colors],
  );

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        lightIntensity: { value: lightIntensity },
        rotation: { value: rotation },
        light_origin: { value: lightPos },
        colors: { value: colorPalette },
        time_speed: { value: rotationSpeed },
        dither_size: { value: ditherSize },
        light_border_1: { value: lightBorder1 },
        light_border_2: { value: lightBorder2 },
        size: { value: size },
        OCTAVES: { value: octaves },
        seed: { value: seed },
        time: { value: time },
        should_dither: { value: shouldDither },
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
