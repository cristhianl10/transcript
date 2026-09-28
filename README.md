# Transcriptor

Una web gratuita y de código abierto para transcribir audio con Whisper directamente en el navegador.

El proyecto nace para que cualquier persona pueda seleccionar un audio y obtener su texto sin usar la terminal, instalar programas ni pagar una suscripción.

## Estado del proyecto

Prototipo funcional completado y verificado. La interfaz web ejecuta Whisper directamente en el navegador del usuario utilizando Web Workers y Transformers.js con soporte WebGPU y WebAssembly.

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/cristhianl10/transcript.git
cd transcript

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local
npm run dev
```

Visita `http://127.0.0.1:5173` en tu navegador para usar la aplicación.

## Qué queremos construir

- Seleccionar o arrastrar un archivo de audio.
- Transcribir con Whisper en el dispositivo del usuario.
- Mostrar el progreso de descarga del modelo y de transcripción.
- Revisar y corregir el texto, copiarlo o descargarlo como TXT.
- Repetir el proceso sin cuotas de minutos, número de transcripciones ni topes artificiales de tamaño o duración.
- Acceder sin cuenta ni suscripción.

El rendimiento y la capacidad de procesar un archivo dependerán del equipo, la memoria disponible y el navegador.

## Cómo funcionará

La interfaz se publicará como una web estática en Vercel. Al comenzar una transcripción, el navegador descargará los archivos de Whisper desde Hugging Face y ejecutará el modelo mediante Transformers.js. La caché permitirá reutilizar los archivos descargados mientras el navegador los conserve.

El audio y el texto se procesarán en el dispositivo. Las conexiones de red servirán para obtener la aplicación y el modelo. Este comportamiento se verificará durante la implementación.

| Parte | Tecnología prevista |
| --- | --- |
| Interfaz | React, TypeScript y Vite |
| Transcripción | Whisper en formato ONNX con Transformers.js |
| Procesamiento | Web Worker, WebGPU y alternativa con WebAssembly |
| Alojamiento de la web | Vercel Hobby |
| Distribución del modelo | Repositorio público de Hugging Face |

La arquitectura está diseñada para operar con un presupuesto de alojamiento de $0, dentro de las condiciones de los servicios utilizados. El dispositivo de cada usuario aporta el cómputo de la transcripción.

## Documentación en español

La documentación describe el funcionamiento previsto y distingue las decisiones acordadas de las funciones pendientes de implementar.

| Documento | Contenido |
| --- | --- |
| [Índice de documentación](docs/README.md) | Por dónde empezar según lo que necesitas |
| [Guía de uso](docs/GUIA_DE_USO.md) | Seleccionar audio, transcribir, corregir y descargar el texto |
| [Arquitectura](docs/ARQUITECTURA.md) | Componentes, procesamiento en el navegador y gestión de recursos |
| [Privacidad y datos](docs/PRIVACIDAD.md) | Qué se procesa en el dispositivo y qué conexiones se realizarán |
| [Desarrollo y publicación](docs/DESARROLLO.md) | Estado del repositorio, trabajo de desarrollo y publicación prevista en Vercel |
| [Plan de implementación](PLAN_IMPLEMENTACION.md) | Etapas y criterios para completar la primera versión |
| [Cómo contribuir](CONTRIBUTING.md) | Proponer mejoras y comunicar problemas |

## Contribuir

Las contribuciones al código, documentación, accesibilidad y evaluación de transcripciones son bienvenidas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de proponer un cambio.

Para conocer el flujo de trabajo, scripts disponibles y cómo ejecutar las pruebas automatizadas, consulta la [guía de desarrollo](docs/DESARROLLO.md).

## Licencia y créditos

Este proyecto se distribuye bajo la [licencia MIT](LICENSE).

La transcripción se apoyará en [Whisper, de OpenAI](https://github.com/openai/whisper), y [Transformers.js, de Hugging Face](https://github.com/huggingface/transformers.js). Los modelos y las dependencias conservan sus licencias y avisos correspondientes.
