import { atom } from "jotai";
import { Vector3, Vector4 } from "three";

const pixelsAtom = atom(100);
const showOrbitsAtom = atom(false);
const shuffleAtom = atom(false);

const sceneAtom = atom<"starSystem" | "galaxy">("galaxy");

type StarSystemsType = Map<
  number,
  {
    star: {
      position: Vector3;
      colors: Vector4[];
    };
    planets?: { position: [number, number, number]; colors: Vector4[] }[];
  }
>;

const starSystemsBaseAtom = atom<StarSystemsType>();

const currentStarSystemAtom = atom<number | null>(null);

const initStarAtom = atom(
  null,
  (get, set, params: { key: number; position: Vector3; colors: Vector4[] }) => {
    const starSystems =
      get(starSystemsBaseAtom) ?? (new Map() as StarSystemsType);

    const newStarSystem = starSystems.set(params.key, {
      star: { position: params.position, colors: params.colors },
    });

    set(starSystemsBaseAtom, newStarSystem);
  },
);

const starSystemAtom = atom((get) =>
  get(starSystemsBaseAtom)?.get(get(currentStarSystemAtom)!),
);

export {
  pixelsAtom,
  showOrbitsAtom,
  shuffleAtom,
  sceneAtom,
  currentStarSystemAtom,
  initStarAtom,
  starSystemAtom,
  starSystemsBaseAtom,
};
