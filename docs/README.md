# Documentación de Transcriptor

Transcriptor es una aplicación web gratuita y de código abierto que ejecuta Whisper directamente en el navegador de cada usuario.

**Estado actual:** el repositorio cuenta con un primer prototipo funcional implementado y validado mediante pruebas automatizadas de navegador. La aplicación está lista para ejecutarse localmente y publicarse en Vercel.

## Por dónde empezar

| Quieres… | Consulta |
| --- | --- |
| Entender qué hace el proyecto | [Presentación del proyecto](../README.md) |
| Conocer cómo se transcribe un audio | [Guía de uso](GUIA_DE_USO.md) |
| Entender dónde estarán tus datos y cómo se protege tu privacidad | [Privacidad y datos](PRIVACIDAD.md) |
| Conocer las decisiones técnicas y diseño del sistema | [Arquitectura](ARQUITECTURA.md) |
| Ejecutar el proyecto localmente o publicarlo en Vercel | [Desarrollo y publicación](DESARROLLO.md) |
| Consultar las etapas y próximos pasos | [Plan de implementación](../PLAN_IMPLEMENTACION.md) |
| Proponer una mejora o contribuir al código | [Cómo contribuir](../CONTRIBUTING.md) |

## Decisiones acordadas y aplicadas

- Acceso web gratuito sin suscripción, registro ni cuentas.
- Inferencia en el cliente: el audio no se envía a ningún servidor.
- Procesamiento en segundo plano mediante un Web Worker para mantener la interfaz fluida.
- Interfaz en React 19 + TypeScript + Vite.
- Inferencia con Transformers.js ejecutando modelos Whisper ONNX multilingües (`base` y `tiny`).
- Ejecución compatible: WebGPU con respaldo automático en WebAssembly (CPU).
- Publicación estática en Vercel a costo $0.
