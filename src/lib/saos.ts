/**
 * saos.ts (v0.2)
 * Port of SAOS Core Expanded to TypeScript/Web Crypto.
 * Ethical: No auto-propagation; explicit consent required.
 * Resonance: Integrates 369 vortex sequences in fingerprints.
 */

export interface ConsentRecord {
  subject_id: string;
  granted_by: string;
  timestamp: string;
  scope: string;
  signature: string;
}

export class SAOSProtocol {
  static principles = {
    simplicity: "Minimize complexity and surface area.",
    invisibility: "Respect privacy and avoid unnecessary exposure.",
    sovereign_agreement: "Require explicit, auditable consent for actions."
  };

  static checkConsent(consent: ConsentRecord): boolean {
    const required = ["subject_id", "granted_by", "timestamp", "scope", "signature"];
    if (!required.every(key => key in consent)) return false;
    
    try {
      const ts = new Date(consent.timestamp).getTime();
      const now = Date.now();
      // 5 minute window
      if (ts > now + 300000) return false;
    } catch {
      return false;
    }
    return true;
  }

  static policyAllows(action: string): boolean {
    const disallowed = ["propagate", "infect", "self-replicate", "exfiltrate", "scan"];
    return !disallowed.some(k => action.toLowerCase().includes(k));
  }
}

export class SAOSSeed {
  id: string;
  createdAt: string;
  private keyPair: CryptoKeyPair | null = null;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date().toISOString();
  }

  async initialize() {
    this.keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"]
    );
  }

  async fingerprint(): Promise<string> {
    const payload = `${this.id}|${this.createdAt}`;
    const msgBuffer = new TextEncoder().encode(payload);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hashHex}-369`;
  }

  async sign(message: string): Promise<string> {
    if (!this.keyPair) throw new Error("Seed not initialized");
    const msgBuffer = new TextEncoder().encode(message);
    const signature = await window.crypto.subtle.sign(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      this.keyPair.privateKey,
      msgBuffer
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }
}

export class SAOSSpore {
  seedFingerprint: string;
  payload: string;
  createdAt: string;
  consentRecord: ConsentRecord | null = null;

  constructor(seedFingerprint: string, payload: string) {
    this.seedFingerprint = seedFingerprint;
    this.payload = payload;
    this.createdAt = new Date().toISOString();
  }

  async encrypt(key: CryptoKey): Promise<{ ciphertext: string; iv: Uint8Array }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const msgBuffer = new TextEncoder().encode(this.payload);
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      msgBuffer
    );
    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      iv
    };
  }

  isTransferAllowed(): boolean {
    if (!this.consentRecord) return false;
    if (!this.consentRecord.scope.includes("transfer")) return false;
    return SAOSProtocol.policyAllows("transfer");
  }
}
