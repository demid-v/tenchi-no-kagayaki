import { useAtom } from "jotai";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { pixelsAtom, showOrbitsAtom, shuffleAtom } from "~/helpers/store";

const Header = () => {
  const [pixels, setPixels] = useAtom(pixelsAtom);
  const [_showOrbits, setShowOrbits] = useAtom(showOrbitsAtom);
  const [_shuffle, setShuffle] = useAtom(shuffleAtom);

  return (
    <header className="absolute top-0 z-10 flex min-h-10 w-full items-center justify-end gap-x-5 px-3 py-2">
      <div className="flex gap-x-2">
        <div className="text-secondary">{pixels} px</div>
        <Slider
          defaultValue={[100]}
          min={100}
          max={5000}
          step={100}
          className="w-56"
          onValueChange={(pixels) => setPixels(pixels.at(0)!)}
        />
      </div>
      <div className="flex gap-x-2">
        <Checkbox
          id="orbits"
          className="border-secondary"
          onCheckedChange={(newState) =>
            setShowOrbits(newState === "indeterminate" ? false : newState)
          }
        />
        <Label htmlFor="orbits" className="text-secondary">
          Orbits
        </Label>
      </div>
      <Button
        variant="secondary"
        onClick={() => setShuffle((shuffle) => !shuffle)}
      >
        Next system
      </Button>
    </header>
  );
};

export default Header;
