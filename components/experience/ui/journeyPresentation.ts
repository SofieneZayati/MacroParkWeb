import type { ProblemId } from "../useExperienceStore";

/** Short navigation labels; full client needs remain in the domain catalog. */
export const solutionNames: Record<ProblemId, string> = {
  "automatic-access": "Automatic entry",
  "guest-access": "Guest access",
  "protect-space": "Private spaces",
  reservations: "Reservations",
  "parking-guidance": "Find a space",
  "reduce-queues": "Smooth arrivals",
  "ev-charging": "EV charging",
};
