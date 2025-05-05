export interface Task {
  id: string;
  title: string;
  assignee: "Vincent" | "Jannes" | "Joy" | "Partners";
  date: string;
  start: string;
  end: string;
  tags: ("Physical BD" | "Cold-call" | "Marketing" | "Build" | "Admin" | "Content"
        | "Networking" | "Tooling" | "Referral" | "Audit")[];
  notes?: string;
  rrule?: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  kpi: string;
  description: string;
}

export interface ConstraintWarning {
  message: string;
  task: Task;
  type: 'vincent-evenings' | 'jannes-hours' | 'jannes-late-evenings' | 'physical-bd-days';
}
