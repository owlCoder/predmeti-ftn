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

const lessons: LessonExamples[] = [
  {
    number: 5,
    title: 'Integracija modula, ugovori i podaci',
    summary: 'Clean Architecture osnova: domen, use-case, portovi, adapteri, composition root i idempotentnost.',
    zip: 'vezba-5-integracija-modula.zip',
    entries: [
      { path: 'EquipmentReservation.sln', note: 'Glavni solution za ceo primer', kind: 'solution' },
      { path: 'src/EquipmentReservation.Domain/', note: 'Entiteti i poslovna pravila', kind: 'code' },
      { path: 'src/EquipmentReservation.Application/', note: 'Use-case i portovi prema spoljnim modulima', kind: 'code' },
      { path: 'src/EquipmentReservation.Infrastructure/', note: 'Implementacije portova / adapteri', kind: 'code' },
      { path: 'src/EquipmentReservation.Api/', note: 'Composition root i HTTP granica', kind: 'code' },
      { path: 'tests/EquipmentReservation.Tests/ReservationTests.cs', note: 'Domen i idempotentnost', kind: 'test' },
    ],
  },
  {
    number: 6,
    title: 'Kontrolisan razvoj uz AI',
    summary: 'Stabilne instrukcije, trag korišćenja, ponovljiva procedura i odvojene agentske uloge.',
    zip: 'vezba-6-ai-workflow.zip',
    entries: [
      { path: '.ai/AI_INSTRUCTIONS.md', note: 'Projektna pravila za AI razvoj', kind: 'config' },
      { path: '.ai/AI_USAGE.md', note: 'Evidencija odluka i provere', kind: 'config' },
      { path: '.ai/skills/review-pull-request/SKILL.md', note: 'Ponovljiva procedura za pregled PR-a', kind: 'config' },
      { path: '.ai/agents/architecture-reviewer.md', note: 'Read-only arhitektonska analiza', kind: 'config' },
      { path: '.ai/agents/implementer.md', note: 'Implementaciona uloga sa ograničenim zadatkom', kind: 'config' },
    ],
  },
  {
    number: 7,
    title: 'MCP: povezivanje agenata sa projektom',
    summary: 'Kontrolisan pristup projektnoj dokumentaciji, strukturi, diff-u i stvarnom rezultatu testova.',
    zip: 'vezba-7-mcp.zip',
    entries: [
      { path: 'src/EquipmentReservation.Mcp/Program.cs', note: 'MCP host i composition root', kind: 'code' },
      { path: 'src/EquipmentReservation.Mcp/ProjectPrimitives.cs', note: 'Resources i tools', kind: 'code' },
      { path: 'src/EquipmentReservation.Mcp/ProjectWorkspace.cs', note: 'Ograničena radna putanja i fiksne komande', kind: 'code' },
      { path: '.ai/AI_INSTRUCTIONS.md', note: 'Resurs project://instructions', kind: 'config' },
    ],
  },
  {
    number: 8,
    title: 'Hooks, guardrails i evaluacije',
    summary: 'Determinističke zabrane oko agentskog toka i evaluacioni scenariji za regresiju i bezbednost.',
    zip: 'vezba-8-guardrails-evals.zip',
    entries: [
      { path: 'src/EquipmentReservation.Guardrails/Guardrails.cs', note: 'IToolGuardrail politike i evaluator', kind: 'code' },
      { path: 'src/EquipmentReservation.Guardrails/Program.cs', note: 'Izvršivi hook adapter', kind: 'code' },
      { path: '.claude/settings.json', note: 'Primer PreToolUse povezivanja', kind: 'config' },
      { path: 'evals/review-architecture.json', note: 'Arhitektonska regresija', kind: 'eval' },
      { path: 'evals/prompt-injection.json', note: 'Prompt-injection scenario', kind: 'eval' },
      { path: 'evals/missing-context.json', note: 'Nepotpun kontekst', kind: 'eval' },
      { path: 'tests/EquipmentReservation.Tests/ReservationTests.cs', note: 'Izvršive guardrail provere', kind: 'test' },
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
          <span className="eyebrow">Izvršivi nastavni primer</span>
          <h1>Primeri za vežbe</h1>
          <p>
            Vežbe 5–8 koriste isti <strong>EquipmentReservation</strong> projekat. Možeš preuzeti ceo paket ili
            poseban samostalni ZIP za bilo koju vežbu, bez traženja kroz ceo praktikum.
          </p>
        </div>
        <a className="examples-download-primary" href={zipUrl} download>
          <DownloadIcon />
          <span><strong>Preuzmi sve primere</strong><small>ZIP · V5–V8 · uključuje EquipmentReservation.sln</small></span>
        </a>
      </section>

      <section className="examples-card">
        <div className="examples-root-row">
          <span className="examples-folder-icon"><FolderIcon /></span>
          <div>
            <strong>EquipmentReservation</strong>
            <span>Jedan solution koji se nadograđuje kroz četiri vežbe</span>
          </div>
          <a href={zipUrl} download className="examples-small-download"><DownloadIcon /> Svi ZIP</a>
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
                  <span>ZIP V{lesson.number}</span>
                </a>
                <div className="lesson-body">
                  <div className="lesson-body-heading">
                    <p>{lesson.summary}</p>
                    <a href={lessonZipUrl} download className="lesson-download-secondary"><DownloadIcon /> Preuzmi Vežbu {lesson.number}</a>
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
        <strong>Kako koristiti primer</strong>
        <span>Svaki pojedinačni ZIP sadrži ceo <code>EquipmentReservation.sln</code> i <code>LEKCIJA.md</code> sa fokusom te vežbe. Za kompletan kurs koristi „Preuzmi sve primere“.</span>
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
