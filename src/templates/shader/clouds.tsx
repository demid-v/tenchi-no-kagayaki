"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/clouds-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

export const CloudsShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  colors,
  cloudCover = 0.546,
  stretch = 2.5,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  colors?: [Vector4, Vector4, Vector4, Vector4];
  cloudCover?: number;
  stretch?: number;
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
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

  const shaderOptions = {
    uniforms: {
      light_origin: { value: lightPos },
      pixels: { value: pixels },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time_speed: { value: rotationSpeed },
      base_color: { value: colorPalette[0] },
      outline_color: { value: colorPalette[1] },
      shadow_base_color: { value: colorPalette[2] },
      shadow_outline_color: { value: colorPalette[3] },
      cloud_cover: { value: cloudCover },
      rotation: { value: rotation },
      stretch: { value: stretch },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
