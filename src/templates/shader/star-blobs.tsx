"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-blobs-fragment.frag";
import vertexShader from "~/templates/shader/glsl/star-vertex.vert";

export const StarBlobsShader = ({
  pixels = 100.0,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = new Vector4(255 / 255, 165 / 255, 0 / 255);

  const planetOptions = {
    uniforms: {
      pixels: { value: pixels },
      color: { value: colorPalette },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
      circle_amount: { value: 3.0 },
      circle_size: { value: 1.5 },
      scale: { value: 1.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
