"use client";

import { useRef } from "react";
import { createStoryCamera, type CameraPoint } from "./storyCamera";

/** Preserves the camera's look-at interpolation for the lifetime of a story. */
export function useStoryCamera(initialLookAt: CameraPoint) {
  const controller = useRef<ReturnType<typeof createStoryCamera> | null>(null);
  if (controller.current === null) controller.current = createStoryCamera(initialLookAt);
  return controller.current;
}
