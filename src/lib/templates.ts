import data from "@/data/templates.json";

export type Template = { id: string; name: string; description: string; category: string; website: string | null; color: string | null; logo: string | null };

export const templates = data as Template[];

export const categories = [...new Set(templates.map((t) => t.category))].sort();
