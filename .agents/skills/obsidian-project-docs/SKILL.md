---
name: obsidian-project-docs
description: >
  Skill para documentar, registrar y actualizar el vault de Obsidian al finalizar tareas o instrucciones en cualquier proyecto.
  Usarlo siempre que el usuario pida "actualizar Obsidian", "documentar en Obsidian", "registrar la bitacora", "actualizar notas",
  "documentar la tarea", o cualquier variante que implique dejar rastro de lo trabajado en el vault.
  Tambien aplica automaticamente al invocar el skill task-summary-format si el proyecto tiene vault Obsidian configurado.
---

# Obsidian - Documentacion de Proyectos y Bitacoras

Skill para registrar el trabajo realizado en un proyecto dentro del vault de Obsidian usando el servidor MCP.
Es complementario a `obsidian-vault-organizer` (que organiza la estructura) y a `task-summary-format` (que define el formato de la bitacora local).

---

## Principio Rector

> **Toda tarea resuelta debe dejar huella en tres lugares:**
> 1. `BITACORA.md` del repositorio (registro tecnico interno, en el workspace).
> 2. `Bitacora-AAAA-MM-DD.md` en el vault Obsidian (registro diario navegable).
> 3. `Ficha-Principal-<proyecto>.md` en el vault (estado actual del proyecto, siempre vigente).

---

## Estructura de Carpetas en el Vault

Cada proyecto sigue la siguiente convencion dentro del vault:

```
01 - Proyectos/
  └── <nombre-proyecto>/
        ├── Ficha-Principal-<nombre-proyecto>.md   <- Estado vivo del proyecto
        ├── Bitacora-AAAA-MM-DD.md                <- Una por dia de trabajo
        └── <documentos-adicionales>.md
```

> **Regla**: nunca crear mas de una bitacora por dia por proyecto.
> Si ya existe `Bitacora-AAAA-MM-DD.md`, **agregarle** una nueva seccion en vez de crear un archivo nuevo.

---

## Flujo Obligatorio al Finalizar una Tarea

### Paso 1 - Verificar si existe la carpeta del proyecto

```
list_vault_files(directory="01 - Proyectos/<nombre-proyecto>")
```

Si no existe la carpeta, crear la Ficha Principal con la plantilla correspondiente.

---

### Paso 2 - Crear o actualizar la Bitacora del Dia

Verificar si ya existe `Bitacora-AAAA-MM-DD.md` del dia actual con `get_vault_file`.

- Si **no existe** -> Crear con la plantilla de bitacora diaria.
- Si **ya existe** -> Agregar nueva seccion al final usando `append_to_vault_file`.

---

### Paso 3 - Actualizar la Ficha Principal del Proyecto

Siempre actualizar la Ficha Principal con:
- Estado actual del proyecto (`en-desarrollo` / `produccion-activa` / `pausado` / `completado`).
- URL de produccion si cambio.
- `ultima_actualizacion` con la fecha de hoy.
- Un nuevo parrafo en la seccion "Bitacora de Antigravity (Logs)" con el hito del dia.

> IMPORTANTE: `create_vault_file` sobreescribe el archivo completo.
> Siempre leer primero con `get_vault_file`, modificar el contenido en memoria y luego sobreescribir.

---

## Plantillas

### Bitacora Diaria

```markdown
---
tipo: bitacora-diaria
proyecto: <nombre-proyecto>
fecha: AAAA-MM-DD
tags: [<nombre-proyecto>, <tag1>, <tag2>]
---

# Bitacora AAAA-MM-DD - <Nombre del Proyecto>

## Tareas Completadas

### 1. <Titulo del Hito>
- <Descripcion de lo hecho>
- Archivos: `<archivo1>`, `<archivo2>`

## Despliegue y Verificacion
- **Build**: exito/fallo + detalles
- **URL**: <url-si-aplica>

## Pendiente
- [ ] <Proximo item>

---
<- [[Ficha-Principal-<nombre-proyecto>]] | [[Bitacora-AAAA-MM-<dia-anterior>]]
```

---

### Ficha Principal del Proyecto

```markdown
---
tipo: proyecto
proyecto: <nombre-proyecto>
estado: en-desarrollo
ultima_actualizacion: AAAA-MM-DD
urls:
  - <url-produccion>
tags: [<nombre-proyecto>, <tecnologias>]
---

# Proyecto: <Nombre Legible>

## Descripcion General
<Que hace el proyecto, para quien y que problema resuelve.>

- **URL de Produccion**: <url>
- **Stack**: <tecnologias>
- **Directorio Local**: [<ruta>](file:///<ruta-escapada>)

---

## Roles y Credenciales Demo

| Rol | Email | Contrasena | Notas |
|-----|-------|-----------|-------|
| ... | ... | ... | ... |

---

## Arquitectura de Componentes Clave
(Tabla de archivos y componentes principales)

---

## Seguridad y Configuracion
(Variables de entorno, RLS, RBAC, etc.)

---

## Bitacora de Antigravity (Logs)

### [AAAA-MM-DD] <Hito>
- <Descripcion breve del trabajo realizado>

---

## Documentacion Relacionada
- [[Bitacora-AAAA-MM-DD]]

---
#proyecto #<nombre-proyecto>
```

---

## Herramientas MCP Disponibles

| Herramienta | Cuando usarla |
|-------------|---------------|
| `list_vault_files(directory?)` | Explorar estructura del vault o carpeta |
| `get_vault_file(filename)` | Leer contenido de una nota existente |
| `create_vault_file(filename, content)` | Crear nueva nota o sobreescribir una existente |
| `append_to_vault_file(filename, content)` | Agregar al final de una nota sin leerla completa |
| `patch_vault_file(filename, ...)` | Modificar seccion especifica de una nota |
| `search_vault_simple(query)` | Buscar notas por texto en el vault |
| `search_vault(query)` | Busqueda avanzada en el vault |

> ATENCION: El parametro correcto para identificar una nota es `filename` (no `file_path` ni `path`).
> Usar siempre la ruta relativa desde la raiz del vault, por ejemplo:
> `"01 - Proyectos/evaluaciones/Bitacora-2026-08-14.md"`

---

## Mapeo de Proyectos del Workspace

| Proyecto | Carpeta en Vault | Ficha Principal |
|----------|-----------------|-----------------|
| Sysget Saber (Evaluaciones Nacionales) | `01 - Proyectos/evaluaciones/` | `Ficha-Principal-Evaluaciones.md` |
| PAES Web | `01 - Proyectos/paes-web/` | (crear si no existe) |
| Asistente Bot | `01 - Proyectos/asistente-bot/` | (crear si no existe) |
| Control Asistencia | `01 - Proyectos/control-asistencia/` | (crear si no existe) |

> Agregar nuevas filas a esta tabla cuando se documente un proyecto nuevo por primera vez.

---

## Reglas Criticas

- NO usar `delete_vault_file` + `create_vault_file` para renombrar notas.
- NO crear multiples bitacoras para el mismo dia en el mismo proyecto.
- NO mezclar idiomas en frontmatter YAML (siempre en espanol para valores de `tipo`, `estado`).
- SIEMPRE leer la Ficha Principal con `get_vault_file` antes de sobreescribirla.
- SIEMPRE anadir backlinks al final de cada bitacora diaria.
- SIEMPRE actualizar `ultima_actualizacion` en el frontmatter de la Ficha Principal.
- SIEMPRE registrar el BITACORA.md del repositorio local ADEMAS de Obsidian (son complementarios, no sustitutos).
