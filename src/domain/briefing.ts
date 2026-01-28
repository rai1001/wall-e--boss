import { DayClassification } from "./dayTypes";
import { PlanResult, Task } from "./planEngine";

type BriefingStyle = "FAMILY" | "WORK";

const formatVip = (tasks: Task[]) =>
  tasks.length === 0 ? "Sin VIP ahora" : tasks.map((t) => t.title).join(" · ");

export function buildBriefing(
  style: BriefingStyle,
  classification: DayClassification,
  plan: PlanResult,
  tasks: Task[],
): string {
  const vip = tasks.filter((t) => t.priority === "VIP" || t.tags.includes("health") || t.tags.includes("dogs"));
  const hasEvento = classification.hasEvento ? "Sí (eventos)" : "No";
  const isOff = classification.dayType === "OFF";
  const option = plan.recommended;

  if (style === "WORK") {
    return [
      `Agenda: ${classification.dayType} | eventos: ${hasEvento} | descanso: ${classification.hasDescanso ? "sí" : "no"}`,
      classification.dayType === "EXTREME" || classification.dayType === "LONG"
        ? "Operativa: mínimo imprescindible (pedidos + prep + etiquetado crítico)"
        : "Operativa: stock rápido + rotación + tareas equipo",
      `VIP: ${formatVip(vip)}`,
      "Huecos: perros primero; descanso si día largo; máster solo si queda limpio",
      `Plan recomendado: ${option}. ¿A, B o C?`,
    ].join(" | ");
  }

  // FAMILY tone
  const perroLinea = "Perros primero: Akira, Nala y Kal-El con paseos cortos (10-15m).";
  const casaLinea =
    classification.dayType === "OFF"
      ? "Casa: si hay hueco, metemos 60 o profunda; si no, relax."
      : classification.dayType === "LONG" || classification.dayType === "EXTREME"
        ? "Casa: solo 15 min mínimo viable."
        : "Casa: 30 min normal.";
  const estudioLinea =
    classification.dayType === "LONG" || classification.dayType === "EXTREME"
      ? "Máster: hoy solo si aparece hueco limpio, si no lo movemos sin culpa."
      : "Máster: te reservo un micro hueco 20-30 min si queda limpio.";

  return [
    `Rai, hoy es día ${classification.dayType.toLowerCase()}. Eventos: ${hasEvento}. Descanso: ${isOff ? "sí" : "no"}.`,
    classification.dayType === "EXTREME" || classification.dayType === "LONG"
      ? "Operativa: pedidos + prep + etiquetado crítico. Vamos al mínimo imprescindible."
      : "Operativa: stock rápido + rotación + tareas del equipo.",
    `Top VIP: ${formatVip(vip)}.`,
    perroLinea,
    casaLinea,
    estudioLinea,
    `Plan recomendado: ${option}. ¿A, B o C?`,
  ].join(" ");
}
