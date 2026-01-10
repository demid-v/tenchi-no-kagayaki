"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { Vector2, Vector3, Vector4 } from "three";

import Stars from "~/components/canvas/star-system/stars";
import { initStarAtom } from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import { colors, seed } from "../galaxy-cluster/cluster";
import Star from "./star";

const galaxyRadius = 500;

const fract = <T extends number | Vector2>(x: T): T => {
  if (x instanceof Vector2) {
    return new Vector2(fract(x.x), fract(x.y)) as T;
  }

  return ((x as number) - Math.floor(x)) as T;
};

const mix = (x: number, y: number, a: number) => x * (1.0 - a) + y * a;

const step = (edge: number, x: number) => {
  if (x === 0 && edge === 0) return 0;
  return x < edge ? 0 : 1;
};

function rand(coord: Vector2) {
  coord = coord.clone();

  return fract(
    Math.sin(coord.dot(new Vector2(12.9898, 78.233))) * 15.5453 * seed,
  );
}

function noise(coord: Vector2) {
  coord = coord.clone();

  const i = coord.clone().floor();
  const f = fract(coord);

  const a = rand(i);
  const b = rand(new Vector2(i.x + 1, i.y));
  const c = rand(new Vector2(i.x, i.y + 1));
  const d = rand(new Vector2(i.x + 1, i.y + 1));

  const cubic = new Vector2(
    f.x * f.x * (3.0 - 2.0 * f.x),
    f.y * f.y * (3.0 - 2.0 * f.y),
  );

  return (
    mix(a, b, cubic.x) +
    (c - a) * cubic.y * (1.0 - cubic.x) +
    (d - b) * cubic.x * cubic.y
  );
}

function fbm(coord: Vector2) {
  coord = coord.clone();

  let value = 0;

  for (let i = 0, scale = 0.5; i < OCTAVES; i++, scale *= 0.5) {
    value += noise(coord) * scale;
    coord = coord.multiplyScalar(2);
  }

  return value;
}

function rotate(coord: Vector2, angle: number) {
  coord = coord.clone();

  coord = coord.subScalar(0.5);

  coord = new Vector2(
    coord.dot(new Vector2(Math.cos(angle), -Math.sin(angle))),
    coord.dot(new Vector2(Math.sin(angle), Math.cos(angle))),
  );

  return coord.addScalar(0.5);
}

const rotation = 0;
const time_speed = 0;
const n_colors = 6;
const size = 7;
const OCTAVES = 1;
const time = 0;
const layer_height = 0.4;
const zoom = 1.375;
const n_layers = 4;
const swirl = -9;

const Galaxy = () => {
  const setStar = useSetAtom(initStarAtom);

  const stars = useMemo(() => {
    return new Array(20000)
      .fill(0)
      .map((_el, i) => {
        let uv = new Vector2(getRandom(), getRandom());

        uv = uv.multiplyScalar(zoom);
        uv = uv.subScalar((zoom - 1.0) / 2.0);

        uv = rotate(uv, rotation);
        const uv2 = uv.clone();

        const d_to_center = uv.distanceTo(new Vector2(0.5, 0.5));
        const rot = swirl * Math.pow(d_to_center, 0.4);
        const rotated_uv = rotate(uv, rot + time * time_speed);

        let f1 = fbm(rotated_uv.multiplyScalar(size));
        f1 = Math.floor(f1 * n_layers) / n_layers;

        uv2.x -= f1 * layer_height;

        const d_to_center2 = uv2.distanceTo(new Vector2(0.5, 0.5));
        const rot2 = swirl * Math.pow(d_to_center2, 0.4);
        const rotated_uv2 = rotate(uv2, rot2 + time * time_speed);
        let f2 = fbm(rotated_uv2.multiplyScalar(size).addScalar(f1 * 5.0));

        const position1 = new Vector3(
          ...uv.subScalar(0.5).multiplyScalar(galaxyRadius),
          0,
        );

        const position2 = new Vector3(
          ...uv2.subScalar(0.5).multiplyScalar(galaxyRadius),
          0,
        );

        const position = Math.random() < 0.5 ? position1 : position2;

        const a = step(f2 + d_to_center2, 0.7);

        if (a === 0) return null;

        f2 *= 2.3;
        f2 = Math.floor(f2 * n_colors);
        f2 = Math.min(f2, n_colors);
        const col = colors[f2];

        const color = new Vector4(col?.x, col?.y, col?.z, a * f2);

        return {
          key: i,
          position,
          colors,
          element: (
            <Star key={i} starId={i} position={position} color={color} />
          ),
        };
      })
      .filter((el) => el != null);
  }, []);

  useEffect(() => {
    stars.forEach((star) => {
      setStar({
        key: star.key,
        position: star.position,
        colors: star.colors,
      });
    });
  }, [stars]);

  return (
    <group>
      <Stars />
      {stars.map((star) => star.element)}
    </group>
  );
};

export default Galaxy;
