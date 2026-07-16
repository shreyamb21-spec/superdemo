import type { Stage1Output } from "./types";

export interface ChipContext {
  people: string[];
  systems: string[];
}

export function chipContextFrom(stage1: Stage1Output): ChipContext {
  const people = new Set<string>();
  const systems = new Set<string>();
  for (const w of stage1.workflows) {
    if (w.champion?.name) people.add(w.champion.name);
    for (const s of w.systems) systems.add(s);
  }
  return { people: [...people], systems: [...systems] };
}

const NUMBER_FACT =
  /\b\d[\d,.]*(?:\s?[-–]\s?\d[\d,.]*)?\s?(?:%|percent|days?|hours?|hrs|weeks?|months?|minutes?|apps?|ships?|tabs?|analysts?|builders?|reports?|cases|docs|queries|x)\b(?:\s(?:per|\/)\s?\w+)?/gi;

/** Pull scannable facts out of a prose block: names, @-refs, systems, numbers with units. */
export function extractChips(text: string, ctx: ChipContext, max = 5): string[] {
  const chips: string[] = [];
  const seen = new Set<string>();
  const push = (c: string) => {
    const key = c.toLowerCase().replace(/^@/, "");
    if (!seen.has(key) && chips.length < max) {
      seen.add(key);
      chips.push(c);
    }
  };

  for (const name of ctx.people) {
    const first = name.split(/\s+/)[0];
    if (first.length > 2 && new RegExp(`\\b${first}\\b`).test(text)) push(first);
  }
  for (const ref of text.match(/@[A-Za-z][\w-]*/g) ?? []) push(ref);
  for (const sys of ctx.systems) {
    const root = sys.split(/[(/]/)[0].trim();
    if (root.length > 2 && text.toLowerCase().includes(root.toLowerCase()))
      push(root);
  }
  for (const num of text.match(NUMBER_FACT) ?? []) push(num.trim());

  return chips;
}
