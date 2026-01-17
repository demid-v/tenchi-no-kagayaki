"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/gas-planet.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

const GasPlanetShader = ({
  pixels = 100,
  lightPosition = new Vector2(0.39, 0.7),
  rotation = 0,
  rotationSpeed = 0.1,
  cloudCover = 0,
  stretch = 1,
  cloudCurve = 1.3,
  lightBorder1 = 0.692,
  lightBorder2 = 0.666,
  colors,
  size = 9,
  octaves = 5,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  cloudCover?: number;
  stretch?: number;
  cloudCurve?: number;
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
            new Vector4(0.231373, 0.12549, 0.152941, 1),
            new Vector4(0.231373, 0.12549, 0.152941, 1),
            new Vector4(0, 0, 0, 1),
            new Vector4(0.129412, 0.0941176, 0.105882, 1),
          ],
    [colors],
  );

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        rotation: { value: rotation },
        light_origin: { value: lightPosition },
        time_speed: { value: rotationSpeed },
        cloud_cover: { value: cloudCover },
        stretch: { value: stretch },
        cloud_curve: { value: cloudCurve },
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

export default GasPlanetShader;
