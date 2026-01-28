export type IntentResult =
  | { type: "TASK"; title: string; priority: "VIP" | "IMPORTANT" | "NORMAL"; tags: string[]; due_at?: string | null; source: "VOICE" }
  | { type: "UNKNOWN"; text: string };

const tagGuesses = (text: string): string[] => {
  const tags: string[] = [];
  const lower = text.toLowerCase();
  if (lower.includes("perro") || lower.includes("paseo") || lower.includes("akira") || lower.includes("nala") || lower.includes("kal-el") || lower.includes("kalel")) {
    tags.push("dogs");
  }
  if (lower.includes("casa") || lower.includes("limpiar") || lower.includes("basura")) tags.push("home");
  if (lower.includes("pedido") || lower.includes("proveedor") || lower.includes("evento")) tags.push("work");
  if (lower.includes("estudio") || lower.includes("máster") || lower.includes("master")) tags.push("study");
  if (lower.includes("médico") || lower.includes("vet") || lower.includes("veterinario")) {
    tags.push("health");
    tags.push("dogs");
  }
  if (lower.match(/(\d+)\s*min/)) tags.push("time");
  return tags.length ? tags : ["personal"];
};

export function parseIntent(input: string): IntentResult {
  const text = input.trim();
  if (!text) return { type: "UNKNOWN", text: input };

  const lower = text.toLowerCase();

  if (lower.startsWith("nota:")) {
    const title = text.slice(5).trim();
    return { type: "TASK", title, priority: "NORMAL", tags: tagGuesses(title), source: "VOICE" };
  }

  if (lower.startsWith("recuérdame")) {
    const title = text.replace(/recuérdame[:]?/i, "").trim();
    return { type: "TASK", title: title || "Recordatorio", priority: "IMPORTANT", tags: tagGuesses(title), source: "VOICE" };
  }

  const durationMatch = lower.match(/(\d+)\s*min/);
  if (durationMatch && lower.includes("estudio")) {
    const mins = parseInt(durationMatch[1] ?? "20", 10);
    return {
      type: "TASK",
      title: `Estudio ${mins} min`,
      priority: "IMPORTANT",
      tags: ["study", "time"],
      source: "VOICE",
    };
  }

  // fallback: create normal task
  return { type: "TASK", title: text, priority: "NORMAL", tags: tagGuesses(text), source: "VOICE" };
}
