"use client";

import { useSetAtom } from "jotai";
import { Suspense, useEffect, useMemo } from "react";
import { Vector3 } from "three";

import { randomizeColors } from "~/components/canvas/star";
import { initStarAtom } from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import Star from "./star";

const InsideGalaxy = () => {
  const setStar = useSetAtom(initStarAtom);

  const stars = useMemo(() => {
    const galaxyRadius = 10000;

    return new Array(5000).fill(0).map((_el, i) => {
      const radius = Math.random() * galaxyRadius;
      const branch = ((i % 5) / 5) * Math.PI * 2;
      const spin = ((radius * 1.5) / galaxyRadius) * 2;

      const branchWidth =
        Math.cos((Math.PI / galaxyRadius) * (radius / 2.2)) *
        getRandom(galaxyRadius / 30, galaxyRadius / 1.8);

      const position = new Vector3(
        Math.cos(branch + spin) * radius + getRandom(-0.5, 0.5) * branchWidth,
        Math.sin(branch + spin) * radius + getRandom(-0.5, 0.5) * branchWidth,
        0,
      );

      const colors = randomizeColors();

      return {
        key: i,
        position,
        colors,
        element: (
          <Star key={i} starId={i} position={position} color={colors.at(2)!} />
        ),
      };
    });
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
    <Suspense fallback={null}>{stars.map((star) => star.element)}</Suspense>
  );
};

export default InsideGalaxy;
