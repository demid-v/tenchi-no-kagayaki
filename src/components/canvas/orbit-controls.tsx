import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  currentGalaxyAtom,
  currentStarSystemAtom,
  currentStarSystemIdAtom,
  sceneAtom,
} from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();

  const [scene, setScene] = useAtom(sceneAtom);
  const setCurrentStarSystem = useSetAtom(currentStarSystemIdAtom);

  const currentStarSystem = useAtomValue(currentStarSystemAtom);
  const currentGalaxy = useAtomValue(currentGalaxyAtom);

  const { x, y } = (() => {
    if (scene === "galaxy" && currentStarSystem) {
      return {
        x: currentStarSystem.position.x,
        y: currentStarSystem.position.y,
      };
    } else if (scene === "galaxyCluster" && currentGalaxy) {
      return {
        x: currentGalaxy.position.x,
        y: currentGalaxy.position.y,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  })();

  return (
    <OrbitControls
      makeDefault
      target={[x, y, 0]}
      enableRotate={false}
      onChange={() => {
        if (scene === "starSystem" && camera.zoom < 0.2) {
          setScene("galaxy");
        } else if (scene === "galaxy" && camera.zoom < 0.6) {
          setCurrentStarSystem(null);
          setScene("galaxyCluster");
        }
      }}
    />
  );
};

export default Controls;
