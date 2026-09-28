import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import wasmModuleUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';
import { MODELS, type TranscribeRequest, type WorkerMessage } from './types';

env.allowLocalModels = false;
env.useBrowserCache = true;
// Un hilo permite usar WASM sin requerir aislamiento entre orígenes.
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
  // Vite sirve y empaqueta el motor con la web, sin descargarlo de otro CDN.
  env.backends.onnx.wasm.wasmPaths = { wasm: wasmUrl, mjs: wasmModuleUrl };
}

let transcriber: AutomaticSpeechRecognitionPipeline | null = null;
let loadedKey = '';
let running = false;

function send(message: WorkerMessage) {
  self.postMessage(message);
}

async function getTranscriber(request: TranscribeRequest, device: 'webgpu' | 'wasm') {
  const key = `${request.model}:${device}`;
  if (transcriber && loadedKey === key) return transcriber;
  if (transcriber) await transcriber.dispose();
  transcriber = null;
  loadedKey = '';
  const model = MODELS[request.model];
  send({ id: request.id, type: 'status', phase: 'loading', message: 'Descargando y preparando Whisper…' });
  transcriber = await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', model.id, {
    revision: model.revision,
    device,
    dtype: 'q8',
    progress_callback: (progress) => {
      if (progress.status === 'progress') {
        send({ id: request.id, type: 'download', file: progress.file, percent: progress.progress });
      } else if (progress.status === 'done') {
        send({ id: request.id, type: 'download', file: progress.file, percent: 100 });
      }
    },
  });
  loadedKey = key;
  return transcriber;
}

async function run(request: TranscribeRequest, device: 'webgpu' | 'wasm') {
  const instance = await getTranscriber(request, device);
  send({ id: request.id, type: 'status', phase: 'transcribing', message: 'Transcribiendo tu audio…' });
  const result = await instance(request.audio, {
    language: request.language === 'auto' ? undefined : request.language,
    task: 'transcribe',
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: false,
  });
  const text = (Array.isArray(result) ? result.map((part) => part.text).join(' ') : result.text).trim();
  send({ id: request.id, type: 'done', text, device });
}

self.addEventListener('message', async (event: MessageEvent<TranscribeRequest>) => {
  if (running) return;
  running = true;
  const request = event.data;
  try {
    if (request.device === 'auto' && 'gpu' in navigator) {
      try {
        await run(request, 'webgpu');
        return;
      } catch {
        // El soporte anunciado de WebGPU no garantiza que este modelo funcione.
        if (transcriber) await transcriber.dispose().catch(() => undefined);
        transcriber = null;
        loadedKey = '';
        send({ id: request.id, type: 'status', phase: 'loading', message: 'Preparando un modo compatible con tu equipo…' });
      }
    }
    await run(request, 'wasm');
  } catch (error) {
    console.error('No se pudo ejecutar Whisper:', error);
    if (transcriber) await transcriber.dispose().catch(() => undefined);
    transcriber = null;
    loadedKey = '';
    send({ id: request.id, type: 'error', message: 'No se pudo completar la transcripción. Comprueba tu conexión y vuelve a intentarlo. Si continúa, prueba el modo ligero o la opción de compatibilidad.' });
  } finally {
    running = false;
  }
});
