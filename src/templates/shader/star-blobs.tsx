"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-blobs.frag";
import vertexShader from "~/templates/shader/glsl/star.vert";

export const StarBlobsShader = ({
  pixels = 200.0,
  color = new Vector4(1, 0.647, 0),
  rotationSpeed = 0.05,
  rotation = 0.0,
  circleAmount = 3.0,
  circleSize = 1.6,
  size = 4,
  octaves = 4,
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
  size?: number;
  tiles?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        time_speed: { value: rotationSpeed },
        rotation: { value: rotation },
        colors: { value: [color] },
        circle_amount: { value: circleAmount },
        circle_size: { value: circleSize },
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
