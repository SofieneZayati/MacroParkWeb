"use client";

import { RetailAvailabilityLayer } from "./RetailAvailabilityLayer";
import { RetailChargingSequence } from "./RetailChargingSequence";
import { useExperienceStore } from "./useExperienceStore";

export function ScenePolish() {
  const demoRevision = useExperienceStore((state) => state.demoRevision);

  return (
    <>
      <RetailAvailabilityLayer />
      <RetailChargingSequence key={demoRevision} />
    </>
  );
}
