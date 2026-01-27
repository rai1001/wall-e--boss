export type Priority = "VIP" | "Important" | "Normal";
export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  tags: string[];
  due_date?: string | null;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export interface BriefingSection {
  title: string;
  items: string[];
}

export interface Briefing {
  day: string;
  mode: string;
  is_off_day: boolean;
  off_day_suspected: boolean;
  agenda: BriefingSection[];
  plan_summary: string[];
  top_vip: string[];
  dogs: string[];
  house: string[];
}

export interface PlanBlock {
  label: string;
  focus: string;
  reason: string;
  blocks: string[];
}

export interface PlanToday {
  date: string;
  suggestion: string;
  plans: PlanBlock[];
}
