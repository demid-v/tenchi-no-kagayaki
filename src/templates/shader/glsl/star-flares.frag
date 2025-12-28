precision mediump float;

varying vec3 vUv;

uniform float pixels;
uniform float time_speed;
uniform float rotation;
uniform vec4 colors[2];

uniform float storm_width;
uniform float storm_dither_width;
uniform float circle_amount;
uniform float circle_scale;
uniform float scale;

uniform float size;
uniform int OCTAVES;
uniform bool should_dither;

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
    invert * circle_scale * rand(rand_co * 1.5)
  );
}

float noise(vec2 coord) {
  vec2 i = floor(coord);
  vec2 f = fract(coord);

  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));

  vec2 cubic = f * f * (3.0 - 2.0 * f);

  return mix(a, b, cubic.x) +
  (c - a) * cubic.y * (1.0 - cubic.x) +
  (d - b) * cubic.x * cubic.y;
}

float fbm(vec2 coord) {
  float value = 0.0;
  float scl = 0.5;

  for (int i = 0; i < OCTAVES; i++) {
    value += noise(coord) * scl;
    coord *= 2.0;
    scl *= 0.5;
  }
  return value;
}

bool dither(vec2 uv1, vec2 uv2) {
  return mod(uv1.x + uv2.y, 2.0 / pixels) <= 1.0 / pixels;
}

void main() {
  vec2 pixelized = floor(vUv.xy * pixels) / pixels + 0.5;

  bool dith = dither(vUv.xy, pixelized);

  pixelized = rotate(pixelized, rotation);

  // counter rotation against rotation caused by the way uv's are made later
  vec2 uv = pixelized; //rotate(pixelized, -time  * time_speed);

  // angle from centered uv's
  float angle = atan(uv.x - 0.5, uv.y - 0.5) * 0.4;
  // distance from center
  float d = distance(pixelized, vec2(0.5));

  // we make uv circular here to have eternally outward moving stuff
  vec2 circleUV = vec2(d, angle);

  // two types of noise values
  float n = fbm(circleUV * size - time * time_speed);
  float nc = circle(circleUV * scale - time * time_speed + n);

  nc *= 1.5;
  float n2 = fbm(circleUV * size - time + vec2(100, 100));
  nc -= n2 * 0.1;

  // our alpha, default 0
  float a = 0.0;
  if (1.0 - d > nc) {
    // now we generate very thin strips of positive alpha if our noise has certain values and is close enough to center
    if (nc > storm_width - storm_dither_width + d && (dith || !should_dither)) {
      a = 1.0;
    } else if (nc > storm_width + d) {
      // could use an or statement instead, but this looks more clear to me
      a = 1.0;
    }
  }

  // use our two noise values to assign colors
  float interpolate = floor(n2 + nc);
  vec4 col = colors[int(interpolate)];

  // final step to not have everything appear from the center
  a *= step(n2 * 0.25, d);

  gl_FragColor = vec4(col.rgb, a * col.a);
}
