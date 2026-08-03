export enum ResonanceState {
  NULL = -1,    // Void / Unknown
  STABLE = 0,   // Neutral / Flux
  ACTIVE = 1    // Manifest / Sovereign
}

export interface Universal_Locale_Object {
  text: string;
  lang_code: string;
  domain_intent: string;
  resonance_level: number;
  isUser: boolean;
  name: string;
}
