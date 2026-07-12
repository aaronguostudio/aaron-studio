import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import type { TTSProvider } from "./tts";

export interface VoiceProfileSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

export interface VoiceProfileDefinition {
  label: string;
  provider: TTSProvider;
  voice_id: string;
  model_id?: string;
  output_format?: string;
  voice_settings: VoiceProfileSettings;
  seed?: number;
  selected_sample?: string;
  selected_at?: string;
  selection_reason?: string;
  source_test?: string;
}

export interface VoiceProfile extends VoiceProfileDefinition {
  id: string;
}

export interface VoiceProfileRegistry {
  schema_version: 1;
  default_profile: string;
  profiles: Record<string, VoiceProfileDefinition>;
}

export const DEFAULT_VOICE_PROFILE_REGISTRY_PATH = fileURLToPath(
  new URL("../config/voice-profiles.json", import.meta.url)
);

export function loadVoiceProfileRegistry(
  registryPath = DEFAULT_VOICE_PROFILE_REGISTRY_PATH
): VoiceProfileRegistry {
  if (!existsSync(registryPath)) {
    throw new Error(`Voice profile registry not found: ${registryPath}`);
  }

  const registry = JSON.parse(
    readFileSync(registryPath, "utf-8")
  ) as VoiceProfileRegistry;

  if (registry.schema_version !== 1) {
    throw new Error(
      `Unsupported voice profile schema: ${String(registry.schema_version)}`
    );
  }
  if (!registry.default_profile || !registry.profiles?.[registry.default_profile]) {
    throw new Error(
      `Default voice profile is missing: ${String(registry.default_profile)}`
    );
  }

  return registry;
}

export function resolveVoiceProfile(
  requestedId?: string,
  registry = loadVoiceProfileRegistry()
): VoiceProfile {
  const id = requestedId || registry.default_profile;
  const definition = registry.profiles[id];
  if (!definition) {
    throw new Error(
      `Unknown voice profile "${id}". Available profiles: ${Object.keys(
        registry.profiles
      ).join(", ")}`
    );
  }

  return { id, ...definition };
}
