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

Consulta la [guía de desarrollo](docs/DESARROLLO.md) para conocer el estado del repositorio. Los comandos para ejecutar la aplicación se incorporarán cuando exista el primer prototipo.

## Documentación

La documentación del proyecto se mantiene en español y su punto de entrada es el [índice de documentación](docs/README.md).

- Usa palabras claras y explica los términos técnicos cuando sean necesarios.
- Distingue las funciones disponibles de las propuestas o pendientes.
- Usa enlaces relativos para referenciar otros archivos del repositorio.
- Actualiza las guías afectadas cuando cambie el comportamiento de la aplicación.
- Al añadir instrucciones ejecutables, comprueba que los archivos y comandos descritos existen.
- Conserva los nombres oficiales de tecnologías, archivos y opciones de configuración.

## Informar de un problema

Incluye los pasos para reproducirlo, el resultado esperado y el observado. Para problemas de transcripción, indica el navegador, sistema operativo, modelo utilizado si se conoce, formato e idioma del audio y duración aproximada.

Usa grabaciones propias sin información sensible o muestras con permiso para compartirlas. La carpeta `local-data/` está excluida de Git para audios y transcripciones personales. Los archivos de modelos descargados también deben mantenerse fuera del repositorio.

## Licencia

Las contribuciones al proyecto se incorporan bajo la [licencia MIT](LICENSE). Conserva los avisos y las licencias de cualquier material de terceros que añadas.
