import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react'
import type { Block, CourseDocument, DiagramBlock, TextBlock } from './types'
import { practicum2026 } from './content/canvaPracticum'
import { presentationDecks, type PresentationDeck } from './content/presentations'
import { checkpoints, type Checkpoint } from './content/checkpoints'
import { oibPracticum2026 } from './content/oib/oibPracticum'
import { oibPresentationDecks } from './content/oib/oibPresentations'
import { oibCheckpoints } from './content/oib/oibCheckpoints'
import { ACCENTS, highlightCode } from './utils'
import './static-site.css'
import './presentations.css'
import './checkpoints.css'
import './subjects.css'

type ActiveKey = 'praktikum' | 'prezentacije' | 'kontrolne-tacke'
type ArtifactKind = 'figure' | 'listing' | 'table'

type PreparedBlock = {
  block: Block
  anchor?: string
  artifactLabel?: string
}

type TocEntry = {
  id: string
  label: string
  level: 1 | 2 | 3
}

const calloutIcons = {
  info: 'i',
  note: '✦',
  task: '✓',
  warning: '!',
  success: '✓',
}

function assetUrl(src: string) {
  if (/^(?:data:|blob:|https?:|\/\/)/i.test(src)) return src
  return `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`
}

function plain(html: string) {
  const node = document.createElement('div')
  node.innerHTML = html
  return node.textContent?.trim() || ''
}

function inlineMarkup(html: string) {
  return html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
}

function slug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

function sectionFromHeading(block: TextBlock) {
  const value = plain(block.html)
  const numbered = value.match(/^(\d+(?:\.\d+)*)\.?\s+/)
  if (numbered) return numbered[1]
  const exercise = value.match(/^Vežba\s+(\d+)\b/i)
  if (exercise) return exercise[1]
  if (/^Sažetak\b/i.test(value)) return 'S'
  if (/^Preporučena literatura\b/i.test(value)) return 'L'
  return undefined
}

function prepareDocument(doc: CourseDocument) {
  const counters = new Map<string, Record<ArtifactKind, number>>()
  const usedAnchors = new Map<string, number>()
  let section = '0'
  const toc: TocEntry[] = []
  const prepared: PreparedBlock[] = []

  const nextArtifact = (kind: ArtifactKind) => {
    const current = counters.get(section) || { figure: 0, listing: 0, table: 0 }
    current[kind] += 1
    counters.set(section, current)
    const number = `${section}.${current[kind]}`
    if (kind === 'figure') return `Slika ${number}`
    if (kind === 'listing') return `Listing ${number}`
    return `Tabela ${number}`
  }

  for (const page of doc.pages) {
    if (page.layout === 'cover' || page.label === 'Sadržaj') continue

    for (const block of page.blocks) {
      let anchor: string | undefined
      let artifactLabel: string | undefined

      if (block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)) {
        const detected = sectionFromHeading(block)
        if (detected) section = detected
        const label = plain(block.html)
        const base = slug(label)
        const count = (usedAnchors.get(base) || 0) + 1
        usedAnchors.set(base, count)
        anchor = count === 1 ? base : `${base}-${count}`
        toc.push({
          id: anchor,
          label,
          level: block.variant === 'h1' ? 1 : block.variant === 'h2' ? 2 : 3,
        })
      }

      if (block.type === 'image' || block.type === 'diagram') artifactLabel = nextArtifact('figure')
      if (block.type === 'code') artifactLabel = nextArtifact('listing')
      if (block.type === 'table') artifactLabel = nextArtifact('table')

      prepared.push({ block, anchor, artifactLabel })
    }
  }

  return { prepared, toc }
}

function Caption({ label, text }: { label?: string; text?: string }) {
  if (!label && !text) return null
  return (
    <figcaption>
      {label && <strong>{label}</strong>}
      {label && text && <span> — </span>}
      {text && <span>{text}</span>}
    </figcaption>
  )
}

