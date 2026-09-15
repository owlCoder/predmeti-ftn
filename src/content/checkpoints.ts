export type Checkpoint = {
  id: string
  code: string
  title: string
  exercise: string
  summary: string
  items: string[]
}

export const checkpoints: Checkpoint[] = [
  {
    id: 'p1',
    code: 'P1',
    title: 'Problem, backlog i razvojni tok',
    exercise: 'Vežba 1',
    summary:
      'Na prvoj kontrolnoj tački ne očekuje se završena arhitektura ni veliki obim implementacije. Potrebno je pokazati da tim razume problem, da rad može da se planira kroz proverljive stavke i da repozitorijum već predstavlja stvarni trag zajedničkog razvoja.',
    items: [
      'Postoji zajednički projektni repozitorijum sa početnim README dokumentom i odgovarajućim pristupom članova tima.',
      'Tapiz Boards sadrži početni backlog sa prioritetima i jasno izdvojenim stavkama spremnim za rad.',
      'Najmanje jedna stavka ima proverljive kriterijume prihvatanja i povezana je sa konkretnom granom ili pull request-om.',
      'Tim koristi dogovoreni tok Backlog → Ready → In Progress → Code Review → QA/Verify → Done.',
      'Najmanje jedan pull request pokazuje pregled diff-a, rezultat provere i smislen razgovor o promeni.',
      'Ako je AI alat korišćen pri analizi zahteva, tim može da objasni šta je prihvaćeno, šta je odbačeno i kako je rezultat proveravan.',
    ],
  },
  {
    id: 'p2',
    code: 'P2',
    title: 'Composition root i arhitektonske granice',
    exercise: 'Vežba 2',
    summary:
      'Composition root je mesto na kome se konkretne implementacije povezuju u izvršivi graf objekata. Do druge kontrolne tačke tim treba da pokaže barem jedan vertikalni prolaz kroz sistem sa jasnim granicama odgovornosti.',
    items: [
      'Kreirati solution i početne projekte ili slojeve bez unapred pripremljenog projektnog šablona.',
      'Dokumentovati odgovornost svakog sloja i dozvoljeni smer zavisnosti.',
      'Implementirati najmanje jedan mali vertikalni prolaz kroz sistem.',
      'U `docs/architecture.md` zapisati najmanje dve odluke i obrazloženje njihovog izbora.',
      'Proveriti da Domain/Application mogu da se testiraju bez pokretanja realne baze podataka ili korisničkog interfejsa.',
    ],
  },
  {
    id: 'p3',
    code: 'P3',
    title: 'Funkcionalno jezgro',
    exercise: 'Vežba 3',
    summary:
      'Do treće kontrolne tačke projekat treba da ima najmanje jedan koherentan use-case čije je ponašanje moguće objasniti od zahteva do poslovnog rezultata. Nije cilj da svi ekrani budu završeni; važnije je da je centralni tok pravilno modelovan.',
    items: [
      'Implementirati najmanje dva ključna use-case-a sa eksplicitnim ulazima i rezultatima.',
      'Poslovna pravila ne smeju biti raspoređena po controller-u, konzolnom meniju i repozitorijumu bez jasne granice odgovornosti.',
      'Za očekivane neuspehe definisati stabilne kodove ili tipove rezultata.',
      'Spoljne zavisnosti uvoditi kroz ugovore i composition root.',
      'U pull request-u opisati najmanje jednu arhitektonsku odluku koja je promenjena nakon implementacije i obrazložiti razlog promene.',
    ],
  },
  {
    id: 'p4',
    code: 'P4',
    title: 'Manual-core-baseline',
    exercise: 'Vežba 4',
    summary:
      'Ova kontrolna tačka razdvaja dve faze kursa. Do nje tim samostalno projektuje funkcionalno jezgro, arhitektonske granice i osnovne testove. Nakon toga AI dobija veću ulogu u radu sa kodom, ali sistem već poseduje dovoljno testova i strukture da se svaki predlog može nezavisno proveriti.',
    items: [
      'Ključni use-case-ovi imaju NUnit testove za uspešne i negativne scenarije.',
      'Moq se koristi samo za promenljive spoljne zavisnosti koje test treba da izoluje.',
      'Izveštaj o pokrivenosti je pregledan i najmanje jedna nepokrivena rizična grana je obrazložena ili pokrivena dodatnim testom.',
      'Najmanje jedan bug je najpre reprodukovan testom, a zatim ispravljen.',
      'Stabilna verzija jezgra označena je Git tag-om `manual-core-baseline`.',
    ],
  },
  {
    id: 'p5',
    code: 'P5',
    title: 'Instrukcije i proverljiv izlaz',
    exercise: 'Vežba 6 (AI Workflow)',
    summary:
      'Kontrolne tačke od ove nadalje traže da tim pokaže da AI podrška ima jasna pravila, ponovljive procedure i ograničene uloge.',
    items: [
      '`AI_INSTRUCTIONS.md` sadrži stabilna projektna pravila i ograničenja.',
      'Najmanje jedan zadatak koristi unapred definisan strukturirani oblik izlaza.',
      '`AI_USAGE.md` sadrži reprezentativne zapise sa odlukom tima i dokazom provere.',
      'Tim ume da objasni koje su sugestije prihvaćene, koje su odbačene i zbog čega.',
      'Rezultat AI alata se ne prihvata kao dokaz bez stvarnog razvojnog signala.',
    ],
  },
  {
    id: 'p6',
    code: 'P6',
    title: 'Procedure i agentski tok',
    exercise: 'Vežba 6 (AI Workflow)',
    summary:
      'Šesta kontrolna tačka proverava da tim ume da projektuje kontrolisan tok rada sa AI podrškom tako da su odgovornosti, dozvole, trag odluka i nezavisna provera jasno razdvojeni.',
    items: [
      'Najmanje dve ponovljive procedure imaju jasan ulaz, korake, izlaz i ograničenja.',
      'Najmanje dve agentske uloge imaju različite odgovornosti ili različite dozvole.',
      'Najmanje jedan stvarni projektni zadatak prolazi kroz dokumentovan tok predaje između uloga kada je takva podela opravdana.',
      'Tim je uporedio jednostavniji i složeniji tok rada i može da obrazloži izbor.',
      'Konačna odluka o prihvatanju promene ostaje na timu i zasniva se na proverljivim rezultatima.',
    ],
  },
  {
    id: 'p7',
    code: 'P7',
    title: 'MCP integracija',
    exercise: 'Vežba 7',
    summary:
      'MCP deo projekta treba da bude mali, razumljiv i demonstrabilan. Dovoljna su dva ili tri pažljivo izabrana resursa ili alata specifična za projekat koji uklanjaju ručno kopiranje i daju agentu proverljiv razvojni signal.',
    items: [
      'MCP server se nalazi u jasno izdvojenom delu repozitorijuma i ima uputstvo za pokretanje.',
      'Izložen je najmanje jedan resurs i najmanje dva alata, ili najmanje tri smisleno odabrane MCP funkcionalnosti.',
      'Najmanje jedan alat vraća razvojni signal: rezultat testa, git diff, strukturu projekta ili drugi proverljiv podatak.',
      'Agentski tok demonstrira korišćenje MCP-a umesto ponovljenog ručnog kopiranja istog konteksta.',
      'Dokumentovana su ograničenja, dozvoljene putanje i podaci koje server namerno ne izlaže.',
    ],
  },
  {
    id: 'p8',
    code: 'P8',
    title: 'Proverljiv razvoj uz podršku AI alata',
    exercise: 'Vežba 8 (završna)',
    summary:
      'Završni rezultat kursa nije projekat čiju implementaciju student ne razume, već softverski sistem čiji tim može da objasni zahteve, arhitekturu, testove i način na koji je AI uključen u razvoj. AI deo se vrednuje kroz dizajn toka rada, ograničenja, ponovljivost i način verifikacije.',
    items: [
      'Hook ili guardrail mehanizmi pokrivaju najmanje dve stvarne rizične ili obavezne provere.',
      'Postoje najmanje tri evaluaciona scenarija, uključujući negativni ili bezbednosni slučaj.',
      'Peer QA je zabeležen i relevantne sugestije su obrađene.',
      '`AI_USAGE.md` pokazuje reprezentativne sesije, odluke i proveru rezultata.',
      'Na odbrani svaki član tima može da objasni odabrani use-case i agentski tok bez oslanjanja na automatski generisan odgovor.',
    ],
  },
]
