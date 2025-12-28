"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import vertexShader from "~/templates/shader/glsl/planet.vert";
import fragmentShader from "~/templates/shader/glsl/rings.frag";

const RingsShader = ({
  pixels = 300.0,
  lightPosition = new Vector2(-0.1, 0.3),
  rotation = 2.5,
  rotationSpeed = 0.2,
  ringWidth = 0.127,
  ringPerspective = -6.0,
  scaleRelToPlanet = 6.0,
  numOfColors = 3,
  colors,
  darkColors,
  size = 15.0,
  octaves = 4,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  ringWidth?: number;
  ringPerspective?: number;
  scaleRelToPlanet?: number;
  numOfColors?: number;
  colors?: Vector4[];
  darkColors?: Vector4[];
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.933333, 0.764706, 0.603922, 1),
        new Vector4(0.701961, 0.478431, 0.313726, 1),
        new Vector4(0.560784, 0.337255, 0.231373, 1),
        new Vector4(0.333333, 0.188235, 0.211765, 1),
        new Vector4(0.196078, 0.137255, 0.215686, 1),
        new Vector4(0.133333, 0.12549, 0.203922, 1),
      ];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      rotation: { value: rotation },
      light_origin: { value: lightPosition },
      time_speed: { value: rotationSpeed },
      ring_width: { value: ringWidth },
      ring_perspective: { value: ringPerspective },
      scale_rel_to_planet: { value: scaleRelToPlanet },
      n_colors: { value: numOfColors },
      colors: { value: colorPalette },
      size: { value: size },
      OCTAVES: { value: octaves },
      seed: { value: seed },
      time: { value: time },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};

export default RingsShader;
