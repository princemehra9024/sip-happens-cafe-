import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { CrayonDefs } from "@/components/CrayonDefs";
import { Cursor } from "@/components/Cursor";
import { Frame } from "@/components/Frame";
import { FrameNav } from "@/components/FrameNav";
import { Header } from "@/components/Header";
import { SplashScreen } from "@/components/SplashScreen";
import { DARK_FRAMES, FRAME_IDS } from "@/data/content";
import { EngineContext } from "@/engine/context";
import { useFrameEngine } from "@/engine/useFrameEngine";
import { EventFrame } from "@/frames/EventFrame";
import { FooterFrame } from "@/frames/FooterFrame";
import { FridaysFrame } from "@/frames/FridaysFrame";
import { HeroFrame } from "@/frames/HeroFrame";
import { JournalFrame } from "@/frames/JournalFrame";
import { MenuFrame } from "@/frames/MenuFrame";
import { MerchFrame } from "@/frames/MerchFrame";
import { Panels } from "@/ui/Panels";
import { UIProvider, useUI } from "@/ui/UIContext";

/**
 * Seven full-screen frames stacked in one fixed viewport.
 * The engine (GSAP Observer) moves exactly one frame per scroll / swipe / key.
 */
function Shell() {
  const { annOpen } = useUI();

  return (
    <div data-ann={annOpen ? "open" : "closed"} className="fixed inset-0 overflow-clip">
      <Header />

      <main className="absolute inset-0">
        <Frame index={0} label="Welcome to Snap Café">
          <HeroFrame />
        </Frame>
        <Frame index={1} label="Menu">
          <MenuFrame />
        </Frame>
        <Frame index={2} label="Snap Fridays">
          <FridaysFrame />
        </Frame>
        <Frame index={3} label="Upcoming event: Mat & Matcha">
          <EventFrame />
        </Frame>
        <Frame index={4} label="Café Goods">
          <MerchFrame />
        </Frame>
        <Frame index={5} label="The Daily Pour — journal">
          <JournalFrame />
        </Frame>
        <Frame index={6} label="Visit and contact" tone="dark">
          <FooterFrame />
        </Frame>
      </main>

      <FrameNav />
      <Panels />
      <Cursor />
    </div>
  );
}

export default function App() {
  const engine = useFrameEngine(FRAME_IDS, DARK_FRAMES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engine.lock(loading);
  }, [engine, loading]);

  return (
    <MotionConfig reducedMotion="user">
      <EngineContext.Provider value={engine}>
        <UIProvider>
          <CrayonDefs />
          <SplashScreen onComplete={() => setLoading(false)} />
          <Shell />
        </UIProvider>
      </EngineContext.Provider>
    </MotionConfig>
  );
}
