"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { JSX, useEffect, useMemo, useRef } from "react";
import { Vector2, Vector3, Vector4 } from "three";
import * as Three from "three";

import {
  type StarSystemsType,
  currentGalaxyAtom,
  currentGalaxyIdAtom,
  initStarsAtom,
} from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import GalaxyGlow from "./galaxy-glow";
import Star from "./star";

const radius = 1000;
const rotation = Math.PI * (4 / 5);
const numOfcolors = 6;
const size = 7;
const octaves = 1;
const tilt = 2;
const layerHeight = 0.4;
const zoom = 1.375;
const numOfLayers = 4;

const fract = <T extends number | Vector2>(x: T): T => {
  if (x instanceof Vector2) {
    return new Vector2(fract(x.x), fract(x.y)) as T;
  }

  return ((x as number) - Math.floor(x)) as T;
};

const mix = (x: number, y: number, a: number) => x * (1 - a) + y * a;

const step = (edge: number, x: number) => {
  if (x === 0 && edge === 0) return 0;
  return x < edge ? 0 : 1;
};

const rotate = (coord: Vector2, angle: number) => {
  coord = coord.clone();

  coord.subScalar(0.5);

  coord = new Vector2(
    coord.dot(new Vector2(Math.cos(angle), -Math.sin(angle))),
    coord.dot(new Vector2(Math.sin(angle), Math.cos(angle))),
  );

  return coord.addScalar(0.5);
};

const Galaxy = () => {
  const setStars = useSetAtom(initStarsAtom);
  const currentGalaxyId = useAtomValue(currentGalaxyIdAtom);
  const currentGalaxy = useAtomValue(currentGalaxyAtom);

  const rand = (coord: Vector2) => {
    coord = coord.clone();

    return fract(
      Math.sin(coord.dot(new Vector2(12.9898, 78.233))) *
        15.5453 *
        (currentGalaxy?.seed ?? 0),
    );
  };

  const noise = (coord: Vector2) => {
    coord = coord.clone();

    const i = coord.clone().floor();
    const f = fract(coord);

    const a = rand(i);
    const b = rand(new Vector2(i.x + 1, i.y));
    const c = rand(new Vector2(i.x, i.y + 1));
    const d = rand(new Vector2(i.x + 1, i.y + 1));

    const cubic = new Vector2(
      f.x * f.x * (3 - 2 * f.x),
      f.y * f.y * (3 - 2 * f.y),
    );

    return (
      mix(a, b, cubic.x) +
      (c - a) * cubic.y * (1 - cubic.x) +
      (d - b) * cubic.x * cubic.y
    );
  };

  const fbm = (coord: Vector2) => {
    coord = coord.clone();

    let value = 0;

    for (let i = 0, scale = 0.5; i < octaves; i++, scale *= 0.5) {
      value += noise(coord) * scale;
      coord.multiplyScalar(2);
    }

    return value;
  };

  const { stars, starElements } = useMemo(() => {
    if (!currentGalaxy) {
      return { stars: new Map() as StarSystemsType, starElements: [] };
    }

    const stars = {
      stars: new Map() as StarSystemsType,
      starElements: [] as JSX.Element[],
    };

    let protection = 0;

    while (stars.stars.size < 5000) {
      const position0 = new Vector2(getRandom(), getRandom());

      let uv = position0.clone();

      uv.multiplyScalar(zoom);
      uv.subScalar((zoom - 1) / 2);

      uv = rotate(uv, rotation);
      const uv2 = uv.clone();

      uv.setY(uv.y * tilt - (tilt - 1) / 2);

      const d_to_center = uv.distanceTo(new Vector2(0.5, 0.5));
      const rot = currentGalaxy.swirl * Math.pow(d_to_center, 0.4);
      const rotated_uv = rotate(uv, rot);

      let f1 = fbm(rotated_uv.multiplyScalar(size));
      f1 = Math.floor(f1 * numOfLayers) / numOfLayers;

      uv2.setY(uv2.y * tilt - ((tilt - 1) / 2 + f1 * layerHeight));

      const d_to_center2 = uv2.distanceTo(new Vector2(0.5, 0.5));
      const rot2 = currentGalaxy.swirl * Math.pow(d_to_center2, 0.4);
      const rotated_uv2 = rotate(uv2, rot2);

      let f2 = fbm(rotated_uv2.multiplyScalar(size).addScalar(f1 * 5));

      position0.subScalar(0.5).multiplyScalar(radius);
      const position = new Vector3(position0.x, position0.y, 0);

      let a = step(f2 + d_to_center2, 0.7);

      if (a === 0) {
        if (protection > 20000) break;

        protection++;
        continue;
      }

      f2 *= 2.3;
      f2 = Math.floor(f2 * numOfcolors);
      f2 = Math.min(f2, numOfcolors);

      const col = currentGalaxy.colors[f2];
      const color = new Vector4(col?.x, col?.y, col?.z, a * f2);

      const i = stars.stars.size;

      stars.stars.set(i, { position, color });
      stars.starElements.push(
        <Star
          key={i + Math.random()}
          starId={i}
          position={position}
          color={color}
        />,
      );
    }

    return stars;
  }, [currentGalaxy]);

  console.log(stars.size);

  useEffect(() => {
    setStars(stars);
  }, [stars]);

  return (
    <group key={currentGalaxyId ?? undefined}>
      {currentGalaxyId && currentGalaxy && (
        <GalaxyGlow
          radius={radius}
          colors={currentGalaxy.colors}
          swirl={currentGalaxy.swirl}
          seed={currentGalaxy.seed}
          pixels={5000}
          tilt={tilt}
          rotation={rotation}
          position={[0, 0, 0]}
        />
      )}
      <group position={[0, 0, 1]}>{starElements}</group>
    </group>
  );
};

export default Galaxy;
