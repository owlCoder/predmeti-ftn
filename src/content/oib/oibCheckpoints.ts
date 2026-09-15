import type { Checkpoint } from '../checkpoints'

export const oibCheckpoints: Checkpoint[] = [
  {
    id: 'oib-p1',
    code: 'P1',
    title: 'Identitet, uloge i autorizacija',
    exercise: 'Vežba 1–2',
    date: '12.10.',
    summary:
      'Ne očekuje se završen bezbednosni model. Tim treba da pokaže da razume ko su subjekti sistema (identiteti, uloge), da autentikovan korisnik ne dobija automatski pristup svakom resursu, i da backlog prati proverljive bezbednosne zahteve.',
    items: [
      'Zajednički repozitorijum sa README dokumentom i dodeljenom projektnom celinom.',
      'Osnovna autentikacija i RBAC su implementirani; pristup se proverava serverski, ne samo u UI-ju.',
      'Najmanje jedan negativan test: pokušaj pristupa tuđem resursu vraća odbijen pristup bez curenja podataka.',
      'Audit log beleži uspešan i neuspešan pokušaj pristupa sa jasnim actor/action/target poljima.',
    ],
  },
  {
    id: 'oib-p2',
    code: 'P2',
    title: 'Politike, klasifikacija i baseline',
    exercise: 'Vežba 2–3',
    date: '26.10.',
    summary:
      'Tim treba da pokaže da bezbednosna pravila nisu razbacana ad-hoc kroz kod, već postoje kao eksplicitan katalog povezan sa konkretnim resursima, klasifikacijom podataka i očekivanom konfiguracijom.',
    items: [
      'Security policy katalog podržava verzionisanje bez menjanja već objavljene verzije.',
      'Klasifikacija podataka je dodeljena najmanje jednom tipu resursa i utiče na dozvoljeno rukovanje.',
      'Secure configuration baseline detektuje odstupanje od očekivane konfiguracije.',
      'Tim ume da objasni koje pravilo prioriteta važi kada su dve politike u konfliktu.',
    ],
  },
  {
    id: 'oib-p3',
    code: 'P3',
    title: 'Testiranje i manual-core-baseline',
    exercise: 'Vežba 4',
    date: '16.11.',
    summary:
      'Ova kontrolna tačka zaokružuje osnovni nivo sistema i razdvaja dve faze kursa. Sistem već poseduje dovoljno testova i strukture da se svaki naredni AI predlog može nezavisno proveriti.',
    items: [
      'Asset inventory evidentira kritičnost i vlasnika za svaki registrovan resurs.',
      'Ključni bezbednosni use-case-ovi imaju testove za uspešne i negativne scenarije.',
      'Izveštaj o pokrivenosti je pregledan; najmanje jedna rizična grana je obrazložena ili pokrivena testom.',
      'Stabilna verzija jezgra je označena Git tag-om `manual-core-baseline`.',
    ],
  },
  {
    id: 'oib-p4',
    code: 'P4',
    title: 'Operativna i napredna bezbednost — završna odbrana',
    exercise: 'Vežba 5–8',
    date: '07.12.',
    summary:
      'Završni rezultat kursa nije sistem čiju bezbednosnu logiku tim ne razume, već platforma čiji svaki član ume da objasni asset, pretnju, kontrolu, test i preostali rizik za dodeljenu projektnu celinu.',
    items: [
      'Dodatna potvrda identiteta (MFA/step-up) i vremenski ograničen privilegovan pristup su implementirani za rizične operacije.',
      'Detection pravilo i incident tok pokazuju ceo lanac: događaj → alert → incident → zatvaranje.',
      'Postoje najmanje tri evaluaciona/bezbednosna scenarija, uključujući negativni ili abuse-case.',
      'Na odbrani svaki član tima objašnjava threat model, kontrolu i test svoje celine bez oslanjanja na automatski generisan odgovor.',
    ],
  },
]
