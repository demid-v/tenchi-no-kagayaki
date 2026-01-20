import { useAtomValue } from "jotai";

import Stars from "~/components/canvas/stars";
import "~/components/canvas/view";
import { currentGalaxyIdAtom } from "~/helpers/store";

import Galaxy from "./galaxy";

const Scene = () => {
  const currentGalaxyId = useAtomValue(currentGalaxyIdAtom);

  return (
    <>
      <Stars />
      <Galaxy key={currentGalaxyId} />
    </>
  );
};

export default Scene;
