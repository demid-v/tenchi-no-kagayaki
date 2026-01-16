import { Provider, atom, createStore } from "jotai";
import { Vector3, Vector4 } from "three";
import { OrthographicCamera } from "three";
import { OrbitControls } from "three-stdlib";

const store = createStore();
const JotaiProvider = ({ children }: { children: React.ReactNode }) =>
  Provider({ children, store });

const sceneAtom = atom<"starSystem" | "galaxy" | "galaxyCluster">(
  "galaxyCluster",
);

const pixelsAtom = atom(100);
const showOrbitsAtom = atom(false);

type StarMapValue = {
  position: Vector3;
  color: Vector4;
};

type StarSystemsType = Map<number, StarMapValue>;

const starSystemsBaseAtom = atom<StarSystemsType>();
const currentStarSystemIdAtom = atom<number | null>();

const initStarsAtom = atom(null, (_get, set, stars: StarSystemsType) => {
  set(starSystemsBaseAtom, stars);
});

const currentStarSystemAtom = atom((get) =>
  get(starSystemsBaseAtom)?.get(get(currentStarSystemIdAtom)!),
);

type GalaxyValueType = {
  position: Vector3;
  colors: Vector4[];
  swirl: number;
  seed: number;
};

type GalaxyType = Map<number, GalaxyValueType>;

const galaxyBaseAtom = atom<GalaxyType>();
const currentGalaxyIdAtom = atom<number | null>();

const initGalaxyAtom = atom(
  null,
  (
    get,
    set,
    {
      key,
      position,
      colors,
      swirl,
      seed,
    }: {
      key: number;
    } & GalaxyValueType,
  ) => {
    const galaxies = get(galaxyBaseAtom) ?? (new Map() as GalaxyType);

    const newGalaxy = galaxies.set(key, {
      position: position.clone(),
      colors,
      swirl,
      seed,
    });

    set(galaxyBaseAtom, newGalaxy);
  },
);

const currentGalaxyAtom = atom((get) =>
  get(galaxyBaseAtom)?.get(get(currentGalaxyIdAtom)!),
);

export {
  JotaiProvider,
  sceneAtom,
  pixelsAtom,
  showOrbitsAtom,
  currentStarSystemIdAtom,
  initStarsAtom,
  currentStarSystemAtom,
  currentGalaxyIdAtom,
  initGalaxyAtom,
  currentGalaxyAtom,
};
export type { StarSystemsType };
