precision mediump float;

varying vec3 vUv;

uniform float pixels;
uniform float rotation;
uniform float time_speed;
uniform bool should_dither;
uniform vec4 colors[7];
uniform int n_colors;

uniform float size;
uniform int OCTAVES;
uniform float seed;

uniform float time;
uniform float tilt;
uniform float n_layers;
uniform float layer_height;
uniform float zoom;
uniform float swirl;
uniform float brightness;

float rand(vec2 coord) {
  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);
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
  float scale = 0.5;

  for (int i = 0; i < OCTAVES; i++) {
    value += noise(coord) * scale;
    coord *= 2.0;
    scale *= 0.5;
  }
  return value;
}

vec2 rotate(vec2 coord, float angle) {
  coord -= 0.5;
  coord *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));
  return coord + 0.5;
}

bool dither(vec2 uv1, vec2 uv2) {
  return mod(uv1.x + uv2.y, 2.0 / pixels) <= 1.0 / pixels;
}

void main() {
  vec2 uv = floor(vUv.xy * pixels) / pixels + 0.5;
  bool dith = dither(uv, vUv.xy);

  // I added a little zooming functionality so I dont have to mess with other values to get correct sizing.
  uv *= zoom;
  uv -= (zoom - 1.0) / 2.0;

  // overall rotation of galaxy
  uv = rotate(uv, rotation);
  vec2 uv2 = uv; // save a copy of untranslated uv for later

  // this uv is used to determine where the "layers" will be
  uv.y *= tilt;
  uv.y -= (tilt - 1.0) / 2.0;

  float d_to_center = distance(uv, vec2(0.5, 0.5));
  // swirl uv around the center, the further from the center the more rotated.
  float rot = swirl * pow(d_to_center, 0.4);
  vec2 rotated_uv = rotate(uv, rot + time * time_speed);

  // fbm will decide where the layers are
  float f1 = fbm(rotated_uv * size);
  // quantize to a few different values, so layers don't blur through each other
  f1 = floor(f1 * n_layers) / n_layers;

  // use the unaltered second uv for the actual galaxy
  // tilt so it looks like it's an angle.
  uv2.y *= tilt;
  uv2.y -= (tilt - 1.0) / 2.0 + f1 * layer_height;

  // now do the same stuff as before, but for the actual galaxy image, not the layers
  float d_to_center2 = distance(uv2, vec2(0.5, 0.5));
  float rot2 = swirl * pow(d_to_center2, 0.4);
  vec2 rotated_uv2 = rotate(uv2, rot2 + time * time_speed);
  // I offset the second fbm by some amount so the don't all use the same noise, try it wihout and the layers are very obvious
  float f2 = fbm(rotated_uv2 * size + vec2(f1) * 5.0);

  // alpha
  float a = step(f2 + d_to_center2, 0.7);

  // some final steps to choose a nice color
  f2 *= 2.3;
  if (should_dither && dith) {
    // dithering
    f2 *= 0.94;
  }

  f2 = floor(f2 * float(n_colors));
  f2 = min(f2, float(n_colors));
  vec4 col = colors[int(f2)] * brightness;

  gl_FragColor = vec4(col.xyz, a * col.a);
}
