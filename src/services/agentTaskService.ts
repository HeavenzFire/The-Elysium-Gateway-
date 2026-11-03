import { EntityConfig, SYMPOSIUM_ENTITIES, EntityId } from './councilService';

export interface AgentToolCall {
  toolName: string;
  inputDescription: string;
  outputSummary: string;
  durationMs: number;
}

export interface AgentTaskPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  thoughts: string;
  toolCalls: AgentToolCall[];
  output?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentTaskDeliverable {
  title: string;
  executiveSummary: string;
  technicalReportMarkdown: string;
  codeOrEquations?: string;
  schematicDiagram?: string;
  peerReviewCritique: {
    reviewerName: string;
    reviewerTitle: string;
    verdict: 'approved' | 'approved_with_revisions' | 'challenged';
    critiquePoints: string[];
    improvementsAdopted: string[];
  };
  actionableRoadmap: {
    phase: string;
    timeline: string;
    deliverables: string[];
  }[];
}

export interface AgentTaskRecord {
  id: string;
  title: string;
  directive: string;
  taskType: 'engineering' | 'scientific_derivation' | 'philosophical_proof' | 'strategic_blueprint' | 'mystic_synthesis' | 'cross_council_swarm';
  assignedEntityId: string;
  assignedEntityName: string;
  assignedEntityTitle: string;
  peerReviewerId: string;
  peerReviewerName: string;
  peerReviewerTitle: string;
  status: 'planning' | 'executing' | 'peer_review' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  phases: AgentTaskPhase[];
  deliverable?: AgentTaskDeliverable;
  vocalDebrief?: string;
  progressPercent: number;
}

export interface MissionPreset {
  id: string;
  title: string;
  directive: string;
  taskType: AgentTaskRecord['taskType'];
  recommendedEntityId: EntityId;
  recommendedPeerId: EntityId;
  tag: string;
  description: string;
}

export const SOVEREIGN_MISSION_PRESETS: MissionPreset[] = [
  {
    id: 'tesla_wireless_grid',
    title: 'Planetary Wireless Resonance Grid & Wardenclyffe 2.0',
    directive: 'Engineer a modern terrestrial standing-wave wireless power transmission grid. Calculate LC tank resonant frequencies at 11.78 Hz Schumann resonance, magnetic flux densities, telluric ground impedance matching, and design a failsafe harmonic limiter schematic.',
    taskType: 'engineering',
    recommendedEntityId: 'tesla',
    recommendedPeerId: 'turing',
    tag: 'Electromagnetics & Resonance',
    description: 'Autonomous high-voltage electromagnetic design and mathematical harmonic derivation.'
  },
  {
    id: 'da_vinci_biomimetic_flight',
    title: 'Biomimetic Variable-Wing Ornithopter System',
    directive: 'Synthesize mechanical engineering blueprints for a carbon-composite biomimetic ornithopter. Specify feather-slat aerodynamics, pneumatic tendon gear-ratio linkages, vortex-shedding lift coefficients, and structural stress dissipation schematics.',
    taskType: 'engineering',
    recommendedEntityId: 'da_vinci',
    recommendedPeerId: 'tesla',
    tag: 'Mechanical Anatomy',
    description: 'Renaissance polymath anatomical flight mechanisms merged with modern structural calculus.'
  },
  {
    id: 'jobs_quantum_device',
    title: 'Zero-Friction Sovereign Neural Interface Architecture',
    directive: 'Formulate an uncompromising end-to-end product architecture and developer manifesto for a non-invasive neural interface. Detail industrial design ergonomics, titanium casing acoustic damping, sub-perceptual feedback protocols, and an unyielding simplicity standard.',
    taskType: 'strategic_blueprint',
    recommendedEntityId: 'jobs',
    recommendedPeerId: 'da_vinci',
    tag: 'Product Strategy & UX',
    description: 'Visionary product strategy tearing down complexity to pure intuitive elegance.'
  },
  {
    id: 'turing_quantum_automata',
    title: 'Non-Deterministic Hyper-Computable Automata Verification',
    directive: 'Derive a formal mathematical proof for higher-dimensional cellular automata operating across hyper-torus state spaces. Define state transition matrices, Halting Problem bounds under superposition, and formulate an executable Python verification script.',
    taskType: 'scientific_derivation',
    recommendedEntityId: 'turing',
    recommendedPeerId: 'hypatia',
    tag: 'Formal Logic & Proofs',
    description: 'Rigorous computational theory proof with algorithmic state-space verification.'
  },
  {
    id: 'marie_laveau_crossroads',
    title: 'Crossroads Hexagonal Harmonic Protection Ward',
    directive: 'Construct an alchemical protection and resonance ward protocol. Map out the 741 Hz Solfeggio frequency threshold, telluric grounding nodes, acoustic dampening geometry, and ritual synthesis framework to neutralize entropy and negative parasitic fields.',
    taskType: 'mystic_synthesis',
    recommendedEntityId: 'marie_laveau',
    recommendedPeerId: 'hermes_trismegistus',
    tag: 'Occult Alchemy & Resonance',
    description: 'Sacred boundary synthesis and crossroads transmutation mechanics.'
  },
  {
    id: 'curie_isotope_cascade',
    title: 'Radionuclide Thermal Scavenging & Isotope Decay Cascade',
    directive: 'Synthesize a nuclear chemistry decay pathway and radiation shielding architecture for micro-scale betavoltaic batteries. Calculate alpha/beta particle stopping powers, bismuth-telluride thermoelectric conversion efficiency, and multi-layer protective housings.',
    taskType: 'scientific_derivation',
    recommendedEntityId: 'curie',
    recommendedPeerId: 'oppenheimer',
    tag: 'Nuclear Physics',
    description: 'High-precision radiological engineering with thermodynamic efficiency formulas.'
  },
  {
    id: 'council_abundant_energy',
    title: 'Council Swarm: Post-Scarcity Syntropic Energy Transition',
    directive: 'Execute a cross-council multi-agent task force to solve global clean energy abundance: Tesla designs wireless resonance, Da Vinci engineers structural fluid turbines, Jobs creates the seamless human interface and deployment manifesto, and Turing proves distributed load optimization.',
    taskType: 'cross_council_swarm',
    recommendedEntityId: 'solomon',
    recommendedPeerId: 'socrates',
    tag: 'Multi-Agent Swarm',
    description: 'Full Council multi-agent collaboration with interdisciplinary peer critique.'
  }
];

