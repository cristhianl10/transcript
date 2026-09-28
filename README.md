# Transcriptor

Una web gratuita y de código abierto para transcribir audio con Whisper directamente en el navegador.

El proyecto nace para que cualquier persona pueda seleccionar un audio y obtener su texto sin usar la terminal, instalar programas ni pagar una suscripción.

## Estado del proyecto

En desarrollo inicial. La arquitectura está definida y este repositorio contiene la documentación de partida. La aplicación todavía no está implementada ni hay una versión pública disponible.

El siguiente paso es construir un prototipo que transcriba audio en español dentro del navegador. Consulta el [plan de implementación](PLAN_IMPLEMENTACION.md) para conocer las etapas y decisiones técnicas.

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

## Contribuir

Las contribuciones al código, documentación, accesibilidad y evaluación de transcripciones son bienvenidas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de proponer un cambio.

Los comandos de instalación y desarrollo se documentarán cuando esté disponible el primer prototipo.

## Licencia y créditos

Este proyecto se distribuye bajo la [licencia MIT](LICENSE).

La transcripción se apoyará en [Whisper, de OpenAI](https://github.com/openai/whisper), y [Transformers.js, de Hugging Face](https://github.com/huggingface/transformers.js). Los modelos y las dependencias conservan sus licencias y avisos correspondientes.
