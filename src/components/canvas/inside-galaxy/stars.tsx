"use client";

import { useSetAtom } from "jotai";
import { Suspense } from "react";
import { Vector3 } from "three";

import { randomizeColors } from "~/components/canvas/star";
import { initStarAtom } from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

import Star from "./star";

const InsideGalaxy = () => {
  const setStar = useSetAtom(initStarAtom);

  const stars = new Array(5000).fill(0).map((_el, i) => {
    const position = new Vector3(
      getRandom(-5000, 5000),
      getRandom(-5000, 5000),
      -1,
    );

    const colors = randomizeColors();

    setStar({
      key: i,
      position,
      colors,
    });

    return (
      <Star key={i} starId={i} position={position} color={colors.at(3)!} />
    );
  });

  return <Suspense fallback={null}>{stars}</Suspense>;
};

export default InsideGalaxy;
