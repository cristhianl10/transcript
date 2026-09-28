export const MODELS = {
  base: {
    id: 'onnx-community/whisper-base',
    revision: '1846881b6b3a3024392c1eea3ad983695bc23925',
    label: 'Equilibrado · Whisper base',
  },
  tiny: {
    id: 'onnx-community/whisper-tiny',
    revision: 'ff4177021cc41f7db950912b73ea4fdf7d01d8e7',
    label: 'Ligero · Whisper tiny',
  },
} as const;

export type ModelKey = keyof typeof MODELS;
export type Phase = 'idle' | 'preparing' | 'loading' | 'transcribing' | 'done' | 'cancelled' | 'error';

export interface TranscribeRequest {
  id: number;
  audio: Float32Array;
  model: ModelKey;
  language: string;
  device: 'auto' | 'wasm';
}

export type WorkerMessage =
  | { id: number; type: 'status'; phase: 'loading' | 'transcribing'; message: string }
  | { id: number; type: 'download'; file: string; percent: number }
  | { id: number; type: 'done'; text: string; device: 'webgpu' | 'wasm' }
  | { id: number; type: 'error'; message: string };
