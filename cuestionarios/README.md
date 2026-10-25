# Cuestionarios de clase

Interfaz sencilla para practicar cuestionarios tipo test desde el móvil.

- Web: https://roystrife.github.io/rehab-bor/cuestionarios/
- Enlace directo a un cuestionario: `.../cuestionarios/?q=<id>` (p. ej. `?q=normas-calidad`)
- En el móvil, «Añadir a pantalla de inicio» la deja como una app.

## Añadir un cuestionario

Cada asignatura tiene su carpeta en la raíz del repo y, dentro, sus cuestionarios por unidad:
`<Asignatura>/cuestionarios/<UD_n>/archivo.json` (p. ej. `Gestion_de_Calidad/cuestionarios/UD_1/`,
`Biotecnologia/cuestionarios/UD_1/`). En la pantalla de inicio salen agrupados igual.

1. Crea un archivo en la carpeta de su módulo y unidad, por ejemplo `Gestion_de_Calidad/cuestionarios/UD_1/appcc.json`:

```json
{
  "titulo": "APPCC: principios básicos",
  "descripcion": "Texto corto opcional",
  "preguntas": [
    {
      "enunciado": "¿Cuántos principios tiene el APPCC?",
      "opciones": ["5", "7", "9", "12"],
      "correcta": 1,
      "explicacion": "Son 7 principios.",
      "pista": "Opcional"
    }
  ]
}
```

`correcta` es la posición de la respuesta buena empezando por 0 (0 = primera opción).
Como las opciones se pueden barajar, en la explicación no uses «la a», «la b»…: nombra la respuesta por su contenido.

2. Añádelo a `cuestionarios/index.json` (`modulo` y `unidad` deciden el grupo; `asignatura` es opcional y sale como etiqueta):

```json
{
  "id": "appcc",
  "titulo": "APPCC: principios básicos",
  "descripcion": "Texto corto opcional",
  "modulo": "Gestión de Calidad",
  "unidad": "UD_1",
  "preguntas": 10,
  "archivo": "Gestion_de_Calidad/cuestionarios/UD_1/appcc.json"
}
```

3. Sube los cambios a `main`. GitHub Pages lo publica en 1-2 minutos.

## Funciones

- Corrección inmediata con explicación y pista opcional.
- Barajar preguntas y respuestas (se puede desactivar en la pantalla de inicio).
- Resultado final, repaso de las falladas y «Repetir falladas».
- Guarda la mejor puntuación de cada cuestionario en el propio navegador.
