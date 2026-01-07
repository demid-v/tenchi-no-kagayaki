precision mediump float;

varying vec2 vUv;

uniform float pixels;
uniform float time_speed;
uniform float rotation;
uniform vec4 colors[1];

uniform float circle_amount;
uniform float circle_size;

uniform float size;

uniform float seed;
uniform float time;

float rand(vec2 co) {
  co = mod(co, vec2(1.0, 1.0) * floor(size + 0.5));
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);
}

vec2 rotate(vec2 vec, float angle) {
  vec -= vec2(0.5);
  vec *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));
  vec += vec2(0.5);
  return vec;
}

float circle(vec2 uv) {
  float invert = 1.0 / circle_amount;

  if (mod(uv.y, invert * 2.0) < invert) {
    uv.x += invert * 0.5;
  }
  vec2 rand_co = floor(uv * circle_amount) / circle_amount;
  uv = mod(uv, invert) * circle_amount;

  float r = rand(rand_co);
  r = clamp(r, invert, 1.0 - invert);
  float circle = distance(uv, vec2(r));
  return smoothstep(
    circle,
    circle + 0.5,
    invert * circle_size * rand(rand_co * 1.5)
  );
}

void main() {
  vec2 pixelized = floor(vUv.xy * pixels) / pixels + 0.5;

  vec2 uv = rotate(pixelized, rotation);

  // angle from centered uv's
  float angle = atan(uv.x - 0.5, uv.y - 0.5);
  float d = distance(pixelized, vec2(0.5));

  float c = 0.0;
  for (int i = 0; i < 15; i++) {
    float r = rand(vec2(float(i)));
    vec2 circleUV = vec2(d, angle);
    c += circle(circleUV * size - time * time_speed - 1.0 / d * 0.1 + r);
  }

  c *= 0.37 - d;
  c = step(0.07, c - d);

  gl_FragColor = vec4(colors[0].xyz, c * colors[0].a);
}
