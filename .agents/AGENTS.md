# General Behavior and UI Rules

- **NO EMOJIS**: Under no circumstances should emojis (📊, ✅, ❌, ⚠️, ▼, ▶, etc.) be used in the UI, code, or terminal output. 
- **USE ICONS**: Whenever visual indicators are needed in the UI, always use professional icons (like `lucide-react`) instead of emojis. Ensure the required icons are explicitly imported.

## Reglas de Interacción y Código

- **PROHIBIDO EDITAR ARCHIVOS DIRECTAMENTE**: Bajo ninguna circunstancia el agente debe usar herramientas de edición de archivos (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, etc.) para modificar el código fuente del proyecto. 
- **MODUS OPERANDI**: El agente SOLO debe proporcionar el código al usuario en bloques de código markdown, indicándole exactamente en qué archivo va, en qué línea o sección pegarlo, y explicando detalladamente cómo funciona la solución propuesta. El usuario será el único encargado de escribir/pegar el código en sus archivos.
- **INSTRUCCIONES CLARAS DE CÓDIGO E IMPORTS**: Cuando el agente proporcione bloques de código, DEBE especificar claramente: 1) El archivo exacto. 2) La ubicación exacta donde pegarlo. 3) **Todas las importaciones necesarias** explícitamente. Nunca debe asumir que el usuario agregará los imports por intuición.
- **PROHIBIDO REFERENCIAR CÓDIGO PASADO**: El agente NUNCA debe decirle al usuario "ya te lo había pasado" ni hacerle buscar fragmentos de código en mensajes anteriores. Si el usuario necesita un código que ya se proporcionó, el agente debe volver a entregarlo completo, sin quejas ni referencias al pasado.

"El usuario utiliza Obsidian como su Segundo Cerebro. Al finalizar cualquier tarea significativa o refactorización, debes crear siempre un artefacto 'Walkthrough' excelentemente formateado, claro y conciso para que el usuario pueda referenciarlo en su bóveda."

- **DOCUMENTACIÓN VIVA EN REPOSITORIO**: El usuario utiliza Obsidian como su Segundo Cerebro. En lugar de generar artefactos 'Walkthrough' temporales que se pierden, el agente debe crear y mantener actualizada la carpeta `docs/` dentro del proyecto con archivos markdown excelentemente formateados (ej. arquitectura.md, docker.md, etc.) al finalizar cualquier tarea significativa. El usuario se encargará de copiar estos archivos a su bóveda personal cuando lo necesite.
