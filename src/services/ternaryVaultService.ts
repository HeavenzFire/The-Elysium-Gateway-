// ELYSIUM PERSISTENT TERNARY VAULT (IndexedDB)
// Powered by `idb` for 159-entity council state management, session history,
// and state consistency across browser reloads.

export * from './ternaryVault';
import { ternaryVault, EntityStateVault, SessionHistoryRecord, VaultTransactionRecord } from './ternaryVault';
import { EntityId } from './councilService';

export type EntityVaultRecord = EntityStateVault;

class TernaryVaultServiceCompat {
  public async getAllEntities(): Promise<EntityStateVault[]> {
    return ternaryVault.getAllEntities();
  }

  public async getEntity(id: EntityId): Promise<EntityStateVault | null> {
    return ternaryVault.getEntity(id);
  }

  public async saveEntity(record: EntityStateVault): Promise<void> {
    await ternaryVault.saveEntity(record);
  }

  public async recordTransaction(txRecord: VaultTransactionRecord): Promise<void> {
    await ternaryVault.recordTransaction(txRecord);
  }

  public async getRecentTransactions(limit: number = 50): Promise<VaultTransactionRecord[]> {
    return ternaryVault.getRecentTransactions(limit);
  }
}

export const ternaryVaultService = new TernaryVaultServiceCompat();
export default ternaryVault;
