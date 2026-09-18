import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import './examples.css'

type PortalTargets = {
  nav: HTMLElement
  panel: HTMLElement
}

type ExampleEntry = {
  path: string
  note: string
  kind: 'solution' | 'code' | 'config' | 'test' | 'eval'
}

type LessonExamples = {
  number: number
  title: string
  summary: string
  zip: string
  entries: ExampleEntry[]
}

type SupplementalExample = {
  exercise: number
  title: string
  description: string
  zip: string
  tags: string[]
}

const supplementalExamples: SupplementalExample[] = [
  {
    exercise: 2,
    title: 'Logger–Blogger',
    description: 'Primer za primenu SOLID principa kroz razdvajanje poslovne logike, logovanja i infrastrukturnih odgovornosti.',
    zip: 'Logger-Bloger.zip',
    tags: ['SOLID', 'SRP', 'DIP'],
  },
  {
    exercise: 3,
    title: 'ECommerce',
    description: 'Primer Clean Architecture organizacije sa domenom, aplikacionim slojem, repozitorijumima, komandama i upitima.',
    zip: 'E-Commerce.zip',
    tags: ['Clean Architecture', 'Repository', 'Use cases'],
  },
]

const lessons: LessonExamples[] = [
  {
    number: 5,
    title: 'Integracija modula, ugovori i podaci',
    summary: 'Osnova Clean Architecture pristupa: domen, aplikacioni sloj, portovi, adapteri, API i idempotentnost zahteva.',
    zip: 'vezba-5-integracija-modula.zip',
    entries: [
      { path: 'EquipmentReservation.sln', note: 'Glavni solution za otvaranje primera', kind: 'solution' },
      { path: 'src/EquipmentReservation.Domain/', note: 'Entiteti i poslovna pravila', kind: 'code' },
      { path: 'src/EquipmentReservation.Application/', note: 'Use-case logika i portovi', kind: 'code' },
      { path: 'src/EquipmentReservation.Infrastructure/', note: 'Implementacije portova i infrastrukturni adapteri', kind: 'code' },
      { path: 'src/EquipmentReservation.Api/', note: 'HTTP API kao ulaz u aplikaciju', kind: 'code' },
      { path: 'src/EquipmentReservation.ConsoleUi/', note: 'Jednostavan konzolni interfejs za rad sa primerom', kind: 'code' },
      { path: 'tests/EquipmentReservation.Tests/ReservationTests.cs', note: 'Testovi poslovnih pravila i idempotentnosti', kind: 'test' },
    ],
  },
  {
    number: 6,
    title: 'Kontrolisan razvoj uz AI',
    summary: 'Projektne instrukcije, evidencija odluka, ponovljive procedure i jasno razdvojene uloge u AI razvojnom toku.',
    zip: 'vezba-6-ai-workflow.zip',
    entries: [
      { path: '.ai/AI_INSTRUCTIONS.md', note: 'Projektna pravila za AI razvoj', kind: 'config' },
      { path: '.ai/AI_USAGE.md', note: 'Evidencija odluka i provera', kind: 'config' },
      { path: '.ai/skills/review-pull-request/SKILL.md', note: 'Procedura za pregled izmene', kind: 'config' },
      { path: '.ai/agents/architecture-reviewer.md', note: 'Uloga za proveru arhitekture', kind: 'config' },
      { path: '.ai/agents/implementer.md', note: 'Uloga za implementaciju zadatka', kind: 'config' },
    ],
  },
  {
    number: 7,
    title: 'MCP: povezivanje agenata sa projektom',
    summary: 'Kontrolisan pristup projektnoj dokumentaciji, strukturi izvornog koda, izmenama i rezultatima testova.',
    zip: 'vezba-7-mcp.zip',
    entries: [
      { path: 'src/EquipmentReservation.Mcp/Program.cs', note: 'Pokretanje i konfiguracija MCP servera', kind: 'code' },
      { path: 'src/EquipmentReservation.Mcp/ProjectPrimitives.cs', note: 'MCP resources i tools', kind: 'code' },
      { path: 'src/EquipmentReservation.Mcp/ProjectWorkspace.cs', note: 'Kontrolisan pristup projektu i dozvoljenim komandama', kind: 'code' },
      { path: '.ai/AI_INSTRUCTIONS.md', note: 'Projektna pravila dostupna kroz MCP resource', kind: 'config' },
    ],
  },
  {
    number: 8,
    title: 'Hooks, guardrails i evaluacije',
    summary: 'Zaštitna pravila za AI alate i evaluacioni scenariji za proveru arhitekture, bezbednosti i kvaliteta rezultata.',
    zip: 'vezba-8-guardrails-evals.zip',
    entries: [
      { path: 'src/EquipmentReservation.Guardrails/Guardrails.cs', note: 'Guardrail pravila i evaluator', kind: 'code' },
      { path: 'src/EquipmentReservation.Guardrails/Program.cs', note: 'Adapter za izvršavanje guardrail provera', kind: 'code' },
      { path: '.claude/settings.json', note: 'Primer povezivanja PreToolUse hook-a', kind: 'config' },
      { path: 'evals/review-architecture.json', note: 'Provera arhitektonske regresije', kind: 'eval' },
      { path: 'evals/prompt-injection.json', note: 'Scenario za prompt injection', kind: 'eval' },
      { path: 'evals/missing-context.json', note: 'Scenario sa nepotpunim kontekstom', kind: 'eval' },
      { path: 'tests/EquipmentReservation.Tests/ReservationTests.cs', note: 'Automatizovane guardrail provere', kind: 'test' },
    ],
  },
]

