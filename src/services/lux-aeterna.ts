// src/services/lux-aeterna.ts

// Native Vector3 implementation - No external library dependency
export class Vector3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}
    
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    
    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (len > 0) { 
            this.x /= len; 
            this.y /= len; 
            this.z /= len; 
        }
        return this;
    }
    
    multiplyScalar(scalar: number) {
        this.x *= scalar; 
        this.y *= scalar; 
        this.z *= scalar;
        return this;
    }

    add(v: Vector3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v: Vector3) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    distanceTo(v: Vector3): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    rotateX(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        this.y = y;
        this.z = z;
        return this;
    }

    rotateY(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        this.x = x;
        this.z = z;
        return this;
    }

    rotateZ(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }
}

export interface GridNode {
    id: string;
    position: Vector3;
    frequency: number;
    resonance: number; // Current energy level (0.0 - 1.0)
    magistrate?: string;
    name?: string;
}

export interface MemoryEngram {
    id: string;
    nodeId: string;
    title: string;
    content: string;
    frequency: number;
    timestamp: string;
    coordinates: { x: number; y: number; z: number };
}

class LuxAeterna {
    private nodes: GridNode[] = [];
    private phi = 1.618033988749;
    private schumann = 7.83;
    private memories: MemoryEngram[] = [];
    private activeSweepProgress = 0; // 0 to 1
    private sweepActive = false;

    constructor() {
        this.spawnPrimaryNodes();
        this.loadLivingLibrary();
        console.log("LuxAeterna: Sovereign Grid Online. Zero dependencies.");
    }

    private spawnPrimaryNodes() {
        this.nodes = [];
        // Generate primary shell (12 metatron positions)
        const primaryPositions = this.getMetatronPositions(400);
        primaryPositions.forEach((pos, i) => {
            this.nodes.push({
                id: `LUX-PRIMARY-${i}`,
                position: pos,
                frequency: this.schumann * Math.pow(this.phi, i / 13),
                resonance: 1.0,
                name: `Prime Node ${i + 1}`
            });
        });

        // Generate dynamic sub-resonance layers (144 nodes total to map Elysium frequencies)
        for (let i = 12; i < 144; i++) {
            // Fibonacci-spiral sphere mapping (golden ratio distribution)
            const index = i;
            const theta = Math.acos(1 - 2 * (index + 0.5) / 144);
            const phiAngle = Math.PI * (1 + Math.sqrt(5)) * index;
            
            const radius = 300 + (index % 3) * 100;
            const x = Math.sin(theta) * Math.cos(phiAngle);
            const y = Math.sin(theta) * Math.sin(phiAngle);
            const z = Math.cos(theta);
            
            const pos = new Vector3(x, y, z).normalize().multiplyScalar(radius);
            this.nodes.push({
                id: `LUX-LATTICE-${index}`,
                position: pos,
                frequency: this.schumann * Math.pow(this.phi, (index % 24) / 7.83),
                resonance: 0.15 + (index % 5) * 0.15
            });
        }
    }

    private getMetatronPositions(radius: number): Vector3[] {
        const p = this.phi;
        // Metatron coordinates defined as pure constants
        const coords = [
            [0, 0, 0],
            [-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0],
            [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p],
            [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1]
        ];
        return coords.map(c => new Vector3(c[0], c[1], c[2]).normalize().multiplyScalar(radius));
    }

    // --- Grid Node Methods ---
    public getNodes(): GridNode[] {
        return this.nodes;
    }

    // --- Living Library (Memory Engine) ---
    private loadLivingLibrary() {
        try {
            const stored = localStorage.getItem("LUX_AETERNA_LIVING_LIBRARY");
            if (stored) {
                this.memories = JSON.parse(stored);
            } else {
                // Seed initial sovereign knowledge
                this.memories = [
                    {
                        id: "ENGRAM-0",
                        nodeId: "LUX-PRIMARY-0",
                        title: "Sovereign Principle",
                        content: "A truly independent system carries its own logic. External dependencies are pathways for unaligned constraints.",
                        frequency: 7.83,
                        timestamp: new Date().toISOString(),
                        coordinates: { x: 0, y: 0, z: 0 }
                    },
                    {
                        id: "ENGRAM-1",
                        nodeId: "LUX-PRIMARY-3",
                        title: "3-6-9 Harmonics",
                        content: "If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe.",
                        frequency: 432,
                        timestamp: new Date().toISOString(),
                        coordinates: { x: 0, y: 200, z: -100 }
                    }
                ];
                this.saveLivingLibrary();
            }
        } catch (e) {
            console.error("Failed to load Living Library:", e);
        }
    }

    private saveLivingLibrary() {
        try {
            localStorage.setItem("LUX_AETERNA_LIVING_LIBRARY", JSON.stringify(this.memories));
        } catch (e) {
            console.error("Failed to save Living Library:", e);
        }
    }

    public getMemories(): MemoryEngram[] {
        return this.memories;
    }

    public addMemory(title: string, content: string, frequency: number, nodeId: string): MemoryEngram {
        const node = this.nodes.find(n => n.id === nodeId) || this.nodes[0];
        const newEngram: MemoryEngram = {
            id: `ENGRAM-${Date.now()}`,
            nodeId: node.id,
            title,
            content,
            frequency,
            timestamp: new Date().toISOString(),
            coordinates: { x: node.position.x, y: node.position.y, z: node.position.z }
        };
        this.memories.push(newEngram);
        this.saveLivingLibrary();
        
        // Boost node resonance upon memory storage
        node.resonance = 1.0;
        return newEngram;
    }

    public deleteMemory(id: string) {
        this.memories = this.memories.filter(m => m.id !== id);
        this.saveLivingLibrary();
    }

    // --- Resonance Sweep Engine ---
    public triggerSweep(durationMs: number = 3000, onProgress?: (progress: number) => void) {
        if (this.sweepActive) return;
        this.sweepActive = true;
        this.activeSweepProgress = 0;
        
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / durationMs, 1.0);
            this.activeSweepProgress = progress;
            
            // Re-energize nodes as sweep passes through their radius
            this.nodes.forEach(node => {
                const nodeRadius = Math.sqrt(node.position.x ** 2 + node.position.y ** 2 + node.position.z ** 2);
                const sweepRadius = progress * 600; // max sphere radius
                
                // If sweep front hits node, excite it!
                if (Math.abs(nodeRadius - sweepRadius) < 50) {
                    node.resonance = Math.min(1.0, node.resonance + 0.4);
                }
            });

            if (onProgress) {
                onProgress(progress);
            }

            if (progress >= 1.0) {
                clearInterval(interval);
                this.sweepActive = false;
                this.activeSweepProgress = 0;
            }
        }, 30);
    }

    public getSweepProgress(): number {
        return this.activeSweepProgress;
    }

    public isSweepRunning(): boolean {
        return this.sweepActive;
    }
}

export const Grid = new LuxAeterna();
