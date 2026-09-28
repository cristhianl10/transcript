# Privacidad y datos

**Estado:** verificado mediante pruebas automatizadas locales; el audio y las transcripciones no realizan peticiones salientes a servidores externos.

## Datos del usuario

| Dato | Uso previsto | Ubicación prevista |
| --- | --- | --- |
| Audio seleccionado | Preparar la entrada y generar la transcripción | Memoria del dispositivo durante el trabajo |
| Texto reconocido y correcciones | Mostrar, editar, copiar y exportar | Sesión de la página |
| Archivo TXT exportado | Guardar el resultado por decisión del usuario | Carpeta de descargas o destino elegido |
| Archivos del modelo | Ejecutar Whisper y evitar descargas repetidas | Caché del navegador, si está disponible |

La primera versión no almacenará un historial persistente de audios o transcripciones. Si posteriormente se incorpora historial, será local y tendrá una opción explícita de borrado.

## Conexiones necesarias

El navegador realizará solicitudes a Vercel para obtener la aplicación y a Hugging Face para descargar los archivos del modelo. Esos proveedores recibirán la información habitual de una solicitud de red, como dirección IP y cabeceras del navegador.

El audio y la transcripción no formarán parte de esas solicitudes. Se revisará el tráfico de la versión publicada para comprobar este requisito. El acceso a la web y la descarga del modelo requieren conexión; el cálculo de la transcripción ocurre en el dispositivo.

## Almacenamiento y borrado

La caché del modelo podrá desaparecer si se borran los datos del sitio o el navegador libera espacio. Eso provocaría una nueva descarga cuando se vuelva a necesitar el modelo.

Los resultados permanecerán en la sesión hasta que el usuario los copie o descargue. Cerrar o recargar la página puede perder el texto no guardado. Borrar los datos del sitio no elimina los TXT que el usuario ya haya descargado.

## Informar de problemas

Los reportes deben describir el fallo con datos técnicos y pasos para reproducirlo. Para compartir una grabación de ejemplo, utiliza una muestra que tengas permiso de publicar y que no contenga información sensible.

Durante el desarrollo, `local-data/` está excluida de Git para guardar materiales personales. Una carpeta ignorada evita su incorporación habitual al repositorio; no cifra ni elimina los archivos.

Consulta también [Cómo contribuir](../CONTRIBUTING.md).
