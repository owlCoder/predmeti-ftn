import type { Block, CourseDocument, DocumentPage } from '../../types'
import { odpThematicExercises } from './odpThematicExercises'
import { odpCheckpoints } from './odpCheckpoints'
import { reflowPages } from '../contentLayout'
import { text, list, callout, table, page } from '../canvaPracticumShared'

let metaSequence = 0
const id = (prefix: string) => `odp-praktikum-${prefix}-${String(++metaSequence).padStart(3, '0')}`

const institution = (): Block => ({
  id: id('institution'),
  type: 'institution',
  university: 'Univerzitet u Novom Sadu',
  faculty: 'Fakultet tehničkih nauka',
  department: 'Primenjeno softversko inženjerstvo · 2026/2027',
  leftLogoSrc: '/brand/university.svg',
  rightLogoSrc: '/brand/ftn.svg',
})

const cover = (): DocumentPage => ({
  id: id('page'),
  label: 'Naslovna',
  layout: 'cover',
  blocks: [
    institution(),
    { id: id('title'), type: 'text', variant: 'title', html: 'Praktikum iz predmeta Osnove distribuiranog programiranja', align: 'center' },
    { id: id('subtitle'), type: 'text', variant: 'subtitle', html: 'Studijska 2026/2027. godina', align: 'center' },
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Radni materijal za vežbe, samostalno ponavljanje i sistematsko razumevanje distribuiranih sistema.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Univerzitet u Novom Sadu · Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const introPages = (): DocumentPage[] => [
  page('0.1. Kako koristiti praktikum', [
    text('h1', '0.1. Kako koristiti praktikum'),
    text('paragraph', 'Praktikum je samostalan materijal za razumevanje distribuiranih sistema. Svaka vežba objašnjava problem koji raspodela sistema uvodi, razlog zbog kog je izabrani princip važan, tipične greške i način na koji se odluka proverava u razvoju softvera. Cilj je da student nakon vežbe može samostalno da obnovi princip i primeni ga na dodeljenoj projektnoj celini, a ne da zapamti jedan konkretan primer.'),
    callout('info', 'Od metode do projekta', 'Praktikum ne daje gotovo distribuirano rešenje za projekat. Svaki tim dobija dodeljenu projektnu celinu (npr. telemetriju, komande, koordinaciju ili replikaciju) i princip sa vežbe primenjuje na sopstveni domen, uz obrazloženje odluke na projektnoj kontrolnoj tački.'),
    table(['Faza', 'Preporučeni način rada'], [
      ['Pre vežbe', 'Pročitati temu i označiti pretpostavke koje mreža, vreme ili više instanci mogu da pokvare.'],
      ['Tokom vežbe', 'Pratiti razlog odluke i njen trade-off, a ne samo konačni oblik implementacije.'],
      ['Posle vežbe', 'Povezati princip sa konkretnim distribuiranim scenarijem i objasniti dokaz kroz test ili kontrolisani failure scenario.'],
      ['Pred odbranu', 'Objasniti granicu odgovornosti, neizvestan ishod i razlog zbog kog sistem na njega reaguje baš tako.'],
    ]),
    callout('info', 'Simulatori umesto realne opreme', 'Praktikum ne zahteva realnu orbitalnu mehaniku, radio opremu ni pravu satelitsku komunikaciju. Udaljeni uređaji, mreža i failure situacije reprodukuju se kontrolisanim, ponovljivim simulatorima.'),
    callout('note', 'Jezik i alati', 'Primeri su pretežno u C#/.NET okruženju. Druga tehnologija može biti odobrena kada tim obezbedi interoperabilnost i ekvivalentan nivo testiranja i failure pokrivenosti.'),
  ]),
  page('0.2. Tok gradiva', [
    text('h1', '0.2. Tok gradiva'),
    text('paragraph', 'Osam vežbi prati tok razmišljanja potreban za distribuirani sistem: najpre vlasništvo i granice, zatim ugovori i vidljivost, potom rad sa porukama, komande i prekidi veze, a na kraju koordinacija, opterećenje i konzistentnost. Redosled gradi mentalni model distribuiranog ponašanja.'),
    list([
      'Vlasništvo i granice: poslovni entiteti, čvorovi i neizvesnost mreže.',
      'Ugovori i vidljivost: poruke, simulatori, korelacija i konfiguracija.',
      'Pouzdani tokovi: podaci, komande, poslovi, retry i idempotentnost.',
      'Rad pod pritiskom: prekidi veze, koordinacija, backpressure i zastareli prikazi.',
    ]),
  ]),
]

const checkpointBlocks = (checkpoint: (typeof odpCheckpoints)[number]): Block[] => [
  text('h2', `${checkpoint.code} — ${checkpoint.title}`),
  callout('note', 'Kontrolna tačka', 'Ova tačka zaokružuje prethodne teme. Organizacioni detalji i zahtevi nalaze se u posebnom odeljku kontrolnih tačaka.'),
]

const PAGES_PER_TOPIC = 8
const CHECKPOINT_AFTER_TOPIC = [2, 4, 4, 8]

function appendCheckpoints(pages: DocumentPage[]) {
  const checkpointsByPageIndex = new Map<number, typeof odpCheckpoints>()
  CHECKPOINT_AFTER_TOPIC.forEach((topicNumber, checkpointIndex) => {
    const pageIndex = topicNumber * PAGES_PER_TOPIC - 1
    const existing = checkpointsByPageIndex.get(pageIndex) ?? []
    checkpointsByPageIndex.set(pageIndex, [...existing, odpCheckpoints[checkpointIndex]])
  })
  return pages.map((item, index) => {
    const checkpointsHere = checkpointsByPageIndex.get(index)
    return checkpointsHere ? { ...item, blocks: [...item.blocks, ...checkpointsHere.flatMap(checkpointBlocks)] } : item
  })
}

const summaryPages = (): DocumentPage[] => [
  page('Sažetak: distribuiran sistem kao objašnjiv, testiran proces', [
    text('h1', 'Sažetak: distribuiran sistem kao objašnjiv, testiran proces'),
    text('paragraph', 'Kroz osam vežbi gradi se jedan konzistentan lanac: entitet i vlasništvo → ugovor → distribuirana operacija → failure/recovery scenario → test → evidencija. Taj lanac ostaje isti bez obzira na to da li se radi o osnovnom heartbeat mehanizmu, command dispatch-u ili naprednom regionalnom failover-u — menja se samo nivo sistema na kome se primenjuje.'),
    table(['Nivo', 'Šta uvodi'], [
      ['R1 — osnovni', 'Misije, stanice, node-ovi, ugovori, identitet, audit, observability.'],
      ['R2 — operativni', 'Telemetrija, komande, jobs, messaging, lease, DLQ, reconnect.'],
      ['R3 — napredni', 'Coordination, failover, replikacija, backpressure, eventual consistency.'],
    ]),
    callout('success', 'Odgovornost ostaje kod studenta', 'Automatizacija i AI podrška mogu ubrzati implementaciju, ali tim mora razumeti distribuirani model, objasniti trade-off odabrane strategije i pokazati nezavisan dokaz da failure/recovery ponašanje zaista radi.'),
  ]),
]

const literaturePages = (): DocumentPage[] => [
  page('Preporučena literatura i dokumentacija', [
    text('h1', 'Preporučena literatura i dokumentacija'),
    text('paragraph', 'Literatura služi za produbljivanje tema iz praktikuma. Preporuka je da se čita uz konkretan distribuirani scenario, jer se principi najbrže usvajaju kada student može da poveže definiciju sa failure scenarijem, testom ili observability zapisom.'),
    list([
      'Martin Kleppmann — <i>Designing Data-Intensive Applications</i>.',
      'Chris Richardson — <i>Microservices Patterns</i> (Saga, Outbox, Transactional messaging).',
      'Google SRE Book — <i>Site Reliability Engineering</i>: <a href="https://sre.google/books/">sre.google/books</a>.',
      'Microsoft Learn — Cloud Design Patterns (Retry, Circuit Breaker, Competing Consumers): <a href="https://learn.microsoft.com/azure/architecture/patterns/">learn.microsoft.com/azure/architecture/patterns</a>.',
      'NUnit dokumentacija: <a href="https://docs.nunit.org">docs.nunit.org</a>; Moq dokumentacija: <a href="https://github.com/devlooped/moq">github.com/devlooped/moq</a>.',
      'Pat Helland — <i>Life beyond Distributed Transactions</i> (rad o idempotenciji i outbox obrascu).',
      'Leslie Lamport — <i>Time, Clocks, and the Ordering of Events in a Distributed System</i> (osnova za temu logičkog vremena i redosleda događaja).',
    ]),
    callout('note', 'Napomena o alatima', 'Konkretni message broker-i, orkestratori i cloud platforme menjaju se brže od osnovnih distribuiranih principa. Simulatori korišćeni u praktikumu oponašaju njihovo ponašanje radi vežbe — ne predstavljaju se kao realni proizvodi.'),
  ]),
]

const chapter = (pages: DocumentPage[], name: string) => reflowPages(pages, name)

function plain(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

function pageContainsHeading(page: DocumentPage, needle: string) {
  return page.blocks.some((item) => item.type === 'text' && ['h1', 'h2'].includes(item.variant) && plain(item.html).startsWith(needle))
}

function contentsPage(body: DocumentPage[]): DocumentPage {
  const exerciseNumbers = Array.from({ length: 8 }, (_, index) => index + 1)
  const wanted = [
    ['Uvod i način rada', '0.1. Kako koristiti praktikum'],
    ['Tok gradiva', '0.2. Tok gradiva'],
    ['Vežba 1', 'Vežba 1'],
    ['Vežba 2', 'Vežba 2'],
    ['P1 — Osnovni entiteti, ugovori i simulator', 'P1 — Osnovni'],
    ['Vežba 3', 'Vežba 3'],
    ['Vežba 4', 'Vežba 4'],
    ['P2 — Identitet, audit, observability i konfiguracija', 'P2 — Identitet'],
    ['P3 — Testiranje i manual-core-baseline', 'P3 — Testiranje'],
    ['Vežba 5', 'Vežba 5'],
    ['Vežba 6', 'Vežba 6'],
    ['Vežba 7', 'Vežba 7'],
    ['Vežba 8', 'Vežba 8'],
    ['P4 — Završna odbrana', 'P4 — Operativni'],
    ['Sažetak', 'Sažetak: distribuiran sistem'],
    ['Literatura i dokumentacija', 'Preporučena literatura'],
  ] as Array<[string, string]>

  const rows = wanted.map(([label, needle]) => {
    const index = body.findIndex((item) => pageContainsHeading(item, needle))
    if (index < 0) return [label, '—']
    const target = body[index]
    const pageNumber = index + 3
    return [`<a class="toc-link" href="#page-${target.id}">${label}</a>`, String(pageNumber)]
  })

  return page('Sadržaj', [
    text('h1', 'Sadržaj'),
    text('paragraph', 'Pregled oblasti i početnih strana. Naslovi u elektronskoj verziji vode direktno na odgovarajuće poglavlje.'),
    table(['Oblast', 'Strana'], rows),
  ])
}

const exercisePages = appendCheckpoints(odpThematicExercises())

const bodyPages = [
  ...chapter(introPages(), 'Uvod'),
  ...chapter(exercisePages, 'Vežbe'),
  ...chapter(summaryPages(), 'Zaključak'),
  ...chapter(literaturePages(), 'Literatura'),
]

export const odpPracticum2026: CourseDocument = {
  version: 1,
  id: 'odp-praktikum-2026-27-current',
  title: 'Praktikum 2026/27',
  subtitle: 'Osnove distribuiranog programiranja',
  subject: 'Osnove distribuiranog programiranja',
  kind: 'praktikum',
  headerText: 'Osnove distribuiranog programiranja',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-09-15T12:00:00.000Z',
  updatedAt: '2026-09-15T12:00:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'emerald', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), contentsPage(bodyPages), ...bodyPages],
}
