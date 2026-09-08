/** Shared domain values; this module has no browser or state-library dependency. */
export type EnvironmentId = "home" | "residence" | "retail";

export type ProblemId =
  | "automatic-access"
  | "guest-access"
  | "protect-space"
  | "reservations"
  | "parking-guidance"
  | "reduce-queues"
  | "ev-charging";

export type ExperiencePhase = "arrival" | "scan" | "reveal" | "choose" | EnvironmentId;
export type GuestAccessPreview = "active" | "expired";

export type EnvironmentConfiguration = Readonly<{
  selectedProblems: readonly ProblemId[];
  solarEnabled: boolean;
}>;

export type Configurations = Readonly<Partial<Record<EnvironmentId, EnvironmentConfiguration>>>;
