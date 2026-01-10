import { Provider, atom, createStore } from "jotai";
import { Vector3, Vector4 } from "three";
import { OrthographicCamera } from "three";
import { OrbitControls } from "three-stdlib";

const store = createStore();
const JotaiProvider = ({ children }: { children: React.ReactNode }) =>
  Provider({ children, store });

const cameraAtom = atom<OrthographicCamera | null>(null);
const orbitAtom = atom<OrbitControls | null>(null);
const sceneAtom = atom<"starSystem" | "galaxy" | "galaxyCluster">("galaxy");

const pixelsAtom = atom(100);
const showOrbitsAtom = atom(false);

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

const currentStarSystemIdAtom = atom<number | null>(null);

const initStarAtom = atom(
  null,
  (get, set, params: { key: number; position: Vector3; colors: Vector4[] }) => {
    const starSystems =
      get(starSystemsBaseAtom) ?? (new Map() as StarSystemsType);

    const newStarSystem = starSystems.set(params.key, {
      star: { position: params.position.clone(), colors: params.colors },
    });

    set(starSystemsBaseAtom, newStarSystem);
  },
);

const currentStarSystemAtom = atom((get) =>
  get(starSystemsBaseAtom)?.get(get(currentStarSystemIdAtom)!),
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
};
