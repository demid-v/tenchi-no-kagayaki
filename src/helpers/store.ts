import { Provider, atom, createStore } from "jotai";
import { Vector3, Vector4 } from "three";
import { OrthographicCamera } from "three";
import { OrbitControls } from "three-stdlib";

const store = createStore();
const JotaiProvider = ({ children }: { children: React.ReactNode }) =>
  Provider({ children, store });

const cameraAtom = atom<OrthographicCamera | null>(null);
const orbitAtom = atom<OrbitControls | null>(null);
const sceneAtom = atom<"starSystem" | "galaxy" | "galaxyCluster">(
  "galaxyCluster",
);

const pixelsAtom = atom(100);
const showOrbitsAtom = atom(false);

type StarSystemsType = Map<
  number,
  {
    star: {
      position: Vector3;
      color: Vector4;
    };
  }
>;

const starSystemsBaseAtom = atom<StarSystemsType>();

const currentStarSystemIdAtom = atom<number | null>(null);

const initStarAtom = atom(
  null,
  (get, set, params: { key: number; position: Vector3; color: Vector4 }) => {
    const starSystems =
      get(starSystemsBaseAtom) ?? (new Map() as StarSystemsType);

    const newStarSystem = starSystems.set(params.key, {
      star: { position: params.position.clone(), color: params.color },
    });

    set(starSystemsBaseAtom, newStarSystem);
  },
);

const currentStarSystemAtom = atom((get) =>
  get(starSystemsBaseAtom)?.get(get(currentStarSystemIdAtom)!),
);

type GalaxyType = Map<
  number,
  {
    position: Vector3;
    colors: Vector4[];
    swirl: number;
    seed: number;
  }
>;

const galaxyBaseAtom = atom<GalaxyType>();

const currentGalaxyIdAtom = atom<number | null>(null);

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
      position: Vector3;
      colors: Vector4[];
      swirl: number;
      seed: number;
    },
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
  cameraAtom,
  orbitAtom,
  sceneAtom,
  pixelsAtom,
  showOrbitsAtom,
  currentStarSystemIdAtom,
  initStarAtom,
  currentStarSystemAtom,
  currentGalaxyIdAtom,
  initGalaxyAtom,
  currentGalaxyAtom,
};
