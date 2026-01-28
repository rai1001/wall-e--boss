import { parseIntent } from "../intent";

describe("intent parser", () => {
  it("parses nota", () => {
    const res = parseIntent("nota: comprar pienso");
    expect(res.type).toBe("TASK");
    if (res.type === "TASK") {
      expect(res.title).toContain("comprar");
      expect(res.priority).toBe("NORMAL");
    }
  });

  it("parses recuérdame", () => {
    const res = parseIntent("recuérdame llamar al proveedor");
    expect(res.type).toBe("TASK");
    if (res.type === "TASK") {
      expect(res.priority).toBe("IMPORTANT");
      expect(res.tags).toContain("work");
    }
  });

  it("falls back to task", () => {
    const res = parseIntent("pasear a Akira");
    expect(res.type).toBe("TASK");
    if (res.type === "TASK") {
      expect(res.tags).toContain("dogs");
    }
  });

  it("detects estudio con minutos", () => {
    const res = parseIntent("estudio 25 min de IA");
    expect(res.type).toBe("TASK");
    if (res.type === "TASK") {
      expect(res.title).toContain("25");
      expect(res.tags).toContain("study");
    }
  });
});
