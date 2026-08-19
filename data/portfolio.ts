export type Project = {
  id: string;
  name: string;
  statement: string;
  background: string;
  problem: string;
  solution: string;
  process: string;
  result: string;
  theme: "glacier" | "lilac" | "mist";
  visual: "interface" | "system" | "workspace";
};

export const projects: Project[] = [
  {
    id: "project-01",
    name: "PROJECT TITLE",
    statement: "Short project description goes here.",
    background: "Short project description goes here.",
    problem: "Short project description goes here.",
    solution: "Short project description goes here.",
    process: "Short project description goes here.",
    result: "Short project description goes here.",
    theme: "glacier",
    visual: "interface",
  },
  {
    id: "project-02",
    name: "PROJECT TITLE",
    statement: "Short project description goes here.",
    background: "Short project description goes here.",
    problem: "Short project description goes here.",
    solution: "Short project description goes here.",
    process: "Short project description goes here.",
    result: "Short project description goes here.",
    theme: "lilac",
    visual: "system",
  },
  {
    id: "project-03",
    name: "PROJECT TITLE",
    statement: "Short project description goes here.",
    background: "Short project description goes here.",
    problem: "Short project description goes here.",
    solution: "Short project description goes here.",
    process: "Short project description goes here.",
    result: "Short project description goes here.",
    theme: "mist",
    visual: "workspace",
  },
];

export type Tool = {
  mark: string;
  name: string;
  description: string;
};

export const tools: Tool[] = [
  { mark: "DF", name: "Dify", description: "Building AI agents and workflow prototypes." },
  { mark: "AI", name: "OpenAI", description: "Designing model behavior, tools and evaluations." },
  { mark: "N8", name: "n8n", description: "Connecting products through reliable automations." },
  { mark: "FG", name: "Figma", description: "Shaping interfaces and testing product ideas early." },
  { mark: "NT", name: "Notion", description: "Organizing research, decisions and living systems." },
  { mark: "PY", name: "Python", description: "Prototyping data, model and automation logic." },
];

export const contacts = [
  { label: "Email", value: "hello@lukina.ai", href: "mailto:hello@lukina.ai" },
  { label: "Tel-phone", value: "+86 000 0000 0000", href: "tel:+8600000000000" },
  { label: "WeChat", value: "Lukina", href: "#contact" },
  { label: "Linkedin", value: "linkedin.com/in/lukina", href: "https://linkedin.com/" },
];
