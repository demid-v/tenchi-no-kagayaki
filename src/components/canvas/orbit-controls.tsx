import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useLayoutEffect, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  currentStarSystemAtom,
  currentStarSystemIdAtom,
  orbitAtom,
  sceneAtom,
} from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();
  const [scene, setScene] = useAtom(sceneAtom);
  const setCurrentStarSystem = useSetAtom(currentStarSystemIdAtom);

  const orbitRef = useRef<OrbitControlsImpl>(null);

  const setOrbit = useSetAtom(orbitAtom);

  useEffect(() => {
    if (orbitRef.current === null) return;

    setOrbit(orbitRef.current);
  }, [camera]);

  useEffect(() => {
    if (orbitRef.current === null) return;

    orbitRef.current.enableDamping = true;
  }, [scene]);

  useLayoutEffect(() => {
    if (scene !== "starSystem" || orbitRef.current === null) return;

    orbitRef.current.target.set(0, 0, 0);
    orbitRef.current.update();
  }, [scene]);

  const currentStarSystem = useAtomValue(currentStarSystemAtom);

  useLayoutEffect(() => {
    if (scene !== "galaxy" || orbitRef.current === null) return;

    camera.zoom = currentStarSystem ? 5 : 1;

    const { x, y, z } = currentStarSystem?.star.position.clone() ?? {
      x: 0,
      y: 0,
      z: 0,
    };

    orbitRef.current.target.set(x, y, z);
    orbitRef.current.update();

    camera.position.set(x, y, 1000);
    camera.updateProjectionMatrix();
  }, [scene, currentStarSystem, camera]);

  useLayoutEffect(() => {
    if (scene !== "galaxyCluster" || orbitRef.current === null) return;

    camera.zoom = 1;

    orbitRef.current.target.set(0, 0, 0);
    orbitRef.current.update();

    camera.position.set(0, 0, 1000);
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  return (
    <OrbitControls
      ref={orbitRef}
      target={[0, 0, 0]}
      enableRotate={false}
      onChange={() => {
        if (scene === "starSystem" && camera.zoom < 0.2) {
          orbitRef.current!.enableDamping = false;

          setScene("galaxy");
        } else if (scene === "galaxy" && camera.zoom < 0.6) {
          orbitRef.current!.enableDamping = false;

          setCurrentStarSystem(null);
          setScene("galaxyCluster");
        }
      }}
    />
  );
};

export default Controls;
