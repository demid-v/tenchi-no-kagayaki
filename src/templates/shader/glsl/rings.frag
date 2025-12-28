precision mediump float;

varying vec3 vUv;

uniform float pixels;
uniform float rotation;
uniform vec2 light_origin;
uniform float time_speed;
uniform float ring_width;
uniform float ring_perspective;
uniform float scale_rel_to_planet;

uniform int n_colors;
uniform vec4 colors[6];
vec4 light_colors[3];
vec4 dark_colors[3];

uniform float size;
uniform int OCTAVES;
uniform float seed;
uniform float time;

float rand(vec2 coord) {
  coord = mod(coord, vec2(2.0, 1.0) * floor(size + 0.5));
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

// by Leukbaars from https://www.shadertoy.com/view/4tK3zR
float circleNoise(vec2 uv) {
  float uv_y = floor(uv.y);
  uv.x += uv_y * 0.31;
  vec2 f = fract(uv);
  float h = rand(vec2(floor(uv.x), floor(uv_y)));
  float m = length(f - 0.25 - h * 0.5);
  float r = h * 0.25;
  return smoothstep(0.0, r, m * 0.75);
}

vec2 spherify(vec2 uv) {
  vec2 centered = uv * 2.0 - 1.0;
  float z = sqrt(1.0 - dot(centered.xy, centered.xy));
  vec2 sphere = centered / (z + 1.0);
  return sphere * 0.5 + 0.5;
}

vec2 rotate(vec2 coord, float angle) {
  coord -= 0.5;
  coord *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));
  return coord + 0.5;
}

void main() {
  // pixelize uv
  vec2 uv = floor(vUv.xy * pixels) / pixels + 0.5;

  float light_d = distance(uv, light_origin);
  uv = rotate(uv, rotation);

  // center is used to determine ring position
  vec2 uv_center = uv - vec2(0.0, 0.5);

  // tilt ring
  uv_center *= vec2(1.0, ring_perspective);
  float center_d = distance(uv_center, vec2(0.5, 0.0));

  // cut out 2 circles of different sizes and only intersection of the 2.
  float ring = smoothstep(0.5 - ring_width * 2.0, 0.5 - ring_width, center_d);
  ring *= smoothstep(center_d - ring_width, center_d, 0.4);

  // pretend like the ring goes behind the planet by removing it if it's in the upper half.
  if (uv.y < 0.5) {
    ring *= step(1.0 / scale_rel_to_planet, distance(uv, vec2(0.5)));
  }

  // rotate material in the ring
  uv_center = rotate(uv_center + vec2(0, 0.5), time * time_speed);
  // some noise
  ring *= fbm(uv_center * size);

  for (int i = 0; i < 3; i++) {
    light_colors[i] = colors[i];
  }

  for (int i = 0; i < 3; i++) {
    dark_colors[i] = colors[3 + i];
  }

  // apply some colors based on final value
  float posterized = floor((ring + pow(light_d, 2.0) * 2.0) * 4.0) / 4.0;
  posterized = min(posterized, 2.0);
  vec4 col;
  if (posterized <= 1.0) {
    col = light_colors[int(posterized * float(n_colors - 1))];
  } else {
    col = dark_colors[int((posterized - 1.0) * float(n_colors - 1))];
  }

  float ring_a = step(0.28, ring);
  gl_FragColor = vec4(col.rgb, ring_a * col.a);
}
