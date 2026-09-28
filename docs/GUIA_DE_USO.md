# Guía de uso

**Estado:** prototipo funcional listo para usar localmente o desplegar en Vercel.

## Qué necesitarás

- Una computadora con un navegador compatible; la lista de navegadores comprobados se publicará con el prototipo.
- Conexión a internet para cargar la web y descargar el modelo.
- Un archivo de audio en tu dispositivo.

La aplicación estará pensada para usarse sin terminal, instalación de programas ni cuenta de usuario.

## Transcribir un audio

1. **Abrir la web.** El enlace público se añadirá al README cuando esté disponible.
2. **Seleccionar el audio.** Elegir un archivo con el explorador o arrastrarlo a la zona correspondiente. La selección dará acceso al archivo para procesarlo en el navegador.
3. **Elegir el idioma.** Español será la opción inicial propuesta.
4. **Pulsar «Transcribir».** La aplicación descargará y preparará el modelo si es necesario.
5. **Esperar el resultado.** Se mostrará el estado del procesamiento. Mantener la pestaña abierta y el equipo activo hasta terminar.
6. **Revisar y corregir.** Se podrá reproducir el audio y editar el texto reconocido.
7. **Guardar el texto.** Copiar el resultado o descargar un archivo TXT.

Se podrá cancelar una transcripción y comenzar otra. La primera versión procesará un archivo a la vez, sin limitar cuántas veces se repite el proceso.

## La primera descarga

Whisper necesita archivos de un modelo de reconocimiento de voz. El navegador los descargará automáticamente y mostrará el progreso. Su tamaño dependerá del modelo seleccionado para la versión inicial.

La aplicación intentará conservar esos archivos en caché para reutilizarlos. Si se borran los datos del sitio, se usa otro navegador o este libera el almacenamiento, puede ser necesario descargarlos otra vez. Aunque los archivos estén guardados, preparar el motor al abrir una nueva sesión también puede tardar.

## Formatos y resultados previstos

MP3 y WAV son los formatos iniciales que se comprobarán. M4A se evaluará según los códecs disponibles en los navegadores objetivo. La lista final se publicará después de validar la decodificación.

La primera versión permitirá editar, copiar y descargar texto en formato TXT. Las exportaciones de subtítulos SRT y VTT están previstas como mejoras posteriores.

## Preguntas frecuentes

### ¿Cuánto costará transcribir?

El uso de la aplicación será gratuito. No habrá cuotas de minutos, cantidad de transcripciones ni topes artificiales de duración o tamaño. Cada dispositivo aportará el procesamiento.

### ¿Podré transcribir un archivo largo?

La aplicación no lo bloqueará por una cuota comercial. La capacidad real dependerá de la memoria, del navegador y del formato del archivo. El procesamiento por partes ayudará a reducir el consumo, pero su diseño y compatibilidad están pendientes de implementar y comprobar.

### ¿Se enviará mi audio a un servidor?

La arquitectura elegida procesará el audio y el texto en el dispositivo. Puedes consultar los detalles en [Privacidad y datos](PRIVACIDAD.md). Ese comportamiento se verificará antes de publicar la aplicación.

### ¿Funcionará sin internet?

El uso sin conexión es una mejora futura. Guardar el modelo por sí solo no basta: también deben estar disponibles la aplicación y todos los archivos del motor.

### ¿La transcripción será siempre exacta?

Conviene revisar el resultado. El ruido, las voces superpuestas, los nombres propios y la calidad de la grabación pueden producir errores. La interfaz permitirá corregir el texto antes de guardarlo.

### ¿Qué ocurrirá si cierro la pestaña?

El trabajo en curso puede interrumpirse y el texto de la sesión puede perderse. La primera versión ofrecerá copia y descarga explícitas; el historial persistente se incorporaría después.
