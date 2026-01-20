import { useAtomValue } from "jotai";

import Stars from "~/components/canvas/stars";
import { currentStarSystemIdAtom } from "~/helpers/store";

import StarSystem from "./star-system";

const Scene = () => {
  const currentStarSystemId = useAtomValue(currentStarSystemIdAtom);

  return (
    <>
      <Stars />
      <StarSystem key={currentStarSystemId} />
    </>
  );
};

export default Scene;
