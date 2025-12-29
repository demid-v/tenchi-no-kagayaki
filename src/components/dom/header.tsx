import { useAtom } from "jotai";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { showOrbitsAtom } from "~/helpers/store";

const Header = () => {
  const [_, setShowOrbits] = useAtom(showOrbitsAtom);

  return (
    <header className="absolute top-0 z-10 flex h-10 w-full items-center justify-end px-3">
      <Checkbox
        id="terms"
        className="mr-1 border-white"
        onCheckedChange={(newState) =>
          setShowOrbits(newState === "indeterminate" ? false : newState)
        }
      />
      <Label htmlFor="terms" className="text-white">
        Toggle orbits
      </Label>
    </header>
  );
};

export default Header;
