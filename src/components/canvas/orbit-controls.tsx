import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useSetAtom } from "jotai";
import { useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { currentStarSystemIdAtom, sceneAtom } from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();
  const [scene, setScene] = useAtom(sceneAtom);
  const setCurrentStarSystem = useSetAtom(currentStarSystemIdAtom);

  const orbitRef = useRef<OrbitControlsImpl>(null);

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      target={[0, 0, 0]}
      enableRotate={false}
      onChange={() => {
        if (scene === "starSystem" && camera.zoom < 0.2) {
          setScene("galaxy");
        } else if (scene === "galaxy" && camera.zoom < 0.2) {
          setCurrentStarSystem(null);
          setScene("galaxyCluster");
        }
      }}
    />
  );
};

export default Controls;
