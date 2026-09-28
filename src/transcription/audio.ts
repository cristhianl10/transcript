export async function prepareAudio(file: File, signal: AbortSignal): Promise<Float32Array> {
  signal.throwIfAborted();
  const contents = await file.arrayBuffer();
  signal.throwIfAborted();

  // decodeAudioData remuestrea a la frecuencia del contexto. No se carga ni
  // reproduce el audio en un servidor; el navegador realiza la decodificación.
  const context = new OfflineAudioContext(1, 1, 16_000);
  const decoded = await context.decodeAudioData(contents);
  signal.throwIfAborted();
  if (!decoded.length) throw new Error('El archivo no contiene audio que se pueda procesar.');

  const mono = new Float32Array(decoded.length);
  const channels = Array.from({ length: decoded.numberOfChannels }, (_, i) => decoded.getChannelData(i));
  const blockSize = 160_000;
  for (let start = 0; start < mono.length; start += blockSize) {
    const end = Math.min(start + blockSize, mono.length);
    for (const channel of channels) {
      for (let i = start; i < end; i++) mono[i] += channel[i] / channels.length;
    }
    // Permite responder al botón de cancelación mientras se mezclan archivos largos.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    signal.throwIfAborted();
  }
  return mono;
}
