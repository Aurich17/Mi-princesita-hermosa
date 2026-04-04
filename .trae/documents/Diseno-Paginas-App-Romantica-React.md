# Diseño de páginas (desktop-first) — App romántica en React

## Estilos globales (tokens y apariencia)
- Fondo: degradados radiales + patrón suave (como el HTML actual).
- Tokens CSS (recomendado mantenerlos en :root):
  - Colores: --bg1/--bg2/--bg3, --yellow/--yellow-soft, --gold, --text/--text-soft, --card/--card-strong, --ring.
  - Sombra: --shadow, --shadow-soft.
- Tipografía: "Segoe UI", fallback sans-serif; escala:
  - H1: clamp(2.5rem, 5vw, 4.5rem)
  - H2: 1.6–2.0rem (según ancho)
  - Body: 1rem–1.1rem
- Botones:
  - Primario: fondo amarillo, texto oscuro, hover con ligera elevación + sombra.
  - Secundario: fondo translúcido, borde suave, hover con ring.
- Cards/secciones: fondo translúcido (backdrop-filter: blur), borde claro, radius grande (24–28px).

## Breakpoints y responsive
- Desktop-first.
- En <=900px:
  - Hero pasa de 2 columnas a 1.
  - Galería y grids pasan a 1 columna.
  - Mini‑juego (2 paneles) pasa a 1 columna.
  - Modal pasa a layout apilado.

---

## Página principal (/) — Layout y estructura

### Meta information
- Title: "Feliz Cumple, Gabi" (o el nombre que uses)
- Description: "Un rincón hecho con cariño: historia, recuerdos, juego y galería."
- Open Graph:
  - og:title = Title
  - og:description = Description
  - og:type = "website"
  - og:image = (opcional) "/og-cover.jpg"

### Layout
- Estructura general:
  - Nav superior fija (position: fixed), con enlaces a anclas.
  - Contenido centrado en un contenedor máximo ~980–1100px.
  - Secciones en columna (stacked) con separaciones verticales amplias.
- Sistema:
  - Hero: CSS Grid (2 columnas en desktop).
  - Listas/mini cards: Flex o Grid simple.
  - Galería: CSS Grid (3 columnas en desktop, 1 en mobile).
  - Juego: CSS Grid (2 columnas en desktop, 1 en mobile).

### Secciones y componentes

#### 1) TopNav
- Elementos:
  - Links: Inicio, Historia, Juego, Nuestro bebé, Galería.
- Interacciones:
  - Click → scroll a sección usando hash y scrollIntoView (suave).
  - Estado activo (opcional): resaltar link según sección visible.

#### 2) Hero / Portada
- Elementos:
  - Badge + H1 + texto lead.
  - Botones CTA: “Ver nuestra historia” (→ #historia), “Ir al juego” (→ #juego).
  - (Opcional si lo mantienes del HTML) botón reproducir/pausar música + <audio>.
- Visual:
  - Card translúcida grande.
  - Ilustración lateral (emoji capibara/tulipanes) en una segunda card.

#### 3) Historia (capítulos)
- Componente: StorySection
- Estructura:
  - Título H2 + texto introductorio.
  - Acordeón con items (equivalente a <details>):
    - Cabecera: emoji + “Capítulo X: …” + línea breve.
    - Cuerpo: párrafo(s).
- Interacciones:
  - Click en cabecera abre/cierra.
  - Mantener un capítulo abierto por defecto (configurable desde datos).

#### 4) Nuestro bebé
- Componente: BabySection
- Estructura:
  - H2 + párrafo.
  - Lista de 3 items (sueño/promesa/deseo) en cards pequeñas.

#### 5) Galería
- Componente: GallerySection
- Estructura:
  - H2 + texto.
  - Grid de items:
    - Si hay imagen: <img> con object-fit: cover.
    - Si no hay imagen: placeholder con label.
- Interacciones:
  - (Opcional) click abre un modal simple de vista ampliada.

#### 6) Mini‑juego con recuerdos desbloqueables
- Componente: GameSection
- Panel izquierdo (progreso):
  - Camino de nodos (GameTrack): botones circulares con emoji + número.
  - Estados:
    - locked: deshabilitado, opacidad baja.
    - active: resaltado.
  - Controles: Empezar, Avanzar, Reiniciar.
  - Estado textual: guía de qué hacer.
- Panel derecho (reto):
  - Título “Reto: encuentra al capibara 🦫”.
  - Cuadrícula (GameGrid) 3×3 a 5×5:
    - Cada celda es un botón.
    - Al fallar: feedback visual (fondo amarillo suave) + mensaje.
    - Al acertar: desbloquea recuerdo y abre modal.
- Modal (MemoryModal):
  - Cabecera: título + botón cerrar.
  - Cuerpo en 2 columnas: media (imagen/fallback) + texto (subtítulo + párrafo).
  - Cierre: botón, overlay, Escape.

#### 7) Fondo animado (si lo mantienes)
- Componente: FloatingBackground
- Lógica:
  - Generar ~34 elementos (pétalos/brillos) al montar.
  - Respetar prefers-reduced-motion.

---

## Guía de contenido (para que sea fácil editar)
- Todos los textos (capítulos, recuerdos del juego, labels de galería) viven en src/data/*.ts.
- Todas las imágenes/audio viven en /public y se referencian por ruta absoluta.
