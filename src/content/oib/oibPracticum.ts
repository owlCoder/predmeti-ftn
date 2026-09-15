import type { Block, CourseDocument, DocumentPage } from '../../types'
import { oibExercise1 } from './oibExercise1'
import { oibExercise2 } from './oibExercise2'
import { oibExercise3 } from './oibExercise3'
import { oibExercise4 } from './oibExercise4'
import { oibExercise5 } from './oibExercise5'
import { oibExercise6 } from './oibExercise6'
import { oibExercise7 } from './oibExercise7'
import { oibExercise8 } from './oibExercise8'
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
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Radni materijal za vežbe, samostalno ponavljanje i kontinuiran razvoj projekta iz oblasti informacione bezbednosti.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Univerzitet u Novom Sadu · Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const introPages = (): DocumentPage[] => [
  page('0.1. Kako koristiti praktikum', [
    text('h1', '0.1. Kako koristiti praktikum'),
    text('paragraph', 'Praktikum prati jedan zajednički projekat — platformu za upravljanje informacionom bezbednošću i digitalnim poverenjem, koju svaki tim gradi kroz semestar. Svaka vežba sadrži teorijsko objašnjenje, konkretan primer, i zadatke koji povezuju gradivo sa dodeljenom projektnom celinom. Cilj je da student nakon časa ume da objasni ne samo šta je implementirao, već i koji je threat/misuse scenario razmatran, kojom kontrolom je ublažen i kako je to dokazano testom.'),
    table(['Faza', 'Preporučeni način rada'], [
      ['Pre vežbe', 'Pročitati uvodni deo oblasti i označiti pojmove koji zahtevaju dodatno razjašnjenje.'],
      ['Tokom vežbe', 'Pratiti demonstraciju i obrazloženje bezbednosnih odluka, ne samo konačan kod.'],
      ['Posle vežbe', 'Primeniti princip na dodeljenoj projektnoj celini i sačuvati sledljiv trag kroz commit, test i audit zapis.'],
      ['Pre projektne kontrolne tačke', 'Proći kontrolnu listu, proveriti testove i threat model. Svaki član tima treba da ume da obrazloži urađeno.'],
    ]),
    callout('info', 'Defanzivna orijentacija', 'Praktikum ne zahteva razvoj eksploita, malvera ni napad na realne sisteme. Sumnjiva aktivnost, greška konfiguracije ili pokušaj nedozvoljenog pristupa reprodukuju se kontrolisanim simulatorima i testnim identitetima.'),
    callout('note', 'Jezik i alati', 'Primeri su pretežno u C#/.NET okruženju. Druga tehnologija može biti odobrena kada tim obezbedi interoperabilnost i ekvivalentan nivo testiranja i bezbednosne kontrole.'),
  ]),
  page('0.2. Tok semestra i projekta', [
    text('h1', '0.2. Tok semestra i projekta'),
    text('paragraph', 'Praktikum je organizovan u osam povezanih vežbi koje prate tri razvojna nivoa projektnih celina. Prve četiri vežbe grade osnovni (R1) model — identitet, autorizaciju, politike i asset inventory — i zaokružuju se testiranom baznom linijom `manual-core-baseline`. Naredne dve vežbe uvode operativni (R2) nivo: MFA, sesije, privilegovan pristup i operativni bezbednosni ciklus od detekcije do incidenta. Poslednje dve vežbe uvode napredni (R3) nivo: policy engine, risk, threat modeling i naprednu analitiku.'),
    list([
      'P1 — organizacioni model, identitet, uloge i osnovna autentikacija.',
      'P2 — object-level autorizacija, klasifikacija podataka i neizbrisiv audit log.',
      'P3 — verzionisan policy katalog, secure configuration baseline i observability.',
      'P4 — zaokruživanje R1 nivoa (asset, crypto, exposure, retention) i Git tag `manual-core-baseline`.',
      'P5 — MFA/step-up autentikacija, sesije sa revocation i Just-in-Time privilegovan pristup.',
      'P6 — detekcija, alert triage, upravljanje incidentom i vulnerability registry.',
      'P7 — policy engine, risk register i sistematski threat modeling workflow.',
      'P8 — napredna analitika, kontrolisan odgovor i završna, objašnjiva odbrana projekta.',
    ]),
  ]),
]

const summaryPages = (): DocumentPage[] => [
  page('Sažetak: bezbednost kao sledljiv, dokaziv proces', [
    text('h1', 'Sažetak: bezbednost kao sledljiv, dokaziv proces'),
    text('paragraph', 'Kroz osam vežbi projekat gradi jedan konzistentan lanac: Asset → Threat/misuse → Security Requirement → Control → Security Test → Evidence. Taj lanac ostaje isti bez obzira na to da li se radi o osnovnoj autentikaciji, privilegovanom pristupu ili naprednoj attack-path analitici — menja se samo nivo sistema na kome se primenjuje.'),
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
    text('paragraph', 'Literatura služi za produbljivanje tema iz praktikuma. Preporuka je da se čita uz konkretan primer iz projektne celine, jer se bezbednosni principi najbrže usvajaju kada student može da poveže definiciju sa sopstvenim threat modelom, testom ili audit zapisom.'),
    list([
      'OWASP — <i>Application Security Verification Standard (ASVS)</i> i <i>OWASP Top 10</i>: <a href="https://owasp.org">owasp.org</a>.',
      'NIST — <i>Digital Identity Guidelines (SP 800-63)</i>: <a href="https://pages.nist.gov/800-63-3/">pages.nist.gov/800-63-3</a>.',
      'NIST — <i>Zero Trust Architecture (SP 800-207)</i>: <a href="https://csrc.nist.gov/publications/detail/sp/800-207/final">csrc.nist.gov</a>.',
      'Adam Shostack — <i>Threat Modeling: Designing for Security</i>.',
      'NUnit dokumentacija: <a href="https://docs.nunit.org">docs.nunit.org</a>; Moq projekat i dokumentacija: <a href="https://github.com/devlooped/moq">github.com/devlooped/moq</a>.',
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
    ['Tok semestra i projekta', '0.2. Tok semestra i projekta'],
    ...exerciseNumbers.map((number) => [`Vežba ${number}`, `Vežba ${number}`] as [string, string]),
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

const bodyPages = [
  ...chapter(introPages(), 'Uvod'),
  ...chapter(oibExercise1(), 'Vežba 1'),
  ...chapter(oibExercise2(), 'Vežba 2'),
  ...chapter(oibExercise3(), 'Vežba 3'),
  ...chapter(oibExercise4(), 'Vežba 4'),
  ...chapter(oibExercise5(), 'Vežba 5'),
  ...chapter(oibExercise6(), 'Vežba 6'),
  ...chapter(oibExercise7(), 'Vežba 7'),
  ...chapter(oibExercise8(), 'Vežba 8'),
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
