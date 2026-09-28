import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prepareAudio } from './transcription/audio';
import { MODELS, type ModelKey, type Phase, type TranscribeRequest, type WorkerMessage } from './transcription/types';

function Icon({ kind, className = '' }: { kind: 'audio' | 'upload' | 'arrow' | 'copy' | 'download' | 'shield' | 'document' | 'github'; className?: string }) {
  const paths: Record<typeof kind, ReactNode> = {
    audio: <><path d="M4 10v4m4-8v12m4-15v18m4-15v12m4-8v4" /></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4" /></>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    document: <><path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6" /></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3 3 0 0 0-1-2c3 0 6-1 6-6a5 5 0 0 0-1-3 5 5 0 0 0 0-4s-1 0-4 2a12 12 0 0 0-6 0C6 3 5 3 5 3a5 5 0 0 0 0 4 5 5 0 0 0-1 3c0 5 3 6 6 6a3 3 0 0 0-1 2v4" /></>,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function fileSize(bytes: number) {
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.ceil(bytes / 1000)} KB`;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState('spanish');
  const [model, setModel] = useState<ModelKey>('base');
  const [compatibility, setCompatibility] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [status, setStatus] = useState('Selecciona un audio para comenzar.');
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [text, setText] = useState('');
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const jobId = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const busy = ['preparing', 'loading', 'transcribing'].includes(phase);
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setDuration(0);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => () => {
    controllerRef.current?.abort();
    workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!busy) return;
    const started = Date.now();
    const interval = setInterval(() => setElapsed((Date.now() - started) / 1000), 1000);
    return () => clearInterval(interval);
  }, [busy]);

  useEffect(() => {
    if (!busy && !text.trim()) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy, text]);

  function chooseFile(next: File | undefined) {
    if (!next || busy) return;
    if (text.trim() && !window.confirm('Al cambiar de audio se borrará el texto actual. ¿Ya lo guardaste y quieres continuar?')) return;
    if (!next.size || (!next.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|flac|aac|webm|mp4|opus|aiff?)$/iu.test(next.name))) {
      setPhase('error');
      setStatus('Selecciona un archivo de audio válido y con contenido.');
      return;
    }
    setFile(next);
    setText('');
    setNotice('');
    setDownloads({});
    setPhase('idle');
    setStatus('Todo listo. Puedes comenzar la transcripción.');
  }

  function receive(message: WorkerMessage) {
    if (message.id !== jobId.current) return;
    if (message.type === 'status') {
      setPhase(message.phase);
      setStatus(message.message);
    } else if (message.type === 'download') {
      setDownloads((previous) => ({ ...previous, [message.file]: Math.max(0, Math.min(100, Number.isFinite(message.percent) ? message.percent : 0)) }));
    } else if (message.type === 'done') {
      setText(message.text);
      setPhase('done');
      setStatus(message.text ? 'Transcripción terminada. Tu texto está listo para revisar.' : 'No se reconocieron palabras. Prueba otro idioma o una grabación con voz más clara.');
    } else {
      setPhase('error');
      setStatus(message.message);
    }
  }

  async function transcribe() {
    if (!file || busy) return;
    if (text.trim() && !window.confirm('Una nueva transcripción reemplazará el texto actual. ¿Quieres continuar?')) return;
    const id = ++jobId.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setText('');
    setNotice('');
    setDownloads({});
    setElapsed(0);
    setPhase('preparing');
    setStatus('Preparando tu audio…');
    try {
      const audio = await prepareAudio(file, controller.signal);
      if (id !== jobId.current) return;
      if (!workerRef.current) {
        const worker = new Worker(new URL('./transcription/worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (event: MessageEvent<WorkerMessage>) => receive(event.data);
        worker.onerror = () => {
          if (workerRef.current !== worker) return;
          worker.terminate();
          workerRef.current = null;
          setPhase('error');
          setStatus('No se pudo iniciar el motor. Comprueba tu conexión o prueba el modo de compatibilidad.');
        };
        workerRef.current = worker;
      }
      setPhase('loading');
      setStatus('Preparando el motor de transcripción…');
      const request: TranscribeRequest = { id, audio, model, language, device: compatibility ? 'wasm' : 'auto' };
      workerRef.current.postMessage(request, [audio.buffer]);
    } catch (error) {
      if (controller.signal.aborted || id !== jobId.current) return;
      console.error('Error al preparar el audio:', error);
      setPhase('error');
      setStatus('No se pudo leer este audio. Puede estar dañado, usar un formato incompatible o requerir más memoria. Prueba una copia en MP3 o WAV.');
    }
  }

  function cancel() {
    jobId.current++;
    controllerRef.current?.abort();
    workerRef.current?.terminate();
    workerRef.current = null;
    setPhase('cancelled');
    setStatus('Transcripción cancelada. Puedes volver a intentarlo cuando quieras.');
    setDownloads({});
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setNotice('Texto copiado.');
    } catch {
      editorRef.current?.focus();
      editorRef.current?.select();
      setNotice('Texto seleccionado. Usa Ctrl+C o ⌘C para copiarlo.');
    }
  }

  function downloadText() {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.[^.]+$/u, '') || 'transcripcion'}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Descarga iniciada.');
  }

  return (
    <>
      <a className="skip-link" href="#workspace">Ir al transcriptor</a>
      <header className="site-header page-width">
        <a className="brand" href="./" aria-label="Transcriptor, inicio"><span className="brand-symbol"><Icon kind="audio" /></span>transcriptor<span className="brand-dot">.</span></a>
        <a className="source-link" href="https://github.com/cristhianl10/transcript" target="_blank" rel="noreferrer"><Icon kind="github" /><span>Código abierto</span><span aria-hidden="true">↗</span></a>
      </header>

      <main className="page-width">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span className="small-dot" /> TUS PALABRAS, SIN LÍMITES DE USO</p>
            <h1 id="page-title">Dale texto a tus audios<span>.</span></h1>
            <p className="intro-copy">Selecciona una grabación y deja que Whisper la convierta en texto.<br className="desktop-break" /> Gratis, a tu ritmo y sin que tu audio salga de tu equipo.</p>
          </div>
          <div className="intro-note"><Icon kind="shield" /><span>Hecho para compartir.<br /><strong>Tu audio se queda contigo.</strong></span></div>
        </section>

        <div id="workspace" className="workspace">
          <section className="audio-panel panel" aria-labelledby="audio-title">
            <div className="panel-heading"><div><span className="step">01</span><h2 id="audio-title">Tu audio</h2></div><span className="panel-caption">El punto de partida</span></div>
            <div className={`drop-area ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }}>
              <input ref={inputRef} type="file" accept="audio/*,.m4a,.wav,.mp3,.ogg,.flac,.opus,.webm" aria-label="Archivo de audio" hidden disabled={busy}
                onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ''; }} />
              <span className="upload-symbol"><Icon kind={file ? 'audio' : 'upload'} /></span>
              <strong className="file-name">{file ? file.name : 'Arrastra tu audio aquí'}</strong>
              <span className="drop-hint">{file ? `${fileSize(file.size)}${duration ? ` · ${formatTime(duration)}` : ''}` : 'o elígelo desde tu dispositivo'}</span>
              <button className="button button-outline" onClick={() => inputRef.current?.click()} disabled={busy}>{file ? 'Cambiar archivo' : 'Seleccionar audio'}</button>
              {!file && <span className="format-hint">MP3, WAV y otros formatos de audio compatibles</span>}
            </div>
            {file && audioUrl && <audio className="audio-player" controls preload="metadata" src={audioUrl} onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} aria-label="Escuchar el audio seleccionado" />}

            <div className="settings">
              <label>Idioma del audio<select value={language} disabled={busy} onChange={(event) => setLanguage(event.target.value)}>
                <option value="spanish">Español</option><option value="auto">Detectar automáticamente</option><option value="english">Inglés</option><option value="portuguese">Portugués</option><option value="french">Francés</option><option value="italian">Italiano</option><option value="german">Alemán</option>
              </select></label>
              <label>Modo de transcripción<select value={model} disabled={busy} onChange={(event) => setModel(event.target.value as ModelKey)}>
                {Object.entries(MODELS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
              </select></label>
            </div>
            <details className="compatibility-options"><summary>Opciones de compatibilidad</summary><label className="checkbox-label"><input type="checkbox" checked={compatibility} disabled={busy} onChange={(event) => setCompatibility(event.target.checked)} />Usar solo el procesador (CPU)</label><p>Actívalo si el modo automático falla en tu navegador.</p></details>
            <button className="button button-primary" onClick={busy ? cancel : transcribe} disabled={!file}>{busy ? 'Cancelar transcripción' : <><span>{phase === 'error' ? 'Volver a intentar' : 'Transcribir audio'}</span><Icon kind="arrow" /></>}</button>
            <p className="download-note">La primera vez se descargará el modelo. Después, tu navegador podrá reutilizarlo.</p>
            <div className={`status-box ${phase === 'error' ? 'status-error' : ''} ${phase === 'done' ? 'status-success' : ''}`}>
              <p role={phase === 'error' ? 'alert' : 'status'} aria-live="polite">{busy && <span className="spinner" aria-hidden="true" />}{status}</p>
              {busy && <span className="elapsed">{formatTime(elapsed)} transcurridos · Mantén esta pestaña abierta</span>}
              {phase === 'loading' && Object.entries(downloads).filter(([name]) => name.endsWith('.onnx')).map(([name, percent], index) => (
                <div className="download-progress" key={name}><label htmlFor={`download-${index}`}>Archivo del modelo {index + 1}<span>{Math.round(percent)} %</span></label><progress id={`download-${index}`} max="100" value={percent} /></div>
              ))}
            </div>
          </section>

          <section className="text-panel panel" aria-labelledby="text-title">
            <div className="panel-heading"><div><span className="step">02</span><h2 id="text-title">Tu transcripción</h2></div><span className="output-tag">TEXTO EDITABLE</span></div>
            <div className="editor-container">
              {!text && <div className="empty-editor" aria-hidden="true"><span className="document-symbol"><Icon kind="document" /></span><h3>{busy ? 'Tus palabras están en camino' : 'Aquí aparecerán tus palabras'}</h3><p>{busy ? 'Puedes seguir usando la página mientras se procesa el audio.' : 'Cuando termine la transcripción, podrás revisar el texto y darle los últimos retoques.'}</p><div className="paper-lines"><i /><i /><i /></div></div>}
              <textarea ref={editorRef} aria-label="Texto de la transcripción" className={text ? 'transcript-editor' : 'transcript-editor editor-empty'} value={text} readOnly={busy || (!text && phase !== 'done')} spellCheck lang={language === 'spanish' ? 'es' : undefined} onChange={(event) => { setText(event.target.value); setNotice(''); }} />
            </div>
            <div className="editor-footer"><span className="word-count">{words} {words === 1 ? 'palabra' : 'palabras'}</span><div className="editor-actions"><button className="button button-quiet" disabled={!text.trim() || busy} onClick={copyText}><Icon kind="copy" />Copiar</button><button className="button button-outline" disabled={!text.trim() || busy} onClick={downloadText}><Icon kind="download" />Descargar TXT</button></div></div>
            <p className="editor-notice" role="status">{notice || 'El texto se conserva en esta pestaña. Descárgalo para guardarlo.'}</p>
          </section>
        </div>

        <section className="principles" aria-label="Sobre Transcriptor">
          <article><span className="principle-number">01 /</span><h3>Privado por naturaleza</h3><p>Whisper trabaja en tu navegador. Tu grabación y su texto permanecen en tu dispositivo.</p></article>
          <article><span className="principle-number">02 /</span><h3>Úsalo cuanto quieras</h3><p>Sin cuentas, suscripciones ni cuotas de minutos. Tú eliges qué y cuánto transcribir.</p></article>
          <article><span className="principle-number">03 /</span><h3>Al ritmo de tu equipo</h3><p>La velocidad depende de tu dispositivo. Prueba el modo ligero si necesitas consumir menos recursos.</p></article>
        </section>
      </main>
      <footer className="site-footer page-width"><span>Una herramienta sencilla. Un proyecto abierto.</span><span>Con Whisper · Licencia MIT · Prototipo 0.1</span></footer>
    </>
  );
}
