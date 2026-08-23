import type { EnvironmentId, ProblemId } from "@/components/experience/useExperienceStore";

type Problem = {
  id: ProblemId;
  label: string;
  resultTitle: string;
  resultBody: string;
};

type Environment = {
  id: EnvironmentId;
  index: string;
  name: string;
  hint: string;
  eyebrow: string;
  question: string;
  description: string;
  problems: Problem[];
};

export const environments: Environment[] = [
  {
    id: "home",
    index: "01",
    name: "My home",
    hint: "Garage, family, guests & charging",
    eyebrow: "Private home",
    question: "What should feel effortless at home?",
    description:
      "Choose a daily annoyance. MacroPark will reshape the arrival around the people and cars you trust.",
    problems: [
      {
        id: "automatic-access",
        label: "Open my garage automatically",
        resultTitle: "Arrive. It opens.",
        resultBody:
          "Your known vehicle is recognized on approach and the entrance opens without a remote, card or phone ritual.",
      },
      {
        id: "guest-access",
        label: "Make guest access easier",
        resultTitle: "Guests get the right window.",
        resultBody:
          "Give a visitor access for the hours you choose. When the visit ends, their access ends with it.",
      },
      {
        id: "ev-charging",
        label: "Charge my EV at home",
        resultTitle: "Parking becomes charging.",
        resultBody:
          "Add a charger to the same arrival experience, with the option to pair it with solar later.",
      },
    ],
  },
  {
    id: "residence",
    index: "02",
    name: "My residence",
    hint: "Residents, visitors & protected spaces",
    eyebrow: "Residence",
    question: "What causes the most friction for residents?",
    description:
      "We can make entry calmer, protect assigned spaces and give temporary visitors exactly the access they need.",
    problems: [
      {
        id: "protect-space",
        label: "People take assigned spaces",
        resultTitle: "Your space stays yours.",
        resultBody:
          "A private parking blocker keeps the bay protected and lowers only when the authorized resident arrives.",
      },
      {
        id: "reservations",
        label: "Reserve spaces for visitors or residents",
        resultTitle: "A space can wait for the right car.",
        resultBody:
          "Hold a specific bay for a chosen time window. It stays visibly reserved until the authorized vehicle arrives or the reservation ends.",
      },
      {
        id: "guest-access",
        label: "Visitors keep calling at the gate",
        resultTitle: "Invite once. No gate calls.",
        resultBody:
          "Residents can pre-authorize a guest for a chosen time window, so arrival happens without waiting for someone to answer.",
      },
      {
        id: "ev-charging",
        label: "We need shared EV charging",
        resultTitle: "Charging that belongs to the residence.",
        resultBody:
          "Create shared or assigned charging bays and let access follow the same resident and reservation rules as parking.",
      },
    ],
  },
  {
    id: "retail",
    index: "03",
    name: "Retail / mall",
    hint: "Flow, free spaces & customer charging",
    eyebrow: "Retail & commercial",
    question: "What should customers notice first?",
    description:
      "Choose the experience you want to improve. The parking can react before the customer ever reaches the entrance doors.",
    problems: [
      {
        id: "reduce-queues",
        label: "Reduce queues at the entrance",
        resultTitle: "Keep arrivals moving.",
        resultBody:
          "Vehicles are recognized as they approach, reducing stop-and-wait friction at controlled entrances and exits.",
      },
      {
        id: "parking-guidance",
        label: "Help customers find free spaces",
        resultTitle: "Guide them to what is free.",
        resultBody:
          "Available areas become visible immediately and arriving drivers can be guided toward useful open spaces instead of circling.",
      },
      {
        id: "reservations",
        label: "Offer reserved or premium parking",
        resultTitle: "Save the right space before arrival.",
        resultBody:
          "Customers, VIP guests or event visitors can reserve a designated bay before they arrive, with the space released automatically when the window ends.",
      },
      {
        id: "ev-charging",
        label: "Offer customer EV charging",
        resultTitle: "Turn dwell time into charge time.",
        resultBody:
          "Dedicated charging spaces add a useful service for visitors and can later connect to solar canopies and reservations.",
      },
    ],
  },
];

export function getEnvironment(id: EnvironmentId | null) {
  return environments.find((environment) => environment.id === id) ?? null;
}

export function getProblem(environmentId: EnvironmentId | null, problemId: ProblemId | null) {
  return getEnvironment(environmentId)?.problems.find((problem) => problem.id === problemId) ?? null;
}
