"use client";

import { useFrame } from "@react-three/fiber";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { Vector2, Vector3, Vector4 } from "three";
import * as Three from "three";

import Stars from "~/components/canvas/star-system/stars";
import {
  type StarSystemsType,
  currentGalaxyAtom,
  currentGalaxyIdAtom,
  initStarsAtom,
} from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import GalaxyGlow from "./galaxy-glow";
import Star from "./star";

const galaxyRadius = 500;
const rotation = 0;
const timeSpeed = 0;
const numOfcolors = 6;
const size = 7;
const octaves = 1;
const time = 0;
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

  coord = coord.subScalar(0.5);

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

  const groupRef = useRef<Three.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotateZ(-0.0001);
  });

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
      coord = coord.multiplyScalar(2);
    }

    return value;
  };

  const { stars, starElements } = useMemo(() => {
    if (!currentGalaxy)
      return { stars: new Map() as StarSystemsType, starElements: [] };

    return new Array(20000).fill(0).reduce(
      (acc, _item, i) => {
        let uv = new Vector2(getRandom(), getRandom());

        uv = uv.multiplyScalar(zoom);
        uv = uv.subScalar((zoom - 1) / 2);

        uv = rotate(uv, rotation);
        const uv2 = uv.clone();

        const d_to_center = uv.distanceTo(new Vector2(0.5, 0.5));
        const rot = currentGalaxy.swirl * Math.pow(d_to_center, 0.4);
        const rotated_uv = rotate(uv, rot + time * timeSpeed);

        let f1 = fbm(rotated_uv.clone().multiplyScalar(size));
        f1 = Math.floor(f1 * numOfLayers) / numOfLayers;

        uv2.y -= f1 * layerHeight;

        const d_to_center2 = uv2.distanceTo(new Vector2(0.5, 0.5));
        const rot2 = currentGalaxy.swirl * Math.pow(d_to_center2, 0.4);
        const rotated_uv2 = rotate(uv2, rot2 + time * timeSpeed);

        let f2 = fbm(
          rotated_uv2
            .clone()
            .multiplyScalar(size)
            .addScalar(f1 * 5),
        );

        const p = uv.clone().subScalar(0.5).multiplyScalar(galaxyRadius);
        const position = new Vector3(p.x, p.y, 0);

        let a = step(f2 + d_to_center2, 0.7);

        if (a === 0) {
          // if (getRandom() < 1 - Math.pow(1 - d_to_center2, 2) / 50) return acc;
          // else {
          //   a = 1;
          // }
          return acc;
        }

        f2 *= 2.3;
        f2 = Math.floor(f2 * numOfcolors);
        f2 = Math.min(f2, numOfcolors);

        const col = currentGalaxy.colors[f2];
        const color = new Vector4(col?.x, col?.y, col?.z, a * f2);

        acc.starElements.push(
          <Star key={i} starId={i} position={position} color={color} />,
        );

        return {
          stars: acc.stars.set(i, { position, color }),
          starElements: acc.starElements,
        };
      },
      { stars: new Map() as StarSystemsType, starElements: [] },
    );
  }, [currentGalaxy]);

  useEffect(() => {
    setStars(stars);
  }, [stars]);

  return (
    <group>
      <Stars />
      <group key={currentGalaxyId ?? undefined} ref={groupRef}>
        {currentGalaxyId && currentGalaxy && (
          <GalaxyGlow
            colors={currentGalaxy.colors}
            swirl={currentGalaxy.swirl}
            seed={currentGalaxy.seed}
            pixels={5000}
            rotation={0}
            position={[0, 0, 0]}
          />
        )}
        <group position={[0, 0, 1]}>{starElements}</group>
      </group>
    </group>
  );
};

export default Galaxy;
