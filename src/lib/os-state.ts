export interface Agent {
  id: string;
  name: string;
  description?: string;
  status: "running" | "idle" | "pending" | "error";
  lastActive: string;
  tasksCompleted: number;
  model: string;
  tools?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "queued" | "failed";
  progress: number;
  agents: number;
  lastRun: string;
}

export interface SystemLog {
  id: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
  timestamp: string;
}

const DEFAULT_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Research Agent",
    status: "running",
    lastActive: "30s ago",
    tasksCompleted: 24,
    model: "Claude Sonnet",
    tools: ["web-search"],
  },
  {
    id: "agent-2",
    name: "Code Agent",
    status: "running",
    lastActive: "15s ago",
    tasksCompleted: 42,
    model: "GPT-4o",
    tools: ["code-gen", "file-read"],
  },
  {
    id: "agent-3",
    name: "Design Agent",
    status: "idle",
    lastActive: "5m ago",
    tasksCompleted: 18,
    model: "Gemini Pro",
    tools: ["file-read"],
  },
  {
    id: "agent-4",
    name: "QA Agent",
    status: "pending",
    lastActive: "10m ago",
    tasksCompleted: 31,
    model: "DeepSeek V3",
    tools: ["code-gen"],
  },
  {
    id: "agent-5",
    name: "Deploy Agent",
    status: "error",
    lastActive: "1h ago",
    tasksCompleted: 7,
    model: "Claude Sonnet",
    tools: ["deploy"],
  },
  {
    id: "agent-6",
    name: "Git Agent",
    status: "idle",
    lastActive: "2m ago",
    tasksCompleted: 53,
    model: "GPT-4o",
    tools: ["git"],
  },
];

const DEFAULT_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "Feature Development",
    status: "active",
    progress: 65,
    agents: 3,
    lastRun: "2m ago",
  },
  {
    id: "wf-2",
    name: "Bug Fix Sprint",
    status: "completed",
    progress: 100,
    agents: 2,
    lastRun: "1h ago",
  },
  { id: "wf-3", name: "Research Phase", status: "queued", progress: 0, agents: 1, lastRun: "—" },
  {
    id: "wf-4",
    name: "Code Review Pipeline",
    status: "active",
    progress: 42,
    agents: 2,
    lastRun: "5m ago",
  },
  {
    id: "wf-5",
    name: "Deploy to Production",
    status: "failed",
    progress: 88,
    agents: 3,
    lastRun: "30m ago",
  },
  {
    id: "wf-6",
    name: "Weekly Report Generation",
    status: "completed",
    progress: 100,
    agents: 1,
    lastRun: "2d ago",
  },
];

const DEFAULT_LOGS: SystemLog[] = [
  {
    id: "log-1",
    level: "info",
    source: "orchestrator",
    message: 'Started workflow "Feature Development"',
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
  },
  {
    id: "log-2",
    level: "info",
    source: "code-gen",
    message: 'Generated component "UserProfileCard"',
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
  },
  {
    id: "log-3",
    level: "info",
    source: "git-agent",
    message: "Committed changes to main branch",
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
  },
  {
    id: "log-4",
    level: "warn",
    source: "orchestrator",
    message: "Workflow queue approaching capacity (78%)",
    timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
  },
  {
    id: "log-5",
    level: "info",
    source: "research-agent",
    message: "Completed web research on topic 'RAG architectures'",
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
  },
  {
    id: "log-6",
    level: "error",
    source: "deploy-agent",
    message: "Deployment failed: connection timeout to registry",
    timestamp: new Date(Date.now() - 1000 * 360).toISOString(),
  },
  {
    id: "log-7",
    level: "info",
    source: "qa-agent",
    message: "Test suite passed: 142/142 tests",
    timestamp: new Date(Date.now() - 1000 * 420).toISOString(),
  },
];

// Helper to get window safely
const isClient = typeof window !== "undefined";

export const getOSAgents = (): Agent[] => {
  if (!isClient) return DEFAULT_AGENTS;
  const raw = localStorage.getItem("signhify_os_agents");
  if (!raw) {
    localStorage.setItem("signhify_os_agents", JSON.stringify(DEFAULT_AGENTS));
    return DEFAULT_AGENTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_AGENTS;
  }
};

