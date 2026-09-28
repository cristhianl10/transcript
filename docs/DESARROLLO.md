# Desarrollo y publicación

## Estado actual

El proyecto cuenta con su primer prototipo funcional implementado con React 19, TypeScript y Vite. La transcripción se ejecuta localmente en el navegador mediante Transformers.js y modelos Whisper ONNX multilingües (`base` y `tiny`).

## Requisitos previos

- Node.js >= 22.12.0 (se incluye `.nvmrc`)
- npm >= 10

## Puesta en marcha local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/cristhianl10/transcript.git
   cd transcript
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://127.0.0.1:5173](http://127.0.0.1:5173) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor local de desarrollo con recarga rápida |
| `npm run typecheck` | Comprueba tipos con TypeScript (`tsc --noEmit`) |
| `npm run build` | Valida tipos y compila los archivos estáticos en `dist/` |
| `npm run preview` | Sirve la compilación de `dist/` localmente |
| `npm run test:browser` | Ejecuta las pruebas automatizadas de navegador con Playwright |

Para ejecutar la prueba integral con inferencia real de Whisper:
```bash
TRANSCRIPTOR_AUDIO_FIXTURE=/ruta/al/audio.wav npm run test:browser
```

## Estructura del proyecto

```text
transcriptor/
├── docs/                      # Documentación completa en español
│   ├── README.md              # Índice de documentación
│   ├── GUIA_DE_USO.md         # Guía para el usuario final
│   ├── ARQUITECTURA.md        # Diseño del motor y componentes
│   ├── PRIVACIDAD.md          # Política y garantías de privacidad
│   └── DESARROLLO.md          # Esta guía
├── src/                       # Código fuente de la aplicación
│   ├── App.tsx                # Interfaz principal de usuario
│   ├── main.tsx               # Punto de entrada de React
│   ├── styles.css             # Estilos y diseño responsivo
│   └── transcription/         # Motor de transcripción en el navegador
│       ├── audio.ts           # Decodificación y normalización con Web Audio
│       ├── types.ts           # Tipos de TypeScript y modelos soportados
│       └── worker.ts          # Web Worker con Transformers.js Whisper ONNX
├── tests/                     # Pruebas automatizadas
│   └── browser/
│       └── transcriptor.spec.ts # Pruebas e2e con Playwright
├── public/                    # Archivos estáticos directos
├── index.html                 # HTML base de la aplicación
├── package.json               # Dependencias y scripts
├── playwright.config.ts       # Configuración de Playwright
├── tsconfig.json              # Configuración de TypeScript
├── vite.config.ts             # Configuración de Vite
├── PLAN_IMPLEMENTACION.md     # Plan y etapas del proyecto
├── CONTRIBUTING.md            # Guía de contribución
├── README.md                  # Descripción del proyecto
└── LICENSE                    # Licencia MIT
```

## Publicación en Vercel

La aplicación está lista para publicarse como sitio estático sin requerir backend ni funciones serverless:

1. Conectar el repositorio de GitHub en el panel de Vercel.
2. Seleccionar el framework preestablecido **Vite**.
3. El comando de compilación será `npm run build` y el directorio de salida `dist`.
4. El subdominio gratuito `transcriptor-*.vercel.app` o personalizado servirá la aplicación.
5. Los pesos de los modelos Whisper se descargan directamente en el navegador del usuario desde Hugging Face y se almacenan en la caché del navegador.
