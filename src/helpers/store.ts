import { atom } from "jotai";

const pixelsAtom = atom(100);
const showOrbitsAtom = atom(false);
const shuffleAtom = atom(false);

const sceneAtom = atom<"starSystem" | "galaxy">("galaxy");

export { pixelsAtom, showOrbitsAtom, shuffleAtom, sceneAtom };
