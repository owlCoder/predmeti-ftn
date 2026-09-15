import type { Block, CourseDocument, DocumentPage } from '../../types'
import { oibThematicExercises } from './oibThematicExercises'
import { oibCheckpoints } from './oibCheckpoints'
import { reflowPages } from '../contentLayout'
import { text, list, callout, table, page } from '../canvaPracticumShared'

let metaSequence = 0
const id = (prefix: string) => `oib-praktikum-${prefix}-${String(++metaSequence).padStart(3, '0')}`

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
    { id: id('title'), type: 'text', variant: 'title', html: 'Praktikum iz predmeta Osnove informacione bezbednosti', align: 'center' },
    { id: id('subtitle'), type: 'text', variant: 'subtitle', html: 'Studijska 2026/2027. godina', align: 'center' },
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Radni materijal za vežbe, samostalno ponavljanje i sistematsko razumevanje oblasti informacione bezbednosti.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Univerzitet u Novom Sadu · Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const introPages = (): DocumentPage[] => [
  page('0.1. Kako koristiti praktikum', [
    text('h1', '0.1. Kako koristiti praktikum'),
    text('paragraph', 'Praktikum je samostalan materijal za razumevanje informacione bezbednosti. Svaka vežba objašnjava temu kroz problem koji rešava, razloge zbog kojih je važna, tipične greške i način na koji se odluka prepoznaje u razvoju informacionih sistema. Cilj je da student nakon vežbe može samostalno da obnovi princip i primeni ga na dodeljenoj projektnoj celini, a ne da zapamti jedan konkretan primer.'),
    callout('info', 'Od metode do projekta', 'Praktikum ne daje gotovo bezbednosno rešenje za projekat. Svaki tim dobija dodeljenu projektnu celinu (npr. identitet, autorizaciju, audit ili detekciju) i princip sa vežbe primenjuje na sopstveni domen, uz obrazloženje odluke na projektnoj kontrolnoj tački.'),
    table(['Faza', 'Preporučeni način rada'], [
      ['Pre vežbe', 'Pročitati temu i izdvojiti pretpostavke koje bi u informacionom sistemu mogle biti pogrešne.'],
      ['Tokom vežbe', 'Povezati pojam sa njegovom posledicom u realnom razvoju, a ne samo sa nazivom klase ili endpointa.'],
      ['Posle vežbe', 'Povezati princip sa primerom sistema i objasniti dokaz kroz test, odluku ili audit trag.'],
      ['Pred odbranu', 'Objasniti problem, izabranu kontrolu, njeno ograničenje i način na koji je ponašanje provereno.'],
    ]),
    callout('info', 'Defanzivna orijentacija', 'Praktikum ne zahteva razvoj eksploita, malvera ni napad na realne sisteme. Sumnjiva aktivnost, greška konfiguracije ili pokušaj nedozvoljenog pristupa reprodukuju se kontrolisanim simulatorima i testnim identitetima.'),
    callout('note', 'Jezik i alati', 'Primeri su pretežno u C#/.NET okruženju. Druga tehnologija može biti odobrena kada tim obezbedi interoperabilnost i ekvivalentan nivo testiranja i bezbednosne kontrole.'),
  ]),
  page('0.2. Tok gradiva', [
    text('h1', '0.2. Tok gradiva'),
    text('paragraph', 'Osam vežbi prati prirodan tok bezbednosnog razmišljanja: od identiteta i odluke o pristupu, preko podataka, pravila i granica poverenja, do operativne reakcije, procene rizika i unapređivanja kontrola. Redosled pomaže da se kasnije teme oslone na već razumljive pojmove.'),
    list([
      'Identitet i RBAC: ko pristupa sistemu, sa kojim pravom i zašto.',
      'Autorizacija i podaci: odluka nad konkretnim resursom i osetljivost informacije.',
      'Politike i granice poverenja: pravila, konfiguracija, imovina i threat modeling.',
      'Operativna bezbednost: sesije, MFA, tajne, detekcija i incident.',
      'Napredne odluke: kontekstualna pravila, rizik, korelacija i dokaz efektivnosti.',
    ]),
  ]),
]

const checkpointBlocks = (checkpoint: (typeof oibCheckpoints)[number]): Block[] => [
  text('h2', `${checkpoint.code} — ${checkpoint.title}`),
  callout('note', 'Kontrolna tačka', 'Ova tačka zaokružuje prethodne teme. Organizacioni detalji i zahtevi nalaze se u posebnom odeljku kontrolnih tačaka.'),
]

const PAGES_PER_TOPIC = 9
const CHECKPOINT_AFTER_TOPIC = [2, 3, 4, 8]

function appendCheckpoints(pages: DocumentPage[]) {
  const endOfExercisePair = new Map(
    CHECKPOINT_AFTER_TOPIC.map((topicNumber, checkpointIndex) => [topicNumber * PAGES_PER_TOPIC - 1, oibCheckpoints[checkpointIndex]]),
  )
  return pages.map((item, index) => {
    const checkpoint = endOfExercisePair.get(index)
    return checkpoint ? { ...item, blocks: [...item.blocks, ...checkpointBlocks(checkpoint)] } : item
  })
}

