varying vec3 vUv;

uniform vec3 resolution;
uniform float time;

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

float perlin(vec2 uv, float layers) {
  float ret = 0.0;
  for (float i = 0.0; i < layers; i++) {
    ret += rand21p(uv * pow(2.0, i)) / layers;
  }
  return ret;
}

float splatter(float time, vec2 uv) {
  float n0 = perlin(uv + rand21(uv * dot(uv, vec2(time))), 9.0);
  return smoothstep(0.5, 0.55, n0);
}

float ease(float time, vec2 uv) {
  float cur = splatter(floor(time), uv);
  float next = splatter(floor(time) + 1.0, uv);
  float f = fract(time);
  return (1.0 - f) * cur + f * next;
}

void main() {
  vec2 uv = (vUv.xy - 0.5 / resolution.xy) / resolution.y;

  float stars = pow(rand21(uv), 200.0) * (ease(time * 2.0, uv) * 0.7 + 0.3);

  vec3 col = vec3(stars);

  gl_FragColor = vec4(col, 1.0);
}