const kindLabels: Record<ExampleEntry['kind'], string> = {
  solution: 'SLN',
  code: 'kod',
  config: 'config',
  test: 'test',
  eval: 'eval',
}

function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 6.5h6l1.7 2H20a1.5 1.5 0 0 1 1.5 1.5v7.5A2.5 2.5 0 0 1 19 20H5a2.5 2.5 0 0 1-2.5-2.5V8a1.5 1.5 0 0 1 1-1.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function ExamplesView() {
  const zipUrl = publicAsset('/downloads/ers-ai-vezbe-5-8.zip')

  return (
    <main className="examples-shell">
      <section className="examples-hero">
        <div>
          <span className="eyebrow">Nastavni primeri</span>
          <h1>Primeri za vežbe</h1>
          <p>
            Primeri su organizovani po vežbama i namenjeni su praktičnom radu uz gradivo sa nastave.
            Svaki primer može da se preuzme zasebno, a primer za vežbe 5–8 dostupan je i kao kompletan paket.
          </p>
        </div>
      </section>

      <section className="examples-supplemental">
        <div className="examples-section-heading">
          <div>
            <span className="eyebrow">Primeri uz ranije vežbe</span>
            <h2>Dodatni primeri</h2>
          </div>
          <p>Svaki primer je pripremljen kao zaseban paket za rad.</p>
        </div>
        <div className="supplemental-grid">
          {supplementalExamples.map((example) => (
            <article className="supplemental-card" key={example.title}>
              <div className="supplemental-card-topline">
                <span className="supplemental-exercise">Vežba {example.exercise}</span>
                <span className="supplemental-format">ZIP</span>
              </div>
              <h3>{example.title}</h3>
              <p>{example.description}</p>
              <div className="supplemental-tags">
                {example.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className="supplemental-download" href={publicAsset(`/${example.zip}`)} download>
                <DownloadIcon />
                <span>Preuzmi primer</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="examples-card">
        <div className="examples-root-row">
          <span className="examples-folder-icon"><FolderIcon /></span>
          <div>
            <strong>EquipmentReservation</strong>
            <span>Primer koji se postepeno nadograđuje kroz vežbe 5–8</span>
          </div>
          <a href={zipUrl} download className="examples-small-download"><DownloadIcon /> Preuzmi komplet</a>
        </div>

        <div className="examples-tree" role="tree" aria-label="Primeri po vežbama">
          {lessons.map((lesson, index) => {
            const lessonZipUrl = publicAsset(`/downloads/${lesson.zip}`)
            return (
              <details className="examples-lesson" key={lesson.number} open={index === 0}>
                <summary>
                  <span className="tree-branch" aria-hidden="true" />
                  <span className="examples-folder-icon small"><FolderIcon /></span>
                  <span className="lesson-copy">
                    <strong>Vežba {lesson.number}</strong>
                    <span>{lesson.title}</span>
                  </span>
                  <span className="lesson-count">{lesson.entries.length} stavki</span>
                </summary>
                <a className="lesson-download" href={lessonZipUrl} download onClick={(event) => event.stopPropagation()}>
                  <DownloadIcon />
                  <span>Preuzmi</span>
                </a>
                <div className="lesson-body">
                  <div className="lesson-body-heading">
                    <p>{lesson.summary}</p>
                    <a href={lessonZipUrl} download className="lesson-download-secondary"><DownloadIcon /> Preuzmi vežbu {lesson.number}</a>
                  </div>
                  <ul className="example-file-list">
                    {lesson.entries.map((entry) => (
                      <li key={`${lesson.number}-${entry.path}`}>
                        <span className={`example-kind kind-${entry.kind}`}>{kindLabels[entry.kind]}</span>
                        <code>{entry.path}</code>
                        <span>{entry.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )
          })}
        </div>
      </section>

      <section className="examples-footer-note">
        <strong>Preuzimanje i rad</strong>
        <span>Pojedinačni paket sadrži kompletan projekat i kratak vodič za konkretnu vežbu. Kompletan paket objedinjuje materijal za vežbe 5–8.</span>
      </section>
    </main>
  )
}

export default function ExamplesEnhancer() {
  const [targets, setTargets] = useState<PortalTargets | null>(null)
  const [active, setActive] = useState(() => window.location.hash.startsWith('#ers/primeri'))

  useEffect(() => {
    const syncTargets = () => {
      const isErs = window.location.hash.startsWith('#ers')
      const nav = document.querySelector<HTMLElement>('.site-header .document-switcher')
      const panel = document.querySelector<HTMLElement>('.site-shell .tab-panel')

      if (!isErs || !nav || !panel) {
        setTargets(null)
        setActive(false)
        return
      }

      setTargets((current) => current?.nav === nav && current.panel === panel ? current : { nav, panel })
      if (window.location.hash.startsWith('#ers/primeri')) setActive(true)
    }

    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, { childList: true, subtree: true })

    const handleDocumentClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null
      const navButton = element?.closest('.document-switcher button')
      if (navButton && !navButton.classList.contains('examples-tab-button')) setActive(false)
    }

    const handleLocationChange = () => {
      setActive(window.location.hash.startsWith('#ers/primeri'))
      syncTargets()
    }

    document.addEventListener('click', handleDocumentClick)
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleDocumentClick)
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    if (!targets) return
    targets.panel.classList.toggle('examples-tab-active', active)
    if (active) document.title = 'ERS — Primeri'
    return () => targets.panel.classList.remove('examples-tab-active')
  }, [active, targets])

  const button = useMemo(() => (
    <button
      className={`examples-tab-button ${active ? 'active' : ''}`}
      onClick={() => {
        setActive(true)
        history.replaceState(null, '', '#ers/primeri')
        document.title = 'ERS — Primeri'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 6.5h6l1.6 2H20v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Primeri</span>
    </button>
  ), [active])

  if (!targets) return null

  return (
    <>
      {createPortal(button, targets.nav)}
      {active && createPortal(<ExamplesView />, targets.panel)}
    </>
  )
}
