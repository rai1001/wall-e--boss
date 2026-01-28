import { CalendarEvent, DayClassification } from "./dayTypes";

export type Task = {
  id: string;
  title: string;
  priority: "VIP" | "IMPORTANT" | "NORMAL";
  tags: string[];
  due_at: string | null;
  status: "TODO" | "DOING" | "DONE" | "SNOOZED";
};

export type PlanBlockType = "DOG_WALK" | "HOUSE" | "STUDY" | "WORK" | "REST";

export type PlanBlock = {
  type: PlanBlockType;
  label: string;
  minutes: number;
  anchor?: "WAKE" | "BEFORE_WORK" | "AFTER_WORK" | "NIGHT";
  suggested_time?: string;
  meta?: Record<string, unknown>;
};

export type PlanOption = {
  option: "A" | "B" | "C";
  summary: string;
  blocks: PlanBlock[];
  reasons: string[];
};

export type PlanResult = {
  recommended: "A" | "B" | "C";
  options: PlanOption[];
};

const dogBlocks = (dayType: DayClassification["dayType"]): PlanBlock[] => {
  if (dayType === "EXTREME") {
    return [
      { type: "DOG_WALK", label: "Paseo esencial (despertar)", minutes: 10, anchor: "WAKE" },
      { type: "DOG_WALK", label: "Paseo esencial (vuelta)", minutes: 10, anchor: "AFTER_WORK" },
      { type: "DOG_WALK", label: "Paseo esencial (noche)", minutes: 10, anchor: "NIGHT" },
    ];
  }
  if (dayType === "LONG") {
    return [
      { type: "DOG_WALK", label: "Paseo al despertar", minutes: 10, anchor: "WAKE" },
      { type: "DOG_WALK", label: "Paseo antes de salir", minutes: 10, anchor: "BEFORE_WORK" },
      { type: "DOG_WALK", label: "Paseo al volver", minutes: 10, anchor: "AFTER_WORK" },
      { type: "DOG_WALK", label: "Paseo noche (opcional)", minutes: 10, anchor: "NIGHT" },
    ];
  }
  return [
    { type: "DOG_WALK", label: "Paseo al despertar", minutes: 10, anchor: "WAKE" },
    { type: "DOG_WALK", label: "Paseo antes de salir", minutes: 10, anchor: "BEFORE_WORK" },
    { type: "DOG_WALK", label: "Paseo al volver", minutes: 10, anchor: "AFTER_WORK" },
    { type: "DOG_WALK", label: "Paseo noche", minutes: 10, anchor: "NIGHT" },
  ];
};

const houseBlockForDay = (dayType: DayClassification["dayType"]): PlanBlock => {
  if (dayType === "OFF") {
    return { type: "HOUSE", label: "Casa 60 (si hay hueco real)", minutes: 60 };
  }
  if (dayType === "LONG" || dayType === "EXTREME") {
    return { type: "HOUSE", label: "Casa 15 (mínimo viable)", minutes: 15 };
  }
  return { type: "HOUSE", label: "Casa 30 (normal)", minutes: 30 };
};

const studyBlock = (dayType: DayClassification["dayType"]): PlanBlock | null => {
  if (dayType === "LONG" || dayType === "EXTREME") return null;
  return { type: "STUDY", label: "Máster IA micro", minutes: 20 };
};

const vipTasks = (tasks: Task[]) =>
  tasks.filter((t) => t.priority === "VIP" || t.tags.includes("work"));

export function buildPlans(
  classification: DayClassification,
  events: CalendarEvent[],
  tasks: Task[],
): PlanResult {
  const dogs = dogBlocks(classification.dayType);
  const house = houseBlockForDay(classification.dayType);
  const study = studyBlock(classification.dayType);
  const vip = vipTasks(tasks).slice(0, 3);

  const vipBlock: PlanBlock[] =
    vip.length > 0
      ? [
          {
            type: "WORK",
            label: `VIP: ${vip.map((v) => v.title).join(" / ")}`,
            minutes: 30,
          },
        ]
      : [];

  const baseReasons = [`tipo ${classification.dayType}`, classification.reason];

  const optionA: PlanOption = {
    option: "A",
    summary: "Supervivencia: perros + VIP + casa 15",
    blocks: [...dogs, ...vipBlock, house.type === "HOUSE" ? { ...house, label: "Casa 15 (mínimo)" } : house],
    reasons: baseReasons,
  };

  const optionB: PlanOption = {
    option: "B",
    summary: "Equilibrado: perros + VIP + casa normal + 1 micro máster",
    blocks: [...dogs, ...vipBlock, house, ...(study ? [study] : [])],
    reasons: [...baseReasons, "añade estudio si hay hueco"],
  };

  const optionC: PlanOption = {
    option: "C",
    summary: "Ambicioso: incluye casa 60 y máster si hay hueco limpio",
    blocks: [
      ...dogs,
      ...vipBlock,
      classification.dayType === "OFF" ? { type: "HOUSE", label: "Casa profunda", minutes: 90 } : { ...house, minutes: 60, label: "Casa 60 (general)" },
      ...(study ? [{ ...study, minutes: 30, label: "Máster 30" }] : []),
    ],
    reasons: [...baseReasons, "solo si el día está libre"],
  };

  let recommended: PlanResult["recommended"] = "B";
  if (classification.dayType === "EXTREME" || classification.dayType === "LONG") {
    recommended = "A";
  } else if (classification.dayType === "OFF") {
    recommended = "C";
  }

  // adjust suspected off
  if (classification.suspectedOff && recommended !== "C") {
    recommended = "C";
    optionC.reasons.push("hueco sospechoso, posible descanso");
  }

  return {
    recommended,
    options: [optionA, optionB, optionC],
  };
}
