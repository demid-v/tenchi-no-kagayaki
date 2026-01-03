import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useSetAtom } from "jotai";

import { sceneAtom } from "~/helpers/store";

const Controls = () => {
  const { camera } = useThree();
  const setScene = useSetAtom(sceneAtom);

  return (
    <OrbitControls
      onChange={() => {
        if (camera.zoom > 0.1) return;
        setScene("galaxy");
      }}
    />
  );
};

export default Controls;
