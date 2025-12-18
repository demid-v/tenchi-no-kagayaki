"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import fragmentShader from "~/templates/shader/glsl/planet-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

import { PlanetShader } from "./planet";

export const WetPlanetShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  lightIntensity = 0.1,
  colors,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  lightIntensity?: number;
  colors?: [Vector4, Vector4, Vector4];
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : ([
        new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
        new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
        new Vector4(52 / 255, 65 / 255, 157 / 255, 1),
      ] as [Vector4, Vector4, Vector4]);

  const shaderOptions = {
    uniforms: {
      pixels: pixels,
      colors: colorPalette,
      lightIntensity: lightIntensity,
      light_origin: lightPos,
      time_speed: rotationSpeed,
      rotation: rotation,
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return (
    <PlanetShader ref={ref} {...shaderOptions} {...shaderOptions.uniforms} />
  );
};
