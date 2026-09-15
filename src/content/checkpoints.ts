export type Checkpoint = {
  id: string
  code: string
  title: string
  exercise: string
  date: string
  summary: string
  items: string[]
}

export const checkpoints: Checkpoint[] = [
  {
    id: 'p1',
    code: 'P1',
    title: 'Problem, backlog i razvojni tok',
    exercise: 'Vežba 1–2',
    date: '12.10.',
    summary:
      'Ne očekuje se završena arhitektura ni veliki obim implementacije. Tim treba da pokaže da razume problem, da rad može da se planira kroz proverljive stavke i da repozitorijum već predstavlja stvarni trag zajedničkog razvoja.',
    items: [
      'Zajednički repozitorijum sa README dokumentom i pristupom svih članova tima.',
      'Tapiz Boards sadrži backlog sa prioritetima i proverljivim kriterijumima prihvatanja.',
      'Najmanje jedan pull request pokazuje pregled diff-a i smislen razgovor o promeni.',
      'Tim koristi dogovoreni tok Backlog → In Progress → Code Review → Done.',
    ],
  },
  {
    id: 'p2',
    code: 'P2',
    title: 'Arhitektura i funkcionalno jezgro',
    exercise: 'Vežba 2–3',
    date: '26.10.',
    summary:
      'Tim treba da pokaže jasne arhitektonske granice i najmanje jedan koherentan use-case čije je ponašanje moguće objasniti od zahteva do rezultata, bez mešanja poslovne logike i infrastrukture.',
    items: [
      'Dokumentovana odgovornost svakog sloja i dozvoljeni smer zavisnosti.',
      'Implementiran najmanje jedan vertikalni prolaz kroz sistem, od zahteva do rezultata.',
      'Za očekivane neuspehe definisani stabilni kodovi ili tipovi rezultata, bez generičkih izuzetaka.',
      'Domain/Application sloj može da se testira bez pokretanja realne baze ili UI-ja.',
    ],
  },
  {
    id: 'p3',
    code: 'P3',
    title: 'Testiranje i manual-core-baseline',
    exercise: 'Vežba 4',
    date: '16.11.',
    summary:
      'Ova kontrolna tačka razdvaja dve faze kursa. Do nje tim samostalno projektuje jezgro sistema i osnovne testove; nakon toga AI dobija veću ulogu, ali sistem već ima dovoljno testova da se svaki predlog nezavisno proveri.',
    items: [
      'Ključni use-case-ovi imaju testove za uspešne i negativne scenarije.',
      'Izveštaj o pokrivenosti je pregledan i najmanje jedna rizična grana je obrazložena ili dodatno pokrivena.',
      'Najmanje jedan bug je najpre reprodukovan testom, a zatim ispravljen.',
      'Stabilna verzija jezgra je označena Git tag-om `manual-core-baseline`.',
    ],
  },
  {
    id: 'p4',
    code: 'P4',
    title: 'AI/agentski tok i završna odbrana',
    exercise: 'Vežba 6–8',
    date: '07.12.',
    summary:
      'Završni rezultat kursa nije projekat čiju implementaciju tim ne razume, već sistem čiji svaki član ume da objasni zahteve, arhitekturu, testove i način na koji je AI podrška uključena i proverena.',
    items: [
      '`AI_INSTRUCTIONS.md` i `AI_USAGE.md` sadrže projektna pravila i reprezentativne zapise odluka.',
      'Najmanje dve ponovljive procedure ili agentske uloge imaju jasan ulaz, izlaz i ograničenja.',
      'Postoje najmanje tri evaluaciona scenarija, uključujući negativan slučaj.',
      'Na odbrani svaki član tima objašnjava svoj deo bez oslanjanja na automatski generisan odgovor.',
    ],
  },
]
