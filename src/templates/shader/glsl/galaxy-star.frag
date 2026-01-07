precision mediump float;

varying vec2 vUv;

uniform float time;
uniform vec3 color;
uniform float brightness;
uniform float seed;

// simple 2D hash / PRNG
float rand21(vec2 uv) {
  vec2 t = fract(vec2(uv.x * 236.73, uv.y * 678.47));
  float u = dot(uv * (t + 143.66), t);
  return fract(t.x * u * 345.87 + 365.22 + t.y * u * 475.57);
}

float rand21p(vec2 uv) {
  vec2 p = floor(uv);
  vec2 fr = fract(uv);

  float grad =
    rand21(p + vec2(0.0, 0.0)) * (1.0 - fr.x) * (1.0 - fr.y) +
    rand21(p + vec2(1.0, 0.0)) * fr.x * (1.0 - fr.y) +
    rand21(p + vec2(0.0, 1.0)) * (1.0 - fr.x) * fr.y +
    rand21(p + vec2(1.0, 1.0)) * fr.x * fr.y;
  return grad;
}

// low-cost fractal noise (used for organic twinkle variation)
float perlin(vec2 uv, float layers) {
  float ret = 0.0;
  for (float i = 0.0; i < layers; i++) {
    ret += rand21p(uv * pow(2.0, i)) / layers;
  }
  return ret;
}

void main() {
  // fragment UV and distance to star center
  vec2 uv = vUv;

  // aspect-correct distance from fragment to star center
  float d = length(uv);

  // core + soft halo profiles (gaussian-like)
  float core = exp(-(d * d) / 0.01);
  float halo = exp(-(d * d) / (0.01 * 8.0));

  // organic twinkle: combine a slow perlin component and a faster sine
  // float n = perlin(vec2(time * 0.2), 4.0);
  // float sine = sin(time * seed * (0.6 + 0.8)) * 0.5;
  // float twinkle = 0.75 + 0.5 * (0.5 + 0.5 * sine) * (0.5 + 0.5 * n);

  float n = perlin(vec2(time * 0.15 + seed * 10.0, seed * 7.0) * 0.05, 4.0);
  float freq = 0.6 + 0.8 * n;
  float sine = sin(time * 6.28318 * freq + seed * 12.9898);
  float twinkle = 0.7 + 0.6 * (0.5 + 0.5 * sine) * (0.5 + 0.5 * n);

  // combine and apply brightness/color
  float intensity = (core + halo) * brightness * twinkle;
  vec3 col = color * intensity;

  // use intensity as alpha so fragments outside the star become transparent
  float a = clamp(intensity, 0.0, 1.0);
  if (a < 0.003) discard;

  gl_FragColor = vec4(col.xyz, a);
}