function TextView({ block, anchor }: { block: TextBlock; anchor?: string }) {
  const props = {
    id: anchor,
    className: `doc-${block.variant} ${block.align ? `align-${block.align}` : ''}`,
    dangerouslySetInnerHTML: { __html: inlineMarkup(block.html) },
  }
  if (block.variant === 'h1') return <h1 {...props} />
  if (block.variant === 'h2') return <h2 {...props} />
  if (block.variant === 'h3') return <h3 {...props} />
  if (block.variant === 'quote') return <blockquote {...props} />
  if (block.variant === 'caption') return <p {...props} />
  if (block.variant === 'title') return <h1 {...props} />
  if (block.variant === 'subtitle') return <p {...props} />
  return <p {...props} />
}

function CodeView({ block, label }: { block: Extract<Block, { type: 'code' }>; label?: string }) {
  const lines = block.code.split('\n')
  return (
    <figure className="code-figure keep-together">
      <div className="code-toolbar"><span>{block.language}</span></div>
      <pre className="code-panel">
        {lines.map((line, index) => (
          <span className="code-row" key={`${block.id}-${index}`}>
            <span className="code-number" aria-hidden="true">{index + 1}</span>
            <code dangerouslySetInnerHTML={{ __html: highlightCode(line || ' ', block.language) }} />
          </span>
        ))}
      </pre>
      <Caption label={label} text={block.caption} />
    </figure>
  )
}

function DiagramView({ block, label }: { block: DiagramBlock; label?: string }) {
  const columns = Math.min(block.columns || 4, Math.max(1, block.items.length))
  return (
    <figure className="diagram-figure keep-together">
      {block.title && <h4>{block.title}</h4>}
      <div className={`diagram-grid diagram-${block.variant}`} style={{ '--diagram-columns': columns } as CSSProperties}>
        {block.items.map((item, index) => {
          const accent = ACCENTS[item.accent || 'blue']
          return (
            <div className="diagram-card" key={item.id} style={{ '--card-accent': accent.solid, '--card-soft': accent.soft } as CSSProperties}>
              <span className="diagram-index">{index + 1}</span>
              <strong>{item.title}</strong>
              {item.subtitle && <span>{item.subtitle}</span>}
            </div>
          )
        })}
      </div>
      <Caption label={label} text={block.footer} />
    </figure>
  )
}

function BlockView({ item, onImageOpen }: { item: PreparedBlock; onImageOpen?: (src: string, alt: string) => void }) {
  const { block, anchor, artifactLabel } = item

  if (block.type === 'text') return <TextView block={block} anchor={anchor} />
  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul'
    return <Tag className="doc-list">{block.items.map((entry, index) => <li key={index} dangerouslySetInnerHTML={{ __html: inlineMarkup(entry) }} />)}</Tag>
  }
  if (block.type === 'code') return <CodeView block={block} label={artifactLabel} />
  if (block.type === 'callout') {
    return (
      <aside className={`callout callout-${block.tone} keep-together`}>
        <span className="callout-icon" aria-hidden="true">{calloutIcons[block.tone]}</span>
        <div className="callout-content">
          <strong>{block.title}</strong>
          <div dangerouslySetInnerHTML={{ __html: inlineMarkup(block.text) }} />
        </div>
      </aside>
    )
  }
  if (block.type === 'table') {
    return (
      <figure className="table-figure keep-together">
        <div className="table-scroll">
          <table>
            {block.headers.length > 0 && <thead><tr>{block.headers.map((header, index) => <th key={index} dangerouslySetInnerHTML={{ __html: inlineMarkup(header) }} />)}</tr></thead>}
            <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} dangerouslySetInnerHTML={{ __html: inlineMarkup(cell) }} />)}</tr>)}</tbody>
          </table>
        </div>
        <Caption label={artifactLabel} text={block.caption} />
      </figure>
    )
  }
  if (block.type === 'diagram') return <DiagramView block={block} label={artifactLabel} />
  if (block.type === 'image') {
    const src = assetUrl(block.src)
    const alt = block.alt || block.caption || ''
    return (
      <figure className="image-figure keep-together" style={{ maxWidth: `${block.widthPercent || 100}%` }}>
        <div className="image-frame">
          <img src={src} alt={alt} loading="lazy" />
          <button
            className="image-expand-button no-print"
            onClick={() => onImageOpen?.(src, alt)}
            aria-label="Prikaži sliku uvećano"
            title="Prikaži uvećano"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <Caption label={artifactLabel} text={block.caption} />
      </figure>
    )
  }
  if (block.type === 'institution') {
    return (
      <div className="institution-row keep-together">
        <img src={assetUrl(block.leftLogoSrc || '/brand/university.svg')} alt="Univerzitet u Novom Sadu" />
        <div><strong>{block.university}</strong><span>{block.faculty}</span>{block.department && <small>{block.department}</small>}</div>
        <img src={assetUrl(block.rightLogoSrc || '/brand/ftn.svg')} alt="Fakultet tehničkih nauka" />
      </div>
    )
  }
  return <hr className="doc-divider" />
}

