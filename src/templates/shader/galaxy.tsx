"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/galaxy.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

const GalaxyShader = ({
  pixels = 100,
  lightPosition = new Vector2(-0.1, 0.3),
  rotation = 0.674,
  rotationSpeed = 1.0,
  numOfColors = 6,
  colors,
  tilt = 1.0,
  numOfLayers = 4.0,
  layerHeight = 0.4,
  zoom = 1.375,
  swirl = -9.0,
  size = 7,
  octaves = 1,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  numOfColors?: number;
  colors?: Vector4[];
  tilt?: number;
  numOfLayers?: number;
  layerHeight?: number;
  zoom?: number;
  swirl?: number;
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(1, 1, 0.921569, 1),
        new Vector4(1, 0.913725, 0.552941, 1),
        new Vector4(0.709804, 0.878431, 0.4, 1),
        new Vector4(0.396078, 0.647059, 0.4, 1),
        new Vector4(0.223529, 0.364706, 0.392157, 1),
        new Vector4(0.196078, 0.223529, 0.301961, 1),
        new Vector4(0.196078, 0.160784, 0.278431, 1),
      ];

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        rotation: { value: rotation },
        light_origin: { value: lightPosition },
        time_speed: { value: rotationSpeed },
        n_colors: { value: numOfColors },
        colors: { value: colorPalette },
        tilt: { value: tilt },
        n_layers: { value: numOfLayers },
        layer_height: { value: layerHeight },
        zoom: { value: zoom },
        swirl: { value: swirl },
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

export default GalaxyShader;
