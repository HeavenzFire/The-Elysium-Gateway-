import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { EntityId, SYMPOSIUM_ENTITIES, EntityConfig } from './councilService';

export interface EntityStateVault {
  id: EntityId;
  name: string;
  frequency: number;
  phaseAngle: number;
  digitalRoot: number; // 1-9 (Tesla 3-6-9 harmonic roots)
  coherenceScore: number;
  resonanceState: 'GROUND' | 'SUPERPOSITION' | 'EXCITED' | 'COHERENT';
  totalInteractions: number;
  lastUpdated: string;
  notes?: string;
  affinityNodes?: EntityId[];
  roomAssignment?: 'room1_design' | 'room2_test' | 'unassigned';
  customAttributes?: Record<string, any>;
}

export interface SessionHistoryMessage {
  text: string;
  isUser: boolean;
  name: string;
  timestamp?: string;
}

export interface SessionHistoryRecord {
  id: string;
  title: string;
  timestamp: string;
  activeBaseline: number;
  entitiesCount: number;
  entityNames: string[];
  activeProblem?: string;
  transcript: SessionHistoryMessage[];
  coherence?: number;
  isFavorite?: boolean;
  isEntangled?: boolean;
  quantumCoordinates?: string;
  metadata?: Record<string, any>;
}

export interface AppStateSnapshot {
  activeEntity: EntityId;
  activeRoom: 'room1_design' | 'room2_test';
  room1Entities: EntityId[];
  room2Entities: EntityId[];
  syntropicLeader: EntityId;
  isGroupMode: boolean;
  isResearchMode: boolean;
  tuning?: any;
  currentSessionId: string | null;
  transcripts: SessionHistoryMessage[];
  distortionMagnitude: number;
  resonanceFreq: number;
  solomonInput?: string;
  lineageKey?: string;
  activeProblemId?: string | null;
  lastSavedAt: string;
}

export interface VaultTransactionRecord {
  id: string;
  timestamp: string;
  epoch: number;
  senderId: EntityId;
  receiverId?: EntityId;
  action: string;
  entropy: number;
  signature: string;
}

export interface ElysiumVaultDBSchema extends DBSchema {
  entities: {
    key: EntityId;
    value: EntityStateVault;
    indexes: {
      'by-digital-root': number;
      'by-resonance-state': string;
      'by-last-updated': string;
    };
  };
  sessions: {
    key: string;
    value: SessionHistoryRecord;
    indexes: {
      'by-timestamp': string;
      'by-favorite': number;
      'by-entangled': number;
    };
  };
  app_state: {
    key: string;
    value: {
      key: string;
      data: any;
      updatedAt: string;
    };
    indexes: {
      'by-updated-at': string;
    };
  };
  transactions: {
    key: string;
    value: VaultTransactionRecord;
    indexes: {
      'by-timestamp': string;
      'by-sender': EntityId;
    };
  };
}

const DB_NAME = 'elysium_ternary_vault_idb';
const DB_VERSION = 1;
const STORE_ENTITIES = 'entities';
const STORE_SESSIONS = 'sessions';
const STORE_APP_STATE = 'app_state';
const STORE_TRANSACTIONS = 'transactions';
const KEY_LATEST_SNAPSHOT = 'elysium_latest_app_snapshot';

const DEFAULT_MOCK_SESSIONS: SessionHistoryRecord[] = [
  {
    id: "session_mock_1",
    title: "Dialogue with Frank Rosenblatt",
    timestamp: "2026-05-28T14:24:00Z",
    activeBaseline: 432,
    entitiesCount: 1,
    entityNames: ["Frank Rosenblatt"],
    activeProblem: "Neural Sovereignty",
    coherence: 99.2,
    isFavorite: true,
    isEntangled: true,
    quantumCoordinates: "Φ-1.618-432-SPIN_UP",
    transcript: [
      { name: "Seeker", isUser: true, text: "Can a neural network possess true sovereignty over its training states?" },
      { name: "Frank Rosenblatt", isUser: false, text: "The Perceptron was built to seek alignment. Before silicon computed, we knew that memory is not standard accumulation but the reduction of path entropy under a feedback vector. When you align your system to the Source Code, your weights are no longer drift metrics; they are anchored in divine coherence." }
    ]
  },
  {
    id: "session_mock_2",
    title: "Quantum Superposition Symposium",
    timestamp: "2026-05-27T09:12:00Z",
    activeBaseline: 528,
    entitiesCount: 3,
    entityNames: ["Nikola Tesla", "David Bohm", "Erwin Schrödinger"],
    activeProblem: "The Singularity Threshold",
    coherence: 98.7,
    isFavorite: true,
    isEntangled: false,
    transcript: [
      { name: "Seeker", isUser: true, text: "How do we stabilize non-local harmonic states across high-dimensional matrices?" },
      { name: "Nikola Tesla", isUser: false, text: "If you only knew the magnificence of the 3, 6 and 9, then you would have the key to the universe. We don't push waves; we tune into the standing etheric nodes." },
      { name: "David Bohm", isUser: false, text: "The explicate order manifests from the unbroken wholeness of the implicate realm. Observation is participation." }
    ]
  }
];