export const saveOSAgent = (
  agent: Omit<Agent, "id" | "status" | "lastActive" | "tasksCompleted">,
): Agent => {
  const newAgent: Agent = {
    ...agent,
    id: `agent-${Date.now()}`,
    status: "idle",
    lastActive: "just now",
    tasksCompleted: 0,
  };
  if (isClient) {
    const list = getOSAgents();
    list.unshift(newAgent);
    localStorage.setItem("signhify_os_agents", JSON.stringify(list));
    addOSLog(
      `Deployed new Agent: "${newAgent.name}" using model ${newAgent.model}`,
      "info",
      "orchestrator",
    );
  }
  return newAgent;
};

export const toggleOSAgentStatus = (id: string): Agent | null => {
  if (!isClient) return null;
  const list = getOSAgents();
  let updatedAgent: Agent | null = null;
  const updated = list.map((a) => {
    if (a.id === id) {
      const nextStatus = a.status === "running" ? "idle" : "running";
      updatedAgent = { ...a, status: nextStatus, lastActive: "just now" };
      addOSLog(
        `Agent "${a.name}" status toggled to ${nextStatus}`,
        "info",
        a.id.replace("agent-", "") + "-agent",
      );
      return updatedAgent;
    }
    return a;
  });
  localStorage.setItem("signhify_os_agents", JSON.stringify(updated));
  return updatedAgent;
};

export const deleteOSAgent = (id: string) => {
  if (!isClient) return;
  const list = getOSAgents();
  const agent = list.find((a) => a.id === id);
  if (agent) {
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem("signhify_os_agents", JSON.stringify(updated));
    addOSLog(`Terminated and deleted Agent: "${agent.name}"`, "warn", "orchestrator");
  }
};

export const getOSWorkflows = (): Workflow[] => {
  if (!isClient) return DEFAULT_WORKFLOWS;
  const raw = localStorage.getItem("signhify_os_workflows");
  if (!raw) {
    localStorage.setItem("signhify_os_workflows", JSON.stringify(DEFAULT_WORKFLOWS));
    return DEFAULT_WORKFLOWS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WORKFLOWS;
  }
};

export const saveOSWorkflow = (
  wf: Omit<Workflow, "id" | "status" | "progress" | "lastRun">,
): Workflow => {
  const newWf: Workflow = {
    ...wf,
    id: `wf-${Date.now()}`,
    status: "queued",
    progress: 0,
    lastRun: "—",
  };
  if (isClient) {
    const list = getOSWorkflows();
    list.unshift(newWf);
    localStorage.setItem("signhify_os_workflows", JSON.stringify(list));
    addOSLog(`Created new Orchestration Workflow: "${newWf.name}"`, "info", "orchestrator");
  }
  return newWf;
};

export const toggleOSWorkflowStatus = (id: string) => {
  if (!isClient) return;
  const list = getOSWorkflows();
  const updated = list.map((w) => {
    if (w.id === id) {
      const nextStatus = w.status === "active" ? "completed" : "active";
      const progress = nextStatus === "completed" ? 100 : Math.floor(Math.random() * 80) + 10;
      addOSLog(
        `Workflow "${w.name}" execution state changed to ${nextStatus}`,
        "info",
        "orchestrator",
      );
      return { ...w, status: nextStatus, progress, lastRun: "just now" };
    }
    return w;
  });
  localStorage.setItem("signhify_os_workflows", JSON.stringify(updated));
};

export const deleteOSWorkflow = (id: string) => {
  if (!isClient) return;
  const list = getOSWorkflows();
  const updated = list.filter((w) => w.id !== id);
  localStorage.setItem("signhify_os_workflows", JSON.stringify(updated));
};

export const getOSLogs = (): SystemLog[] => {
  if (!isClient) return DEFAULT_LOGS;
  const raw = localStorage.getItem("signhify_os_logs");
  if (!raw) {
    localStorage.setItem("signhify_os_logs", JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LOGS;
  }
};

export const addOSLog = (
  message: string,
  level: "info" | "warn" | "error" = "info",
  source: string = "orchestrator",
) => {
  if (!isClient) return;
  const logs = getOSLogs();
  const newLog: SystemLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    level,
    source,
    message,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  // Keep last 100 logs
  if (logs.length > 100) {
    logs.pop();
  }
  localStorage.setItem("signhify_os_logs", JSON.stringify(logs));
};

export const clearOSLogs = () => {
  if (!isClient) return;
  localStorage.setItem("signhify_os_logs", JSON.stringify([]));
};
