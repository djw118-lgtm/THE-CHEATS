import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import LandingPage from "@/pages/landing";
import GapsPage from "@/pages/gaps";
import StreaksPage from "@/pages/streaks";
import RepeatsPage from "@/pages/repeats";
import WatchPage from "@/pages/watch";
import CalculatorPage from "@/pages/calculator";
import NotFound from "@/pages/not-found";
import AgeVerification from "@/components/AgeVerification";
function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/gaps" component={GapsPage} />
        <Route path="/streaks" component={StreaksPage} />
        <Route path="/repeats" component={RepeatsPage} />
        <Route path="/watch" component={WatchPage} />
        <Route path="/calculator" component={CalculatorPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const [ageVerified, setAgeVerified] = useState(false);

if (!ageVerified) {
  return <AgeVerification onVerified={() => setAgeVerified(true)} />;
}
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