function DocumentCover({ subject }: { subject: string }) {
  return (
    <header className="document-cover">
      <div className="cover-institution">
        <img src={assetUrl('/brand/university.svg')} alt="Univerzitet u Novom Sadu" />
        <div>
          <span>Univerzitet u Novom Sadu</span>
          <strong>Fakultet tehničkih nauka</strong>
          <small>Primenjeno softversko inženjerstvo · 2026/2027</small>
        </div>
        <img src={assetUrl('/brand/ftn.svg')} alt="FTN" />
      </div>
      <div className="cover-copy">
        <span className="eyebrow">{subject}</span>
        <h1>Praktikum</h1>
        <p>Radni materijal za vežbe, samostalno ponavljanje i projektni rad.</p>
      </div>
    </header>
  )
}

const ZOOM_STEPS = [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6]

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="image-lightbox no-print" onClick={onClose}>
      <button className="image-lightbox-close" onClick={onClose} aria-label="Zatvori">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
    </div>
  )
}

function StaticDocument({ doc }: { doc: CourseDocument }) {
  const { prepared, toc } = useMemo(() => prepareDocument(doc), [doc])
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [openImage, setOpenImage] = useState<{ src: string; alt: string } | null>(null)
  const layoutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleChange = () => setIsFullscreen(document.fullscreenElement === layoutRef.current)
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === layoutRef.current) {
        await document.exitFullscreen()
      } else {
        await layoutRef.current?.requestFullscreen()
      }
    } catch {
      // Fullscreen može biti odbijen ako korisnička akcija nije prepoznata.
    }
  }

  const zoomOut = () => setZoom((current) => {
    const smaller = [...ZOOM_STEPS].reverse().find((step) => step < current)
    return smaller ?? current
  })

  const zoomIn = () => setZoom((current) => {
    const bigger = ZOOM_STEPS.find((step) => step > current)
    return bigger ?? current
  })

  return (
    <div className={`document-layout ${isFullscreen ? 'is-fullscreen' : ''}`} ref={layoutRef}>
      <aside className="toc-panel">
        <div className="toc-title">Sadržaj</div>
        <nav>
          {toc.filter((entry) => entry.level <= 2).map((entry) => (
            <a className={`toc-level-${entry.level}`} key={entry.id} href={`#${entry.id}`}>{entry.label}</a>
          ))}
        </nav>
      </aside>

      <div className="document-stage">
        <div className="document-toolbar no-print">
          <div className="zoom-controls" aria-label="Uvećanje stranice">
            <button onClick={zoomOut} disabled={zoom <= ZOOM_STEPS[0]} aria-label="Umanji">−</button>
            <button className="zoom-reset" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
            <button onClick={zoomIn} disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]} aria-label="Uvećaj">+</button>
          </div>
          <button
            className="fullscreen-icon-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Izađi iz celog ekrana' : 'Otvori preko celog ekrana'}
            title={isFullscreen ? 'Izađi iz celog ekrana' : 'Ceo ekran'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        <div className="document-scroll">
          <div className="document-zoom-frame" style={{ '--doc-zoom': zoom } as CSSProperties}>
            <main className="document-paper">
              <DocumentCover subject={doc.subject} />
              <article className="document-body">
                {prepared.map((item, index) => (
                  <BlockView item={item} key={`${item.block.id}-${index}`} onImageOpen={(src, alt) => setOpenImage({ src, alt })} />
                ))}
              </article>
              <footer className="document-end">
                <span>Elementi razvoja softvera</span>
                <span>Univerzitet u Novom Sadu · Fakultet tehničkih nauka</span>
              </footer>
            </main>
          </div>
        </div>
      </div>

      {openImage && <ImageLightbox src={openImage.src} alt={openImage.alt} onClose={() => setOpenImage(null)} />}
    </div>
  )
}

