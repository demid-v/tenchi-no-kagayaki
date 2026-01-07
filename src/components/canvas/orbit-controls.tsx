import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useAtomValue } from "jotai";
import { useLayoutEffect, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { currentStarSystemAtom, sceneAtom } from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();
  const [scene, setScene] = useAtom(sceneAtom);

  const ref = useRef<OrbitControlsImpl>(null);

  useLayoutEffect(() => {
    if (scene !== "starSystem") return;

    ref.current?.target.set(0, 0, 0);
  }, [scene]);

  const position = useAtomValue(currentStarSystemAtom);

  useLayoutEffect(() => {
    if (scene !== "galaxy" || position === undefined) return;

    camera.zoom = 1;

    const { x, y, z } = position.star.position.clone();
    ref.current?.target.set(x, y, z);
    ref.current?.update();

    camera.position.set(x, y, 1000);
    camera.updateProjectionMatrix();
  }, [scene, position, camera]);

  return (
    <OrbitControls
      ref={ref}
      target={[0, 0, 0]}
      enableRotate={false}
      onChange={() => {
        if (camera.zoom > 0.1) return;
        setScene("galaxy");
      }}
    />
  );
};

export default Controls;
