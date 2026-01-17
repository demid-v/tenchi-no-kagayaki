"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import vertexShader from "~/templates/shader/glsl/planet.vert";
import fragmentShader from "~/templates/shader/glsl/terrain.frag";

export const Landmass = ({
  pixels = 100,
  lightIntensity = 0.1,
  lightPosition = new Vector2(0.39, 0.7),
  rotation = 0,
  rotationSpeed = 0.1,
  ditherSize = 2,
  landCutoff = 0.5,
  lightBorder1 = 0.4,
  lightBorder2 = 0.6,
  colors,
  size = 10,
  octaves = 6,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  lightIntensity?: number;
  rotation?: number;
  rotationSpeed?: number;
  landCutoff?: number;
  ditherSize?: number;
  lightBorder1?: number;
  lightBorder2?: number;
  colors?: Vector4[];
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = useMemo(
    () =>
      colors
        ? colors
        : [
            new Vector4(0.784314, 0.831373, 0.364706, 1),
            new Vector4(0.388235, 0.670588, 0.247059, 1),
            new Vector4(0.184314, 0.341176, 0.32549, 1),
            new Vector4(0.156863, 0.207843, 0.25098, 1),
          ],
    [colors],
  );

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        lightIntensity: { value: lightIntensity },
        rotation: { value: rotation },
        time_speed: { value: rotationSpeed },
        dither_size: { value: ditherSize },
        light_origin: { value: lightPosition },
        land_cutoff: { value: landCutoff },
        light_border_1: { value: lightBorder1 },
        light_border_2: { value: lightBorder2 },
        colors: { value: colorPalette },
        size: { value: size },
        OCTAVES: { value: octaves },
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
