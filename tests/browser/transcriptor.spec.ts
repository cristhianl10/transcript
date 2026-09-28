import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

function silentWav() {
  const samples = 16_000;
  const audio = Buffer.alloc(44 + samples * 2);
  audio.write('RIFF');
  audio.writeUInt32LE(36 + samples * 2, 4);
  audio.write('WAVEfmt ', 8);
  audio.writeUInt32LE(16, 16);
  audio.writeUInt16LE(1, 20);
  audio.writeUInt16LE(1, 22);
  audio.writeUInt32LE(16_000, 24);
  audio.writeUInt32LE(32_000, 28);
  audio.writeUInt16LE(2, 32);
  audio.writeUInt16LE(16, 34);
  audio.write('data', 36);
  audio.writeUInt32LE(samples * 2, 40);
  return audio;
}

test('seleccionar, cancelar y conservar una interfaz usable en móvil', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Transcribir audio' })).toBeDisabled();
  await page.locator('input[type="file"]').setInputFiles({ name: 'prueba.wav', mimeType: 'audio/wav', buffer: silentWav() });
  await expect(page.getByText('prueba.wav', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Transcribir audio' }).click();
  await page.getByRole('button', { name: 'Cancelar transcripción' }).click();
  await expect(page.getByText('Transcripción cancelada. Puedes volver a intentarlo cuando quieras.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Transcribir audio' })).toBeEnabled();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/transcriptor-mobile.png', fullPage: true });
});

test('informa de un archivo inválido sin iniciar la transcripción', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[type="file"]').setInputFiles({ name: 'nota.txt', mimeType: 'text/plain', buffer: Buffer.from('Esto no es audio.') });
  await expect(page.getByRole('alert')).toContainText('Selecciona un archivo de audio válido');
  await expect(page.getByRole('button', { name: 'Volver a intentar' })).toBeDisabled();
});

test('Whisper real transcribe español y exporta el texto corregido', async ({ page }) => {
  test.skip(!process.env.TRANSCRIPTOR_AUDIO_FIXTURE, 'Configura TRANSCRIPTOR_AUDIO_FIXTURE con un audio de voz en español para esta prueba real.');
  test.setTimeout(240_000);
  const errors: string[] = [];
  const outboundWrites: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method())) outboundWrites.push(request.url());
  });
  page.on('console', (message) => { if (message.type() === 'error') console.log('Browser:', message.text()); });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/transcriptor-desktop.png', fullPage: true });
  await page.locator('input[type="file"]').setInputFiles(process.env.TRANSCRIPTOR_AUDIO_FIXTURE!);
  await page.getByLabel('Modo de transcripción').selectOption(process.env.TRANSCRIPTOR_TEST_MODEL || 'tiny');
  await page.getByText('Opciones de compatibilidad', { exact: true }).click();
  await page.getByLabel('Usar solo el procesador (CPU)').check();
  await page.getByRole('button', { name: 'Transcribir audio' }).click();
  await expect(page.getByText('Transcripción terminada. Tu texto está listo para revisar.')).toBeVisible({ timeout: 210_000 });
  const editor = page.getByRole('textbox', { name: 'Texto de la transcripción' });
  const recognized = await editor.inputValue();
  expect(recognized.trim().length).toBeGreaterThan(0);
  expect(recognized.toLowerCase()).toMatch(/importante|texto|prueba/u);
  await editor.fill('Transcripción revisada: el audio se procesó en mi navegador.');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar TXT' }).click();
  const download = await downloadPromise;
  const saved = await readFile((await download.path())!, 'utf8');
  expect(saved).toBe('Transcripción revisada: el audio se procesó en mi navegador.');
  expect(download.suggestedFilename()).toMatch(/\.txt$/u);
  expect(errors).toEqual([]);
  expect(outboundWrites).toEqual([]);
  await page.screenshot({ path: 'test-results/transcriptor-result.png', fullPage: true });
});