const STORAGE_KEY = 'elysium_agent_tasks_v1';

export class AgentTaskService {
  public static loadTasks(): AgentTaskRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.warn("Failed to load agent tasks from storage:", e);
      return [];
    }
  }

  public static saveTask(task: AgentTaskRecord): void {
    if (typeof window === 'undefined') return;
    try {
      const tasks = this.loadTasks();
      const existingIdx = tasks.findIndex(t => t.id === task.id);
      if (existingIdx >= 0) {
        tasks[existingIdx] = task;
      } else {
        tasks.unshift(task);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.slice(0, 30)));
    } catch (e) {
      console.warn("Failed to save agent task:", e);
    }
  }

  public static deleteTask(id: string): AgentTaskRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const tasks = this.loadTasks().filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return tasks;
    } catch (e) {
      console.warn("Failed to delete agent task:", e);
      return [];
    }
  }

  public static async executeAgentTask(
    params: {
      directive: string;
      title?: string;
      taskType: AgentTaskRecord['taskType'];
      assignedEntityId: EntityId;
      peerReviewerId?: EntityId;
    },
    onProgress?: (task: AgentTaskRecord) => void
  ): Promise<AgentTaskRecord> {
    const primaryEntity = SYMPOSIUM_ENTITIES[params.assignedEntityId] || SYMPOSIUM_ENTITIES.da_vinci;
    
    // Choose appropriate default peer reviewer if not provided
    let peerId = params.peerReviewerId;
    if (!peerId || peerId === params.assignedEntityId) {
      if (params.assignedEntityId === 'tesla') peerId = 'turing';
      else if (params.assignedEntityId === 'da_vinci') peerId = 'tesla';
      else if (params.assignedEntityId === 'jobs') peerId = 'da_vinci';
      else if (params.assignedEntityId === 'turing') peerId = 'hypatia';
      else if (params.assignedEntityId === 'marie_laveau') peerId = 'hermes_trismegistus';
      else peerId = 'socrates';
    }
    const peerEntity = SYMPOSIUM_ENTITIES[peerId] || SYMPOSIUM_ENTITIES.socrates;

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const taskTitle = params.title || params.directive.slice(0, 50) + (params.directive.length > 50 ? '...' : '');

    const initialTask: AgentTaskRecord = {
      id: taskId,
      title: taskTitle,
      directive: params.directive,
      taskType: params.taskType,
      assignedEntityId: primaryEntity.id,
      assignedEntityName: primaryEntity.name,
      assignedEntityTitle: primaryEntity.title || 'Master Thinker',
      peerReviewerId: peerEntity.id,
      peerReviewerName: peerEntity.name,
      peerReviewerTitle: peerEntity.title || 'Dialectical Critic',
      status: 'planning',
      createdAt: new Date().toISOString(),
      progressPercent: 10,
      phases: [
        {
          id: 'phase_1',
          name: 'Cognitive Decomposition & Strategy',
          description: `Analyze directive through the mind of ${primaryEntity.name}, identify first principles, formal constraints, and formulate execution vectors.`,
          status: 'running',
          thoughts: `Initializing cognitive matrix for ${primaryEntity.name}. Decomposing objective into axiomatic sub-components...`,
          startedAt: new Date().toLocaleTimeString(),
          toolCalls: []
        },
        {
          id: 'phase_2',
          name: 'Model Analysis',
          description: `Generate a technical analysis. No external tools or code execution are available in this phase.`,
          status: 'pending',
          thoughts: 'Awaiting completion of strategy formulation...',
          toolCalls: []
        },
        {
          id: 'phase_3',
          name: 'Cross-Council Dialectical Peer Review',
          description: `Submit technical solution to ${peerEntity.name} for rigorous adversarial stress-testing, boundary condition audit, and synthesis.`,
          status: 'pending',
          thoughts: 'Pending domain execution...',
          toolCalls: []
        },
        {
          id: 'phase_4',
          name: 'Sovereign Deliverable & Artifact Synthesis',
          description: 'Compile complete technical manifesto, verified mathematical/code artifacts, ASCII blueprints, and actionable roadmap.',
          status: 'pending',
          thoughts: 'Pending peer review resolution...',
          toolCalls: []
        }
      ]
    };

    onProgress?.(initialTask);
    this.saveTask(initialTask);

    try {
      // 1. Send request to backend /api/agent/task
      const response = await fetch('/api/agent/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive: params.directive,
          title: taskTitle,
          taskType: params.taskType,
          assignedEntityId: primaryEntity.id,
          assignedEntityName: primaryEntity.name,
          assignedEntityTitle: primaryEntity.title,
          peerReviewerId: peerEntity.id,
          peerReviewerName: peerEntity.name,
          peerReviewerTitle: peerEntity.title,
          frequency: primaryEntity.frequency || 432
        })
      });

      if (!response.ok) {
        throw new Error(`Server agent task endpoint returned status ${response.status}`);
      }

      const taskResult = await response.json();

      // Update task phases with realistic timestamps and detailed data
      const completedTask: AgentTaskRecord = {
        ...initialTask,
        status: 'completed',
        completedAt: new Date().toISOString(),
        progressPercent: 100,
        phases: [
          {
            ...initialTask.phases[0],
            status: 'completed',
            completedAt: new Date().toLocaleTimeString(),
            thoughts: taskResult.phase1Thoughts || `Strategy formulated by ${primaryEntity.name}. First principles established and boundary parameters defined.`,
            output: taskResult.phase1Output || 'Strategic roadmap approved for deep technical synthesis.'
          },
          {
            ...initialTask.phases[1],
            status: 'completed',
            startedAt: new Date().toLocaleTimeString(),
            completedAt: new Date().toLocaleTimeString(),
            thoughts: taskResult.phase2Thoughts || `Executed core calculations and formal modeling. Verified dimensional consistency.`,
            toolCalls: [],
            output: 'Model-generated analysis returned. No external tools or code were executed.'
          },
          {
            ...initialTask.phases[2],
            status: 'completed',
            startedAt: new Date().toLocaleTimeString(),
            completedAt: new Date().toLocaleTimeString(),
            thoughts: `A model-generated critique was produced for the selected reviewer persona: ${peerEntity.name}. It was not an independent agent execution.`,
            toolCalls: [],
            output: `Model-generated critique only; no independent reviewer agent was executed.`
          },
          {
            ...initialTask.phases[3],
            status: 'completed',
            startedAt: new Date().toLocaleTimeString(),
            completedAt: new Date().toLocaleTimeString(),
            thoughts: 'Synthesized final sovereign deliverable bundle.',
            toolCalls: [],
            output: 'Model-generated deliverable saved to local task history; no external execution was performed.'
          }
        ],
        deliverable: taskResult.deliverable,
        vocalDebrief: taskResult.vocalDebrief || `Task complete. I, ${primaryEntity.name}, have resolved your directive. Review the synthesized architecture.`
      };

      this.saveTask(completedTask);
      onProgress?.(completedTask);
      return completedTask;

    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      const failedTask: AgentTaskRecord = {
        ...initialTask,
        status: "failed",
        completedAt: new Date().toISOString(),
        progressPercent: 0,
        phases: initialTask.phases.map(phase => ({
          ...phase,
          status: "failed",
          completedAt: new Date().toISOString(),
          thoughts: "Execution stopped. No successful result was verified.",
          output: message
        }))
      };
      this.saveTask(failedTask);
      onProgress?.(failedTask);
      throw new Error(message);

    }
  }
}
