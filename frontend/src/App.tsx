import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { FilterTabs } from "./components/filter-tab";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button className="rounded-full" variant={"secondary"} size={"icon"}>
        <Navigation />
      </Button>
      <FilterTabs />
    </div>
  );
}

export default App;
