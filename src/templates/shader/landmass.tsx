"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/landmass-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

import { PlanetShader } from "./planet";

export const Landmass = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  lightIntensity = 0.1,
  colors,
  land = 0.6,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  lightIntensity?: number;
  colors?: [Vector4, Vector4, Vector4];
  land?: number;
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.784314, 0.831373, 0.364706, 1),
        new Vector4(0.388235, 0.670588, 0.247059, 1),
        new Vector4(0.184314, 0.341176, 0.32549, 1),
        new Vector4(0.156863, 0.207843, 0.25098, 1),
      ];

  const planetOptions = {
    uniforms: {
      pixels: { value: 100.0 },
      land_cutoff: { value: land },
      col1: { value: colorPalette[0] },
      col2: { value: colorPalette[1] },
      col3: { value: colorPalette[2] },
      col4: { value: colorPalette[3] },
      lightIntensity: { value: lightIntensity },
      light_origin: { value: lightPos },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