const summaryPages = (): DocumentPage[] => [
  page('Sažetak: bezbednost kao sledljiv, dokaziv proces', [
    text('h1', 'Sažetak: bezbednost kao sledljiv, dokaziv proces'),
    text('paragraph', 'Kroz osam vežbi gradi se jedan konzistentan lanac: Asset → Threat/misuse → Security Requirement → Control → Security Test → Evidence. Taj lanac ostaje isti bez obzira na to da li se radi o osnovnoj autentikaciji, privilegovanom pristupu ili naprednoj attack-path analitici — menja se samo nivo sistema na kome se primenjuje.'),
    table(['Nivo', 'Šta uvodi'], [
      ['R1 — osnovni', 'Identitet, resursi, klasifikacija, autorizacija, politike i audit.'],
      ['R2 — operativni', 'MFA, sesije, secrets, detekcija, incidenti, vulnerabilities.'],
      ['R3 — napredni', 'Policy engine, access review, risk, correlation, response automation.'],
    ]),
    callout('success', 'Odgovornost ostaje kod studenta', 'Analitika i automatizacija mogu ubrzati detekciju i odgovor, ali tim mora razumeti zahtev, objasniti bezbednosni model i pokazati nezavisan dokaz da je kontrola efektivna.'),
  ]),
]

const literaturePages = (): DocumentPage[] => [
  page('Preporučena literatura i dokumentacija', [
    text('h1', 'Preporučena literatura i dokumentacija'),
    text('paragraph', 'Literatura služi za produbljivanje tema iz praktikuma. Preporuka je da se čita uz konkretan primer informacionog sistema, jer se bezbednosni principi najbrže usvajaju kada student može da poveže definiciju sa threat modelom, testom ili audit zapisom.'),
    list([
      'OWASP — <i>Application Security Verification Standard (ASVS)</i> i <i>OWASP Top 10</i>: <a href="https://owasp.org">owasp.org</a>.',
      'NIST — <i>Digital Identity Guidelines (SP 800-63)</i>: <a href="https://pages.nist.gov/800-63-3/">pages.nist.gov/800-63-3</a>.',
      'NIST — <i>Zero Trust Architecture (SP 800-207)</i>: <a href="https://csrc.nist.gov/publications/detail/sp/800-207/final">csrc.nist.gov</a>.',
      'Adam Shostack — <i>Threat Modeling: Designing for Security</i>.',
      'NUnit dokumentacija: <a href="https://docs.nunit.org">docs.nunit.org</a>; Moq dokumentacija: <a href="https://github.com/devlooped/moq">github.com/devlooped/moq</a>.',
      'Microsoft Learn — ASP.NET Core Identity, autorizacija i bezbedna konfiguracija: <a href="https://learn.microsoft.com/aspnet/core/security/">learn.microsoft.com/aspnet/core/security</a>.',
      'MITRE ATT&CK — okvir za razumevanje taktika i tehnika (koristi se isključivo kao referentni rečnik, ne kao uputstvo za napad): <a href="https://attack.mitre.org">attack.mitre.org</a>.',
    ]),
    callout('note', 'Napomena o alatima', 'Konkretni bezbednosni alati (SIEM, IDS, PKI proizvodi) menjaju se brže od osnovnih principa. Simulatori korišćeni u praktikumu oponašaju njihovo ponašanje radi vežbe — ne predstavljaju se kao realni proizvodi.'),
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
    ['P1 — Identitet, uloge i autorizacija', 'P1 — Identitet'],
    ['Vežba 3', 'Vežba 3'],
    ['P2 — Politike, klasifikacija i baseline', 'P2 — Politike'],
    ['Vežba 4', 'Vežba 4'],
    ['P3 — Testiranje i manual-core-baseline', 'P3 — Testiranje'],
    ['Vežba 5', 'Vežba 5'],
    ['Vežba 6', 'Vežba 6'],
    ['Vežba 7', 'Vežba 7'],
    ['Vežba 8', 'Vežba 8'],
    ['P4 — Završna odbrana', 'P4 — Operativna'],
    ['Sažetak', 'Sažetak: bezbednost'],
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

const exercisePages = appendCheckpoints(oibThematicExercises())

const bodyPages = [
  ...chapter(introPages(), 'Uvod'),
  ...chapter(exercisePages, 'Vežbe'),
  ...chapter(summaryPages(), 'Zaključak'),
  ...chapter(literaturePages(), 'Literatura'),
]

export const oibPracticum2026: CourseDocument = {
  version: 1,
  id: 'oib-praktikum-2026-27-current',
  title: 'Praktikum 2026/27',
  subtitle: 'Osnove informacione bezbednosti',
  subject: 'Osnove informacione bezbednosti',
  kind: 'praktikum',
  headerText: 'Osnove informacione bezbednosti',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-09-15T12:00:00.000Z',
  updatedAt: '2026-09-15T12:00:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'rose', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), contentsPage(bodyPages), ...bodyPages],
}
