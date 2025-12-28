"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/gas-planet-layers.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

const GasPlanetLayersShader = ({
  pixels = 100.0,
  lightPosition = new Vector2(-0.1, 0.3),
  rotation = 0.0,
  rotationSpeed = 0.05,
  cloudCover = 0.61,
  stretch = 2.204,
  cloudCurve = 1.376,
  lightBorder1 = 0.52,
  lightBorder2 = 0.62,
  bands = 0.892,
  numOfColors = 3,
  colors,
  darkColors,
  size = 10.107,
  octaves = 3,
  shouldDither = true,
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
  bands?: number;
  numOfColors?: number;
  colors?: Vector4[];
  darkColors?: Vector4[];
  size?: number;
  octaves?: number;
  shouldDither?: boolean;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.933333, 0.764706, 0.603922, 1),
        new Vector4(0.85098, 0.627451, 0.4, 1),
        new Vector4(0.560784, 0.337255, 0.231373, 1),
        new Vector4(0.4, 0.223529, 0.192157, 1),
        new Vector4(0.270588, 0.156863, 0.235294, 1),
        new Vector4(0.133333, 0.12549, 0.203922, 1),
      ];

  const shaderOptions = {
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
      bands: { value: bands },
      n_colors: { value: numOfColors },
      colors: { value: colorPalette },
      size: { value: size },
      OCTAVES: { value: octaves },
      should_dither: { value: shouldDither },
      seed: { value: seed },
      time: { value: time },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};

export default GasPlanetLayersShader;
