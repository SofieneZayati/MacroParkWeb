import type { EnvironmentId, ProblemId } from "../useExperienceStore";

export type IconName = EnvironmentId | ProblemId | "arrow" | "check" | "play" | "pause" | "expand" | "settings";

const paths: Record<IconName, string> = {
  home: "M3 11 12 3l9 8M5 10v11h14V10M9 21v-8h6v8",
  residence: "M4 21V3h10v18M14 9h6v12M2 21h20M8 7h2m-2 4h2m-2 4h2m8-2h1m-1 4h1",
  retail: "M3 10h18v11H3zM2 10l3-6h14l3 6M8 4l-1 6m9-6 1 6M9 21v-7h6v7",
  "automatic-access": "M3 21V5h18v16M6 9h12M6 12h12M6 15h12M9 21v-3h6v3",
  "guest-access": "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M5 21v-3a7 7 0 0 1 14 0v3M18 4h4m-2-2v4",
  "protect-space": "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6",
  reservations: "M4 6h16v15H4zM8 3v6m8-6v6M4 11h16M8 16l2 2 5-4",
  "parking-guidance": "M5 21v-6a4 4 0 0 1 4-4h10M15 7l4 4-4 4M5 7V3",
  "reduce-queues": "M3 7h15m-4-4 4 4-4 4M6 17h15M10 13l-4 4 4 4",
  "ev-charging": "M7 21V4h9v17M5 21h13M10 7h3l-3 4h3M16 9h2l3 3v5a2 2 0 0 1-4 0v-3M19 7l2 2v3",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  play: "m8 4 12 8-12 8z",
  pause: "M8 5v14M16 5v14",
  expand: "M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5",
  settings: "M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-6 2v4",
};

export function JourneyIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
