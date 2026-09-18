import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exerciseAiWorkflow = (): DocumentPage[] => [
  page('Vežba 6 — Kontrolisan AI workflow nad istim solution-om', [
    text('h1', 'Vežba 6 — Kontrolisan razvoj uz AI: kontekst, instrukcije, procedure i agenti'),
    text('paragraph', 'AI se uvodi tek nakon što postoji razumljivo i testirano jezgro iz Vežbe 5. I dalje radimo nad <code>examples/ers-ai-workflow/EquipmentReservation.sln</code>. Cilj nije da AI zameni arhitekturu, nego da radi unutar njenih granica i da svaki rezultat ostane proverljiv standardnim razvojnim signalima.'),
    diagram('Kontrolisan tok nad EquipmentReservation solution-om', [
      ['Zadatak', 'jasan cilj i kriterijumi', 'slate'],
      ['Kontekst', 'relevantni projekti i testovi', 'cyan'],
      ['Instrukcije', '.ai/AI_INSTRUCTIONS.md', 'blue'],
      ['Skill / agent', 'ograničena procedura i dozvole', 'violet'],
      ['Provera', 'build, test i git diff', 'emerald'],
    ]),
  ]),

  page('6.1. Od nejasnog zahteva do proverljivog zadatka', [
    text('h2', '6.1. Od nejasnog zahteva do proverljivog zadatka'),
    text('paragraph', 'Umesto upita „sredi rezervacije“, zadatak treba da kaže koje ponašanje menjamo, koje slojeve ne smemo da narušimo i kako dokazujemo rezultat.'),
    code('markdown', `# Zadatak
Analiziraj promenu: jedna rezervacija ne sme tražiti više od 5 komada opreme.
Ne menjaj kod u ovoj fazi.

# Ograničenja
- Poslovno pravilo mora ostati u Domain/Application delu.
- API ne sme sadržati poslovnu odluku.
- IInventoryModule ugovor menjaj samo ako je zaista potrebno.
- Postojeći testovi moraju ostati uspešni.

# Vrati
1. pogođene fajlove i slojeve,
2. pretpostavke i rizike,
3. minimalni plan izmene,
4. test scenarije,
5. komande za proveru solution-a.`, 'Primer zadatka vezan za konkretan EquipmentReservation kod'),
    callout('note', 'Prvo analiza, zatim izmena', 'Veliki diff nastao iz nejasnog upita je teško pregledati. Plan se pregleda pre nego što agent dobije dozvolu za pisanje.'),
  ]),

  page('6.2. Projektne instrukcije su verzionisana pravila', [
    text('h2', '6.2. Projektne instrukcije su verzionisana pravila'),
    text('paragraph', 'Gotov primer sadrži <code>.ai/AI_INSTRUCTIONS.md</code>. Njegova pravila su konkretna za arhitekturu ovog solution-a i mogu se proveriti čitanjem project reference-a i pokretanjem testova.'),
    code('markdown', `## Arhitektura
- Domain ne zavisi ni od jednog drugog projekta.
- Application zavisi samo od Domain i definiše portove.
- Infrastructure implementira portove iz Application sloja.
- Api je composition root; ne sadrži poslovna pravila.
- MCP i guardrails su razvojni alati i ne smeju postati zavisnost poslovnog jezgra.

## Posle izmene
1. Pokreni ciljane testove.
2. Pokreni kompletan test projekat kada je praktično.
3. Pregledaj git diff i ukloni nepovezane izmene.
4. Ne tvrdi da je nešto provereno ako stvarna komanda nije izvršena.
5. Ne čitaj .env, tajne ili pristupne tokene.`, 'examples/ers-ai-workflow/.ai/AI_INSTRUCTIONS.md'),
    text('paragraph', '<code>.ai/AI_USAGE.md</code> čuva sažet trag: zadatak, korišćeni kontekst, predlog modela, odluku tima i nezavisan dokaz provere. Potpuni chat transcript nije zamena za inženjersku evidenciju.'),
  ]),

  page('6.3. Skill za ponovljiv pregled pull request-a', [
    text('h2', '6.3. Skill za ponovljiv pregled pull request-a'),
    text('paragraph', 'Procedura <code>.ai/skills/review-pull-request/SKILL.md</code> razdvaja review od implementacije. Isti postupak može da se primeni na više izmena u solution-u.'),
    code('markdown', `# review-pull-request

## Ulazi
- zahtev i kriterijumi prihvatanja
- git diff
- AI_INSTRUCTIONS.md
- rezultat build/test komandi

## Postupak
1. Sažmi očekivano ponašanje.
2. Proveri da li diff izlazi iz obima zahteva.
3. Proveri Dependency Rule i granice modula.
4. Pregledaj negativne i granične scenarije.
5. Uporedi promenjeno ponašanje sa testovima.
6. Prijavi nalaze po ozbiljnosti.

## Ograničenje
Ne menjaj kod tokom review faze.`, 'Sažeta verzija procedure iz gotovog primera'),
    callout('info', 'SRP važi i za agentski workflow', 'Review uloga ne treba istovremeno da bude autor izmene koju ocenjuje. Razdvajanje odgovornosti olakšava nezavisnu proveru.'),
  ]),

  page('6.4. Specijalizovane uloge i najmanje privilegije', [
    text('h2', '6.4. Specijalizovane uloge i najmanje privilegije'),
    table(['Uloga u primeru', 'Ulazi / dozvole', 'Ograničenje'], [
      ['architecture-reviewer', 'Čitanje solution-a, source-a, instrukcija i diff-a.', 'Ne piše kod.'],
      ['implementer', 'Menja samo fajlove iz usvojenog plana i pokreće provere.', 'Ne proširuje poslovni zahtev.'],
      ['test/review faza', 'Pokreće solution testove i analizira rezultat.', 'Ne menja test samo da sakrije grešku.'],
    ]),
    code('json', `{
  "task": "Implement approved reservation quantity rule",
  "constraints": [
    "Keep business rule outside Api",
    "Do not add Infrastructure dependency to Domain/Application"
  ],
  "filesToConsider": [
    "src/EquipmentReservation.Domain/InventoryItem.cs",
    "src/EquipmentReservation.Application/CreateReservation.cs",
    "tests/EquipmentReservation.Tests/ReservationTests.cs"
  ],
  "verification": [
    "dotnet build EquipmentReservation.sln",
    "dotnet test EquipmentReservation.sln --no-build"
  ]
}`, 'Strukturirana predaja zadatka implementacionoj ulozi'),
  ]),

  page('6.5. AI rezultat nije dokaz', [
    text('h2', '6.5. AI rezultat nije dokaz'),
    text('paragraph', 'Model može reći da promena „izgleda ispravno“, ali završetak zadatka se zasniva na stvarnim signalima. Za ovaj primer minimalni signal je uspešan build solution-a, uspešan NUnit skup i pregled konačnog diff-a.'),
    code('bash', `dotnet build EquipmentReservation.sln --configuration Release
dotnet test EquipmentReservation.sln --configuration Release --no-build
git diff -- .`, 'Minimalna nezavisna provera nakon AI izmene'),
    list([
      'Ako komanda nije izvršena, rezultat se ne beleži kao uspešna provera.',
      'Ako test padne, ne menja se očekivanje testa bez razumevanja poslovnog pravila.',
      'Ako diff dodiruje slojeve koji nisu bili u planu, promena se vraća na analizu.',
      'Ako agent traži tajne ili .env, zahtev se odbija i prelazi na guardrail temu iz Vežbe 8.',
    ]),
  ]),

  page('6.6. Rad na vežbi — jedan stvarni AI razvojni tok', [
    text('h2', '6.6. Rad na vežbi — jedan stvarni AI razvojni tok'),
    callout('task', 'Zadatak', 'Na kopiji <code>EquipmentReservation.sln</code> zadati malu promenu poslovnog pravila. Prvo koristiti architecture-reviewer samo za analizu; zatim implementer-u proslediti usvojen plan. Na kraju pokrenuti solution build/test, pregledati diff i uneti sažet zapis u <code>.ai/AI_USAGE.md</code>.'),
    table(['Dokaz', 'Šta student pokazuje'], [
      ['Plan pre izmene', 'Da je razumeo pogođene slojeve i granice.'],
      ['Mali diff', 'Da agentski tok nije nekontrolisano proširio obim.'],
      ['Build + test rezultat', 'Da provera nije zasnovana na tvrdnji modela.'],
      ['AI_USAGE zapis', 'Da tim može rekonstruisati odluku i razlog prihvatanja/odbijanja predloga.'],
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da uključi AI u razvoj bez promene osnovnih SOLID/Clean Architecture pravila i bez predaje odgovornosti modelu.'),
  ]),
]
