"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-blobs.frag";
import vertexShader from "~/templates/shader/glsl/star.vert";

export const StarBlobsShader = ({
  pixels = 100.0,
  color = new Vector4(1, 0.647, 0),
  rotationSpeed = 0.1,
  rotation = 0.0,
  circleAmount = 3.0,
  circleSize = 3.0,
  scale = 1.0,
  size = 4.0,
  tiles = 1.0,
  octaves = 4,
  shouldDither = true,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  color?: Vector4;
  rotationSpeed?: number;
  rotation?: number;
  circleAmount?: number;
  circleSize?: number;
  scale?: number;
  size?: number;
  tiles?: number;
  octaves?: number;
  shouldDither?: boolean;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      color: { value: color },
      circle_amount: { value: circleAmount },
      circle_size: { value: circleSize },
      scale: { value: scale },
      size: { value: size },
      TILES: { value: tiles },
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
