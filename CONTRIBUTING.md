# Contribuir a Transcriptor

Gracias por contribuir. El proyecto está en su etapa inicial; el [plan de implementación](PLAN_IMPLEMENTACION.md) describe la arquitectura y el alcance acordados.

## Principios del proyecto

- La aplicación es web y ejecuta Whisper en el navegador del usuario.
- El uso es gratuito, sin cuotas artificiales de transcripción ni suscripciones.
- El audio y el texto se procesan en el dispositivo.
- El flujo principal debe poder utilizarse sin conocimientos técnicos.
- La interfaz debe ser accesible mediante teclado y comunicar claramente su estado.

## Proponer un cambio

1. Revisa las incidencias y el plan para evitar trabajo duplicado.
2. Para un cambio grande, abre una incidencia que explique el problema y tu propuesta.
3. Crea una rama para tu cambio y procura que cada solicitud de cambios tenga un objetivo concreto.
4. Describe qué cambiaste, por qué y cómo comprobaste el resultado. Si todavía no pudiste validarlo, indícalo.

Los comandos de desarrollo se añadirán al README cuando exista el primer prototipo.

## Informar de un problema

Incluye los pasos para reproducirlo, el resultado esperado y el observado. Para problemas de transcripción, indica el navegador, sistema operativo, modelo utilizado si se conoce, formato e idioma del audio y duración aproximada.

Usa grabaciones propias sin información sensible o muestras con permiso para compartirlas. La carpeta `local-data/` está excluida de Git para audios y transcripciones personales. Los archivos de modelos descargados también deben mantenerse fuera del repositorio.

## Licencia

Las contribuciones al proyecto se incorporan bajo la [licencia MIT](LICENSE). Conserva los avisos y las licencias de cualquier material de terceros que añadas.
