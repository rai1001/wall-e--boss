import { classifyDay } from "../dayTypes";
import { buildPlans } from "../planEngine";

const baseEvents = [
  {
    title: "eventos 100 pax",
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString(),
    is_evento: true,
    is_descanso: false,
  },
];

const baseTasks = [
  { id: "1", title: "VIP pedido", priority: "VIP", tags: ["work"], due_at: null, status: "TODO" as const },
  { id: "2", title: "Casa 15", priority: "NORMAL", tags: ["home"], due_at: null, status: "TODO" as const },
];

describe("plan engine", () => {
  it("marks today long and tomorrow long when 100 pax evento", () => {
    const classification = classifyDay(baseEvents, null, "Europe/Madrid");
    expect(classification.dayType).toBe("LONG");
    expect(classification.tomorrowLong).toBe(true);
  });

  it("recommends A on long days", () => {
    const classification = classifyDay(baseEvents, null, "Europe/Madrid");
    const plan = buildPlans(classification, baseEvents, baseTasks);
    expect(plan.recommended).toBe("A");
    const dogs = plan.options[0].blocks.filter((b) => b.type === "DOG_WALK");
    expect(dogs.length).toBeGreaterThanOrEqual(3);
  });

  it("defaults to B on normal day", () => {
    const classification = classifyDay([], null, "Europe/Madrid");
    const plan = buildPlans({ ...classification, dayType: "NORMAL", suspectedOff: false }, [], baseTasks);
    expect(plan.recommended).toBe("B");
  });
});
