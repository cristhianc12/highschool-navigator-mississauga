# Highschool Navigator Mississauga

Guía informativa (ES/EN) de secundarias en Mississauga: 4 escuelas católicas de Mississauga Este, programas regionales del DPCDSB, programas RLCP de Peel, línea de tiempo por grados, fechas y nota Fraser Institute. Incluye filtros, búsqueda y comparador.

Sitio estático (HTML/CSS/JS con módulos ES), sin build.

## Ejecutar en local
```bash
npx serve .
```

## Actualizar contenido
Todo el contenido (textos ES/EN, escuelas, programas, notas Fraser, fechas) está en `js/content.js`.

## Notas Fraser
Fuente: Fraser Institute, *Report Card on Ontario's Secondary Schools 2025* (año escolar 2024-25). Se actualiza cada otoño: editar `fraser` de cada escuela en `js/content.js`.

## Despliegue
Vercel (proyecto estático, sin framework). `vercel.json` define cabeceras de seguridad. Activar *Web Analytics* en el panel de Vercel para el script de `/_vercel/insights`.
