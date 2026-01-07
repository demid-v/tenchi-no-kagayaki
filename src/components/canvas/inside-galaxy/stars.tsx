"use client";

import { useSetAtom } from "jotai";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

import { randomizeColors } from "~/components/canvas/star";
import { initStarAtom } from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import Star from "./star";

const InsideGalaxy = () => {
  const setStar = useSetAtom(initStarAtom);
  const initialized = useRef(false);

  const stars = useMemo(() => {
    return new Array(5000).fill(0).map((_el, i) => {
      const position = new Vector3(
        getRandom(-5000, 5000),
        getRandom(-5000, 5000),
        -1,
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
    if (initialized.current) return;
    initialized.current = true;

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