function CheckpointsView({ checkpoints }: { checkpoints: Checkpoint[] }) {
  const [activeId, setActiveId] = useState(checkpoints[0].id)
  const active = checkpoints.find((item) => item.id === activeId) || checkpoints[0]
  const activeIndex = checkpoints.findIndex((item) => item.id === active.id)

  return (
    <main className="checkpoints-shell">
      <div className="checkpoints-topline">
        <h1>Kontrolne tačke</h1>
        <p>Pregled projektnih kontrolnih tačaka kroz semestar.</p>
      </div>

      <ol className="checkpoint-timeline" aria-label="Kontrolne tačke">
        {checkpoints.map((item, index) => (
          <li key={item.id} className={index <= activeIndex ? 'is-reached' : ''}>
            <button
              className={`checkpoint-node ${item.id === active.id ? 'active' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              <span className="checkpoint-node-dot">{item.code}</span>
              <span className="checkpoint-node-date">{item.date}</span>
              <span className="checkpoint-node-title">{item.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <section className="checkpoint-stage">
        <article className="checkpoint-canvas" key={active.id}>
          <div className="checkpoint-toolbar">
            <span className="checkpoint-badge">{active.code}</span>
            <div className="checkpoint-toolbar-title">
              <strong>{active.title}</strong>
              <span>{active.exercise} · nedelja od {active.date}</span>
            </div>
          </div>

          <p className="checkpoint-summary">{active.summary}</p>
          <h3>Šta treba uraditi</h3>
          <ul className="checkpoint-items">
            {active.items.map((item, index) => (
              <li key={item}>
                <span className="checkpoint-item-index">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

function PresentationsView({ presentationDecks }: { presentationDecks: PresentationDeck[] }) {
  const [deckId, setDeckId] = useState(presentationDecks[0].id)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [deckZoom, setDeckZoom] = useState(1)
  const stageRef = useRef<HTMLDivElement>(null)
  const deck = presentationDecks.find((item) => item.id === deckId) || presentationDecks[0]
  const slide = deck.slides[slideIndex] || deck.slides[0]

  const chooseDeck = (nextDeck: PresentationDeck) => {
    setDeckId(nextDeck.id)
    setSlideIndex(0)
  }

  const previousSlide = () => setSlideIndex((current) => Math.max(0, current - 1))
  const nextSlide = () => setSlideIndex((current) => Math.min(deck.slides.length - 1, current + 1))

  useEffect(() => {
    const handleChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  useEffect(() => {
    if (!isFullscreen) {
      setDeckZoom(1)
      return
    }
    const canvas = stageRef.current?.querySelector('.slide-canvas') as HTMLElement | null
    if (!canvas) return
    const REFERENCE_WIDTH = 820
    const updateZoom = () => {
      const stage = stageRef.current
      if (!stage || !canvas) return
      const previousInlineZoom = canvas.style.zoom
      canvas.style.zoom = '1'
      const contentHeight = canvas.scrollHeight
      canvas.style.zoom = previousInlineZoom
      const availableWidth = stage.clientWidth - 112
      const availableHeight = stage.clientHeight - 128
      const scale = Math.min(availableWidth / REFERENCE_WIDTH, availableHeight / contentHeight)
      setDeckZoom(Math.max(1, Math.min(2.6, scale)))
    }
    updateZoom()
    window.addEventListener('resize', updateZoom)
    return () => window.removeEventListener('resize', updateZoom)
  }, [isFullscreen, slideIndex])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === stageRef.current) {
        await document.exitFullscreen()
      } else {
        await stageRef.current?.requestFullscreen()
      }
    } catch {
      // Fullscreen može biti odbijen ako korisnička akcija nije prepoznata.
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previousSlide()
      if (event.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deck.slides.length])

  return (
    <main className="presentations-shell">
      <section className="presentations-hero">
        <span className="eyebrow">Nastavnički materijal</span>
        <h1>Prezentacije za vežbe</h1>
        <p>Svaka prezentacija prati jednu vežbu iz praktikuma. Slajdovi su kratki i služe kao oslonac tokom objašnjavanja gradiva, dok beleške daju smernice za razgovor, primere i pitanja za studente.</p>
      </section>

      <section className="presentation-grid">
        <aside className="deck-list" aria-label="Prezentacije po vežbama">
          {presentationDecks.map((item) => (
            <button className={`deck-tab ${item.id === deck.id ? 'active' : ''}`} key={item.id} onClick={() => chooseDeck(item)}>
              <strong>Vežba {item.exercise}</strong>
              <span>{item.title}</span>
            </button>
          ))}
        </aside>

        <section
          className={`deck-stage ${isFullscreen ? 'is-fullscreen' : ''}`}
          ref={stageRef}
          style={{ '--deck-zoom': deckZoom } as CSSProperties}
        >
          <div className="deck-toolbar">
            <div className="deck-toolbar-title">
              <strong>{deck.title}</strong>
              <span>{deck.subtitle} · {deck.duration}</span>
            </div>
            <div className="slide-controls" aria-label="Kontrole slajdova">
              <button onClick={previousSlide} disabled={slideIndex === 0}>Prethodni</button>
              <span>{slideIndex + 1} / {deck.slides.length}</span>
              <button onClick={nextSlide} disabled={slideIndex === deck.slides.length - 1}>Sledeći</button>
            </div>
          </div>

          <article className="slide-canvas" aria-live="polite" key={`${deck.id}-${slideIndex}`}>
            <span className="slide-kicker">Vežba {deck.exercise}</span>
            <h2>{slide.title}</h2>
            {slide.lead && <p className="slide-lead">{slide.lead}</p>}
            {slide.points && slide.points.length > 0 && (
              <ul className="slide-points">
                {slide.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            )}
            {slide.example && <div className="slide-example"><strong>Primer</strong>{slide.example}</div>}
            {slide.question && <div className="slide-question"><strong>Pitanje za studente</strong>{slide.question}</div>}
          </article>

          <aside className="deck-overview">
            <h3>Cilj prezentacije</h3>
            <p>{deck.goal}</p>
            <ol>
              {deck.slides.map((item, index) => <li key={`${deck.id}-${item.title}`}>{index + 1}. {item.title}</li>)}
            </ol>
          </aside>

          <div className="floating-controls no-print">
            <button
              className="fullscreen-icon-button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Izađi iz celog ekrana' : 'Otvori preko celog ekrana'}
              title={isFullscreen ? 'Izađi iz celog ekrana' : 'Ceo ekran'}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

type CourseAppProps = {
  onBack: () => void
  hashPrefix: string
  brandInitial: string
  brandAccent?: string
  brandShadow?: string
  courseName: string
  academicYear: string
  titlePrefix: string
  doc: CourseDocument
  presentationDecks: PresentationDeck[]
  checkpoints: Checkpoint[]
}

function CourseApp({ onBack, hashPrefix, brandInitial, brandAccent, brandShadow, courseName, academicYear, titlePrefix, doc, presentationDecks, checkpoints }: CourseAppProps) {
  const initial: ActiveKey = window.location.hash.startsWith(`#${hashPrefix}/prezentacije`)
    ? 'prezentacije'
    : window.location.hash.startsWith(`#${hashPrefix}/kontrolne-tacke`)
      ? 'kontrolne-tacke'
      : 'praktikum'
  const [active, setActive] = useState<ActiveKey>(initial)

  useEffect(() => {
    const titles: Record<ActiveKey, string> = {
      praktikum: `${titlePrefix} — Praktikum`,
      prezentacije: `${titlePrefix} — Prezentacije`,
      'kontrolne-tacke': `${titlePrefix} — Kontrolne tačke`,
    }
    document.title = titles[active]
  }, [active, titlePrefix])

  const choose = (key: ActiveKey) => {
    setActive(key)
    history.replaceState(null, '', `#${hashPrefix}/${key}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="site-brand" onClick={onBack}>
          <span
            className="brand-mark"
            style={{ '--brand-accent': brandAccent, '--brand-shadow': brandShadow } as CSSProperties}
          >
            {brandInitial}
          </span>
          <span><strong>{courseName}</strong><small>{academicYear}</small></span>
        </button>
        <nav className="document-switcher" aria-label="Dokumenti">
          <button className={active === 'praktikum' ? 'active' : ''} onClick={() => choose('praktikum')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span>Praktikum</span>
          </button>
          <button className={active === 'prezentacije' ? 'active' : ''} onClick={() => choose('prezentacije')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>Prezentacije</span>
          </button>
          <button className={active === 'kontrolne-tacke' ? 'active' : ''} onClick={() => choose('kontrolne-tacke')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 12.3l1.8 1.8L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Kont. tačke</span>
          </button>
        </nav>
      </header>
      <div className="tab-panel" key={active}>
        {active === 'prezentacije' ? (
          <PresentationsView presentationDecks={presentationDecks} />
        ) : active === 'kontrolne-tacke' ? (
          <CheckpointsView checkpoints={checkpoints} />
        ) : (
          <StaticDocument doc={doc} />
        )}
      </div>
    </div>
  )
}

type Subject = {
  id: string
  name: string
  semester: 'zimski' | 'letnji'
  available: boolean
  blurb: string
  accent: string
  accentSoft: string
}

const subjects: Subject[] = [
  {
    id: 'ers',
    name: 'Elementi razvoja softvera',
    semester: 'zimski',
    available: true,
    blurb: 'Praktikum, prezentacije za vežbe i kontrolne tačke projekta.',
    accent: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 48%, #3730a3 100%)',
    accentSoft: 'rgba(37,99,235,.14)',
  },
  {
    id: 'oib',
    name: 'Osnove informacione bezbednosti',
    semester: 'zimski',
    available: true,
    blurb: 'Praktikum, prezentacije za vežbe i kontrolne tačke projektnog rada iz informacione bezbednosti.',
    accent: 'linear-gradient(145deg, #dc2626 0%, #b91c1c 48%, #7f1d1d 100%)',
    accentSoft: 'rgba(220,38,38,.14)',
  },
  {
    id: 'odp',
    name: 'Osnove distribuiranog programiranja',
    semester: 'letnji',
    available: false,
    blurb: 'Materijal se priprema za letnji semestar.',
    accent: 'linear-gradient(145deg, #059669 0%, #047857 48%, #065f46 100%)',
    accentSoft: 'rgba(5,150,105,.14)',
  },
]

const subjectIcons: Record<string, ReactElement> = {
  ers: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  oib: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 12l1.8 1.8L14.8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  odp: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="6" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="6" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7.2L10.3 16M17 7.2L13.7 16M7.4 6h9.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

function SubjectTile({ subject, onOpen }: { subject: Subject; onOpen: () => void }) {
  return (
    <div
      className={`subject-tile ${subject.available ? '' : 'disabled'}`}
      style={{ '--tile-accent': subject.accent, '--tile-accent-soft': subject.accentSoft } as CSSProperties}
    >
      <span className="subject-tile-mark">{subjectIcons[subject.id]}</span>
      <span className="subject-tile-copy">
        <strong>{subject.name}</strong>
        <span className="subject-tile-meta">{subject.blurb}</span>
        {!subject.available && <span className="subject-tile-badge">Uskoro</span>}
      </span>
      <button className="subject-tile-cta" onClick={onOpen} disabled={!subject.available}>
        <span>{subject.available ? 'Otvori' : 'Uskoro'}</span>
        <svg className="subject-tile-cta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

function SubjectSelector({ onOpenSubject }: { onOpenSubject: (id: string) => void }) {
  useEffect(() => {
    document.title = 'FTN — Izbor predmeta'
  }, [])

  const winter = subjects.filter((subject) => subject.semester === 'zimski')
  const summer = subjects.filter((subject) => subject.semester === 'letnji')

  return (
    <div className="subjects-shell">
      <header className="subjects-header">
        <span className="brand-mark">F</span>
        <div><strong>Materijali za predmete</strong><small>Fakultet tehničkih nauka · Novi Sad</small></div>
      </header>

      <main className="subjects-main">
        <section className="subjects-section">
          <h2>Zimski semestar</h2>
          <div className="subjects-grid">
            {winter.map((subject) => (
              <SubjectTile key={subject.id} subject={subject} onOpen={() => onOpenSubject(subject.id)} />
            ))}
          </div>
        </section>

        <section className="subjects-section">
          <h2>Letnji semestar</h2>
          <div className="subjects-grid">
            {summer.map((subject) => (
              <SubjectTile key={subject.id} subject={subject} onOpen={() => onOpenSubject(subject.id)} />
            ))}
          </div>
        </section>
      </main>

      <footer className="subjects-footer">
        <span>© {new Date().getFullYear()} Univerzitet u Novom Sadu — Fakultet tehničkih nauka</span>
      </footer>
    </div>
  )
}

export default function StaticApp() {
  const [subject, setSubject] = useState<string | null>(
    window.location.hash.startsWith('#ers') ? 'ers' : window.location.hash.startsWith('#oib') ? 'oib' : null,
  )

  const openSubject = (id: string) => {
    setSubject(id)
    history.replaceState(null, '', `#${id}`)
  }

  const backToSubjects = () => {
    setSubject(null)
    history.replaceState(null, '', window.location.pathname)
  }

  if (subject === 'ers') {
    return (
      <CourseApp
        onBack={backToSubjects}
        hashPrefix="ers"
        brandInitial="E"
        courseName="Elementi razvoja softvera"
        academicYear="2026/2027"
        titlePrefix="ERS"
        doc={practicum2026}
        presentationDecks={presentationDecks}
        checkpoints={checkpoints}
      />
    )
  }

  if (subject === 'oib') {
    return (
      <CourseApp
        onBack={backToSubjects}
        hashPrefix="oib"
        brandInitial="S"
        brandAccent="linear-gradient(145deg, #dc2626 0%, #b91c1c 48%, #7f1d1d 100%)"
        brandShadow="rgba(220,38,38,.20)"
        courseName="Osnove informacione bezbednosti"
        academicYear="2026/2027"
        titlePrefix="OIB"
        doc={oibPracticum2026}
        presentationDecks={oibPresentationDecks}
        checkpoints={oibCheckpoints}
      />
    )
  }

  return <SubjectSelector onOpenSubject={openSubject} />
}
