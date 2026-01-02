"use client";

import { Suspense } from "react";

import { getRandom } from "~/helpers/utils";

import Star from "./star";

const InsideGalaxy = () => {
  const stars = new Array(5000).fill(0).map((_el, i) => {
    return <Star key={i} />;
  });

  return <Suspense fallback={null}>{stars}</Suspense>;
};

export default InsideGalaxy;
