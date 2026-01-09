import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLayoutEffect, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  currentStarSystemAtom,
  currentStarSystemIdAtom,
  sceneAtom,
} from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();
  const [scene, setScene] = useAtom(sceneAtom);
  const setCurrentStarSystem = useSetAtom(currentStarSystemIdAtom);

  const ref = useRef<OrbitControlsImpl>(null);

  useLayoutEffect(() => {
    if (scene !== "starSystem") return;

    ref.current?.target.set(0, 0, 0);
  }, [scene]);

  const currentStarSystem = useAtomValue(currentStarSystemAtom);

  useLayoutEffect(() => {
    if (scene !== "galaxy" || ref.current === null) return;

    camera.zoom = currentStarSystem ? 5 : 1;

    const { x, y, z } = currentStarSystem?.star.position.clone() ?? {
      x: 0,
      y: 0,
      z: 0,
    };

    ref.current.target.set(x, y, z);
    ref.current.update();

    camera.position.set(x, y, 1000);
    camera.updateProjectionMatrix();
  }, [scene, currentStarSystem, camera]);

  useLayoutEffect(() => {
    if (scene !== "galaxyCluster" || ref.current === null) return;

    camera.zoom = 1;

    ref.current.target.set(0, 0, 0);
    ref.current.update();

    camera.position.set(0, 0, 1000);
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  return (
    <OrbitControls
      ref={ref}
      target={[0, 0, 0]}
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
