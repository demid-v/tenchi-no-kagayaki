import * as THREE from "three";

import noise from "./glsl/noise.vert";
import fragmentShader from "./glsl/planet-fragment.frag";
import vertexShader from "./glsl/planet-vertex.vert";

const shaders = {
  vertexShader: vertexShader.replace(
    "void main() {",
    `${noise}
    void main() {`,
  ),
  fragmentShader: fragmentShader.replace(
    "void main() {",
    `${noise}
    void main() {`,
  ),
};

export type PlanetShaderUni = {
  type?: number;
  permutation?: number;
  amplitude?: number;
  sharpness?: number;
  offset?: number;
  period?: number;
  persistence?: number;
  lacunarity?: number;
  octaves?: number;
  color1?: [number, number, number];
  color2?: [number, number, number];
  color3?: [number, number, number];
  color4?: [number, number, number];
  color5?: [number, number, number];
};

export const Planet = ({
  type,
  permutation,
  amplitude,
  sharpness,
  offset,
  period,
  persistence,
  lacunarity,
  octaves,
  color1,
  color2,
  color3,
  color4,
  color5,
}: PlanetShaderUni) => {
  const PlanetShader = {
    uniforms: {
      type: { value: type ?? 2 },
      permutation: { value: permutation ?? 289.0 },
      radius: { value: 20.0 },
      amplitude: { value: amplitude ?? 1.0 },
      sharpness: { value: sharpness ?? 2.6 },
      offset: { value: offset ?? -0.016 },
      period: { value: period ?? 0.6 },
      persistence: { value: persistence ?? 0.484 },
      lacunarity: { value: lacunarity ? lacunarity : 1.8 },
      octaves: { value: octaves ?? 10 },
      undulation: { value: 0.0 },
      ambientIntensity: { value: 0.02 },
      diffuseIntensity: { value: 1 },
      specularIntensity: { value: 2 },
      shininess: { value: 10 },
      lightDirection: { value: new THREE.Vector3(1, 1, 1) },
      lightColor: { value: new THREE.Color(0xffffff) },
      bumpStrength: { value: 1.0 },
      bumpOffset: { value: 0.001 },
      color1: {
        value: color1
          ? new THREE.Color(color1[0], color1[1], color1[2])
          : new THREE.Color(0.014, 0.117, 0.279),
      },
      color2: {
        value: color2
          ? new THREE.Color(color2[0], color2[1], color2[2])
          : new THREE.Color(0.08, 0.527, 0.351),
      },
      color3: {
        value: color3
          ? new THREE.Color(color3[0], color3[1], color3[2])
          : new THREE.Color(0.62, 0.516, 0.372),
      },
      color4: {
        value: color4
          ? new THREE.Color(color4[0], color4[1], color4[2])
          : new THREE.Color(0.149, 0.254, 0.084),
      },
      color5: {
        value: color5
          ? new THREE.Color(color5[0], color5[1], color5[2])
          : new THREE.Color(0.15, 0.15, 0.15),
      },
      // color1: { value: new THREE.Color(0.678, 0.184, 0.271) },
      // color2: { value: new THREE.Color(0.902, 0.271, 0.224) },
      // color3: { value: new THREE.Color(1, 0.537, 0.2) },
      // color4: { value: new THREE.Color(0.239, 0.161, 0.212) },
      // color5: { value: new THREE.Color(0.322, 0.2, 0.247) },
      transition2: { value: 0.071 },
      transition3: { value: 0.215 },
      transition4: { value: 0.372 },
      transition5: { value: 1.2 },
      blend12: { value: 0.152 },
      blend23: { value: 0.152 },
      blend34: { value: 0.104 },
      blend45: { value: 0.168 },
    },
    ...shaders,
  };

  return <shaderMaterial attach="material" {...PlanetShader}></shaderMaterial>;
};