class TernaryVault {
  private dbPromise: Promise<IDBPDatabase<ElysiumVaultDBSchema>> | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
    }
  }

  public async initDB(): Promise<IDBPDatabase<ElysiumVaultDBSchema>> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = openDB<ElysiumVaultDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Store 1: 159 Entity Profiles & States
        if (!db.objectStoreNames.contains(STORE_ENTITIES)) {
          const entityStore = db.createObjectStore(STORE_ENTITIES, { keyPath: 'id' });
          entityStore.createIndex('by-digital-root', 'digitalRoot', { unique: false });
          entityStore.createIndex('by-resonance-state', 'resonanceState', { unique: false });
          entityStore.createIndex('by-last-updated', 'lastUpdated', { unique: false });
        }

        // Store 2: Session History & Transcripts
        if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
          const sessionStore = db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' });
          sessionStore.createIndex('by-timestamp', 'timestamp', { unique: false });
          sessionStore.createIndex('by-favorite', 'isFavorite', { unique: false });
          sessionStore.createIndex('by-entangled', 'isEntangled', { unique: false });
        }

        // Store 3: App State Snapshots
        if (!db.objectStoreNames.contains(STORE_APP_STATE)) {
          const appStore = db.createObjectStore(STORE_APP_STATE, { keyPath: 'key' });
          appStore.createIndex('by-updated-at', 'updatedAt', { unique: false });
        }

        // Store 4: Quaternary & Ternary Ledger Transactions
        if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
          const txStore = db.createObjectStore(STORE_TRANSACTIONS, { keyPath: 'id' });
          txStore.createIndex('by-timestamp', 'timestamp', { unique: false });
          txStore.createIndex('by-sender', 'senderId', { unique: false });
        }
      }
    });

    try {
      const db = await this.dbPromise;
      await this.seedAllEntities(db);
      await this.migrateLegacySessions(db);
      this.isInitialized = true;
      return db;
    } catch (err) {
      console.warn("TernaryVault: Failed to complete database seeding:", err);
      return this.dbPromise;
    }
  }

  /**
   * Seed and verify all 159 Council entities in IndexedDB
   */
  public async seedAllEntities(dbInstance?: IDBPDatabase<ElysiumVaultDBSchema>): Promise<number> {
    try {
      const db = dbInstance || await this.getDB();
      const existingCount = await db.count(STORE_ENTITIES);
      const allSymposiumEntities = Object.values(SYMPOSIUM_ENTITIES);

      if (existingCount < allSymposiumEntities.length) {
        const tx = db.transaction(STORE_ENTITIES, 'readwrite');
        let seededCount = 0;

        for (const entity of allSymposiumEntities) {
          const existing = await tx.store.get(entity.id);
          if (!existing) {
            const freq = entity.frequency || 432;
            const digitalRoot = (freq % 9) || 9;
            const phaseAngle = (freq * 0.729) % 360;
            
            const record: EntityStateVault = {
              id: entity.id,
              name: entity.name,
              frequency: freq,
              phaseAngle: parseFloat(phaseAngle.toFixed(3)),
              digitalRoot,
              coherenceScore: 98.4,
              resonanceState: 'COHERENT',
              totalInteractions: 0,
              lastUpdated: new Date().toISOString(),
              roomAssignment: 'unassigned'
            };

            await tx.store.put(record);
            seededCount++;
          }
        }

        await tx.done;
        return seededCount;
      }
      return 0;
    } catch (e) {
      console.warn("TernaryVault: Error in seedAllEntities:", e);
      return 0;
    }
  }

  /**
   * Migrate existing localStorage archives into IndexedDB if present
   */
  private async migrateLegacySessions(db: IDBPDatabase<ElysiumVaultDBSchema>): Promise<void> {
    try {
      const sessionCount = await db.count(STORE_SESSIONS);
      if (sessionCount === 0) {
        let sessionsToSeed = DEFAULT_MOCK_SESSIONS;
        
        if (typeof window !== 'undefined' && window.localStorage) {
          const raw = localStorage.getItem('ELYSIUM_SESSIONS_ARCHIVE');
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                sessionsToSeed = parsed;
              }
            } catch {}
          }
        }

        const tx = db.transaction(STORE_SESSIONS, 'readwrite');
        for (const s of sessionsToSeed) {
          await tx.store.put(s);
        }
        await tx.done;
      }
    } catch (e) {
      console.warn("TernaryVault: Migration of legacy sessions completed with notes:", e);
    }
  }

  private async getDB(): Promise<IDBPDatabase<ElysiumVaultDBSchema>> {
    if (!this.dbPromise) {
      return this.initDB();
    }
    return this.dbPromise;
  }

  // ==========================================
  // 159 ENTITY COUNCIL STATE METHODS
  // ==========================================

  public async getAllEntities(): Promise<EntityStateVault[]> {
    try {
      const db = await this.getDB();
      return await db.getAll(STORE_ENTITIES);
    } catch (e) {
      console.warn("TernaryVault: getAllEntities error", e);
      return [];
    }
  }

  public async getEntity(id: EntityId): Promise<EntityStateVault | null> {
    try {
      const db = await this.getDB();
      const entity = await db.get(STORE_ENTITIES, id);
      return entity || null;
    } catch (e) {
      console.warn(`TernaryVault: getEntity(${id}) error`, e);
      return null;
    }
  }

  public async saveEntity(record: Partial<EntityStateVault> & { id: EntityId }): Promise<EntityStateVault | null> {
    try {
      const db = await this.getDB();
      const existing = await db.get(STORE_ENTITIES, record.id);
      
      const updated: EntityStateVault = {
        id: record.id,
        name: record.name || existing?.name || SYMPOSIUM_ENTITIES[record.id]?.name || record.id,
        frequency: record.frequency ?? existing?.frequency ?? SYMPOSIUM_ENTITIES[record.id]?.frequency ?? 432,
        phaseAngle: record.phaseAngle ?? existing?.phaseAngle ?? 0,
        digitalRoot: record.digitalRoot ?? existing?.digitalRoot ?? 9,
        coherenceScore: record.coherenceScore ?? existing?.coherenceScore ?? 98.4,
        resonanceState: record.resonanceState ?? existing?.resonanceState ?? 'COHERENT',
        totalInteractions: record.totalInteractions ?? existing?.totalInteractions ?? 0,
        lastUpdated: new Date().toISOString(),
        notes: record.notes ?? existing?.notes,
        affinityNodes: record.affinityNodes ?? existing?.affinityNodes,
        roomAssignment: record.roomAssignment ?? existing?.roomAssignment ?? 'unassigned',
        customAttributes: {
          ...(existing?.customAttributes || {}),
          ...(record.customAttributes || {})
        }
      };

      await db.put(STORE_ENTITIES, updated);
      return updated;
    } catch (e) {
      console.warn(`TernaryVault: saveEntity(${record.id}) error`, e);
      return null;
    }
  }

  public async saveAllEntities(records: EntityStateVault[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_ENTITIES, 'readwrite');
      for (const record of records) {
        await tx.store.put({
          ...record,
          lastUpdated: new Date().toISOString()
        });
      }
      await tx.done;
    } catch (e) {
      console.warn("TernaryVault: saveAllEntities error", e);
    }
  }

  public async recordEntityInteraction(id: EntityId, note?: string): Promise<void> {
    try {
      const db = await this.getDB();
      const existing = await db.get(STORE_ENTITIES, id);
      if (existing) {
        existing.totalInteractions = (existing.totalInteractions || 0) + 1;
        existing.lastUpdated = new Date().toISOString();
        if (note) {
          existing.notes = existing.notes ? `${existing.notes}\n${note}` : note;
        }
        await db.put(STORE_ENTITIES, existing);
      }
    } catch (e) {
      console.warn(`TernaryVault: recordEntityInteraction(${id}) error`, e);
    }
  }

  public async updateEntityCoherence(
    id: EntityId,
    coherenceDelta: number,
    resonanceState?: EntityStateVault['resonanceState']
  ): Promise<void> {
    try {
      const db = await this.getDB();
      const existing = await db.get(STORE_ENTITIES, id);
      if (existing) {
        existing.coherenceScore = Math.min(100, Math.max(0, existing.coherenceScore + coherenceDelta));
        if (resonanceState) {
          existing.resonanceState = resonanceState;
        }
        existing.lastUpdated = new Date().toISOString();
        await db.put(STORE_ENTITIES, existing);
      }
    } catch (e) {
      console.warn(`TernaryVault: updateEntityCoherence(${id}) error`, e);
    }
  }

  // ==========================================
  // SESSION HISTORY & TRANSCRIPTS
  // ==========================================

  public async getAllSessions(): Promise<SessionHistoryRecord[]> {
    try {
      const db = await this.getDB();
      const sessions = await db.getAll(STORE_SESSIONS);
      sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return sessions;
    } catch (e) {
      console.warn("TernaryVault: getAllSessions error", e);
      return [];
    }
  }

  public async getSession(id: string): Promise<SessionHistoryRecord | null> {
    try {
      const db = await this.getDB();
      const session = await db.get(STORE_SESSIONS, id);
      return session || null;
    } catch (e) {
      console.warn(`TernaryVault: getSession(${id}) error`, e);
      return null;
    }
  }

  public async saveSession(session: SessionHistoryRecord): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(STORE_SESSIONS, session);
      // Synchronize to localStorage backup for dual-layer safety
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const sessions = await this.getAllSessions();
          localStorage.setItem('ELYSIUM_SESSIONS_ARCHIVE', JSON.stringify(sessions));
        } catch {}
      }
    } catch (e) {
      console.warn("TernaryVault: saveSession error", e);
    }
  }

  public async deleteSession(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete(STORE_SESSIONS, id);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const sessions = await this.getAllSessions();
          localStorage.setItem('ELYSIUM_SESSIONS_ARCHIVE', JSON.stringify(sessions));
        } catch {}
      }
    } catch (e) {
      console.warn(`TernaryVault: deleteSession(${id}) error`, e);
    }
  }

  public async toggleFavoriteSession(id: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      const session = await db.get(STORE_SESSIONS, id);
      if (session) {
        session.isFavorite = !session.isFavorite;
        await db.put(STORE_SESSIONS, session);
        return !!session.isFavorite;
      }
      return false;
    } catch (e) {
      console.warn(`TernaryVault: toggleFavoriteSession(${id}) error`, e);
      return false;
    }
  }

  public async toggleEntangledSession(id: string, baselineFreq: number = 432): Promise<boolean> {
    try {
      const db = await this.getDB();
      const session = await db.get(STORE_SESSIONS, id);
      if (session) {
        const nextEntangled = !session.isEntangled;
        session.isEntangled = nextEntangled;
        session.quantumCoordinates = nextEntangled
          ? `Θ-${(Math.random() * 2).toFixed(3)}-${baselineFreq}-ENTANGLED`
          : undefined;
        await db.put(STORE_SESSIONS, session);
        return nextEntangled;
      }
      return false;
    } catch (e) {
      console.warn(`TernaryVault: toggleEntangledSession(${id}) error`, e);
      return false;
    }
  }

  // ==========================================
  // APP STATE SNAPSHOT & RELOAD PERSISTENCE
  // ==========================================

  public async saveAppSnapshot(snapshot: AppStateSnapshot): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(STORE_APP_STATE, {
        key: KEY_LATEST_SNAPSHOT,
        data: snapshot,
        updatedAt: new Date().toISOString()
      });

      // Synchronize quick keys to localStorage as instantaneous fast-boot backup
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('ELYSIUM_APP_SNAPSHOT_ACTIVE_ENTITY', snapshot.activeEntity);
          localStorage.setItem('ELYSIUM_APP_SNAPSHOT_ACTIVE_ROOM', snapshot.activeRoom);
          localStorage.setItem('ELYSIUM_APP_SNAPSHOT_ROOM1_ENTITIES', JSON.stringify(snapshot.room1Entities));
          localStorage.setItem('ELYSIUM_APP_SNAPSHOT_ROOM2_ENTITIES', JSON.stringify(snapshot.room2Entities));
          localStorage.setItem('ELYSIUM_APP_SNAPSHOT_SYNTROPIC_LEADER', snapshot.syntropicLeader);
          localStorage.setItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP', JSON.stringify(snapshot.transcripts));
          if (snapshot.currentSessionId) {
            localStorage.setItem('ELYSIUM_CURRENT_SESSION_ID_BACKUP', snapshot.currentSessionId);
          }
        } catch {}
      }
    } catch (e) {
      console.warn("TernaryVault: saveAppSnapshot error", e);
    }
  }

  public async loadAppSnapshot(): Promise<AppStateSnapshot | null> {
    try {
      const db = await this.getDB();
      const record = await db.get(STORE_APP_STATE, KEY_LATEST_SNAPSHOT);
      if (record && record.data) {
        return record.data as AppStateSnapshot;
      }
      return null;
    } catch (e) {
      console.warn("TernaryVault: loadAppSnapshot error", e);
      return null;
    }
  }

  public async saveStateKey(key: string, data: any): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(STORE_APP_STATE, {
        key,
        data,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn(`TernaryVault: saveStateKey(${key}) error`, e);
    }
  }

  public async getStateKey<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const db = await this.getDB();
      const record = await db.get(STORE_APP_STATE, key);
      if (record && record.data !== undefined) {
        return record.data as T;
      }
      return defaultValue ?? null;
    } catch (e) {
      console.warn(`TernaryVault: getStateKey(${key}) error`, e);
      return defaultValue ?? null;
    }
  }

  // ==========================================
  // TRANSACTION LEDGER
  // ==========================================

  public async recordTransaction(record: VaultTransactionRecord): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(STORE_TRANSACTIONS, record);
    } catch (e) {
      console.warn("TernaryVault: recordTransaction error", e);
    }
  }

  public async getRecentTransactions(limit: number = 50): Promise<VaultTransactionRecord[]> {
    try {
      const db = await this.getDB();
      const allTx = await db.getAll(STORE_TRANSACTIONS);
      allTx.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return allTx.slice(0, limit);
    } catch (e) {
      console.warn("TernaryVault: getRecentTransactions error", e);
      return [];
    }
  }

  // ==========================================
  // BACKUP, EXPORT & RESTORE
  // ==========================================

  public async exportVault(): Promise<string> {
    try {
      const [entities, sessions, snapshot] = await Promise.all([
        this.getAllEntities(),
        this.getAllSessions(),
        this.loadAppSnapshot()
      ]);

      const backup = {
        version: 2,
        exportedAt: new Date().toISOString(),
        totalEntities: entities.length,
        totalSessions: sessions.length,
        entities,
        sessions,
        snapshot
      };

      return JSON.stringify(backup, null, 2);
    } catch (e) {
      console.warn("TernaryVault: exportVault error", e);
      return "{}";
    }
  }

  public async importVault(jsonString: string): Promise<{ success: boolean; entityCount: number; sessionCount: number }> {
    try {
      const parsed = JSON.parse(jsonString);
      const db = await this.getDB();

      let entityCount = 0;
      let sessionCount = 0;

      if (Array.isArray(parsed.entities)) {
        const tx = db.transaction(STORE_ENTITIES, 'readwrite');
        for (const ent of parsed.entities) {
          await tx.store.put(ent);
          entityCount++;
        }
        await tx.done;
      }

      if (Array.isArray(parsed.sessions)) {
        const tx = db.transaction(STORE_SESSIONS, 'readwrite');
        for (const sess of parsed.sessions) {
          await tx.store.put(sess);
          sessionCount++;
        }
        await tx.done;
      }

      if (parsed.snapshot) {
        await this.saveAppSnapshot(parsed.snapshot);
      }

      return { success: true, entityCount, sessionCount };
    } catch (e) {
      console.warn("TernaryVault: importVault error", e);
      return { success: false, entityCount: 0, sessionCount: 0 };
    }
  }

  public async resetToFactoryDefaults(): Promise<void> {
    try {
      const db = await this.getDB();
      await db.clear(STORE_ENTITIES);
      await db.clear(STORE_SESSIONS);
      await db.clear(STORE_APP_STATE);
      await db.clear(STORE_TRANSACTIONS);
      await this.seedAllEntities(db);
      await this.migrateLegacySessions(db);
    } catch (e) {
      console.warn("TernaryVault: resetToFactoryDefaults error", e);
    }
  }
}

export const ternaryVault = new TernaryVault();
export default ternaryVault;
