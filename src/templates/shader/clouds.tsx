"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/clouds.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

export const CloudsShader = ({
  pixels = 100.0,
  lightPosition = new Vector2(0.41, 0.67),
  rotation = 0.0,
  rotationSpeed = 0.1,
  cloudCover = 0.47,
  stretch = 2.0,
  cloudCurve = 1.3,
  lightBorder1 = 0.52,
  lightBorder2 = 0.62,
  colors,
  size = 7.315,
  octaves = 2,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
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
  colors?: [Vector4, Vector4, Vector4, Vector4];
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.882353, 0.94902, 1, 1),
        new Vector4(0.752941, 0.890196, 1, 1),
        new Vector4(0.368627, 0.439216, 0.647059, 1),
        new Vector4(0.25098, 0.286275, 0.45098, 1),
      ];

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        rotation: { value: rotation },
        cloud_cover: { value: cloudCover },
        light_origin: { value: lightPosition },
        time_speed: { value: rotationSpeed },
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
    [],
  );

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
