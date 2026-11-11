import { createContext, useContext } from "react";
import type { FrameEngine } from "./useFrameEngine";

/* The engine itself — navigation, current frame, header tone */
export const EngineContext = createContext<FrameEngine | null>(null);

export function useEngine(): FrameEngine {
  const engine = useContext(EngineContext);
  if (!engine) throw new Error("useEngine must be used inside <EngineContext.Provider>");
  return engine;
}

/* What a component knows about the frame it sits in */
export interface FrameState {
  index: number;
  /** This frame is the one on screen */
  active: boolean;
  /** This frame is (or has been) within one step of the screen — safe to load media */
  load: boolean;
}

export const FrameContext = createContext<FrameState>({ index: 0, active: true, load: true });
export const useFrame = () => useContext(FrameContext);
