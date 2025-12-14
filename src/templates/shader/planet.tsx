import * as THREE from "three";

import noise from "./glsl/noise.vert";
import fragmentShader from "./glsl/planet-fragment.frag";
import vertexShader from "./glsl/planet-vertex.vert";

const PlanetShader = {
  uniforms: {
    type: { value: 2 },
    radius: { value: 20.0 },
    amplitude: { value: 1.19 },
    sharpness: { value: 2.6 },
    offset: { value: -0.016 },
    period: { value: 0.6 },
    persistence: { value: 0.484 },
    lacunarity: { value: 1.8 },
    octaves: { value: 10 },
    undulation: { value: 0.0 },
    ambientIntensity: { value: 0.02 },
    diffuseIntensity: { value: 1 },
    specularIntensity: { value: 2 },
    shininess: { value: 10 },
    lightDirection: { value: new THREE.Vector3(1, 1, 1) },
    lightColor: { value: new THREE.Color(0xffffff) },
    bumpStrength: { value: 1.0 },
    bumpOffset: { value: 0.001 },
    color1: { value: new THREE.Color(0.014, 0.117, 0.279) },
    color2: { value: new THREE.Color(0.08, 0.527, 0.351) },
    color3: { value: new THREE.Color(0.62, 0.516, 0.372) },
    color4: { value: new THREE.Color(0.149, 0.254, 0.084) },
    color5: { value: new THREE.Color(0.15, 0.15, 0.15) },
    transition2: { value: 0.071 },
    transition3: { value: 0.215 },
    transition4: { value: 0.372 },
    transition5: { value: 1.2 },
    blend12: { value: 0.152 },
    blend23: { value: 0.152 },
    blend34: { value: 0.104 },
    blend45: { value: 0.168 },
  },
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

export const Planet = () => (
  <shaderMaterial attach="material" {...PlanetShader}></shaderMaterial>
);
