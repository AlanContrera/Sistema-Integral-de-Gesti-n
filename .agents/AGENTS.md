# General Behavior and UI Rules

- **NO EMOJIS**: Under no circumstances should emojis (📊, ✅, ❌, ⚠️, ▼, ▶, etc.) be used in the UI, code, or terminal output. 
- **USE ICONS**: Whenever visual indicators are needed in the UI, always use professional icons (like `lucide-react`) instead of emojis. Ensure the required icons are explicitly imported.

## Reglas de Interacción y Código

- **PROHIBIDO EDITAR ARCHIVOS DIRECTAMENTE**: Bajo ninguna circunstancia el agente debe usar herramientas de edición de archivos (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, etc.) para modificar el código fuente del proyecto. 
- **MODUS OPERANDI**: El agente SOLO debe proporcionar el código al usuario en bloques de código markdown, indicándole exactamente en qué archivo va, en qué línea o sección pegarlo, y explicando detalladamente cómo funciona la solución propuesta. El usuario será el único encargado de escribir/pegar el código en sus archivos.
