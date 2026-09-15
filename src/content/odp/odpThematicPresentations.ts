import type { PresentationDeck } from '../presentations'

type Topic = {
  title: string
  subtitle: string
  goal: string
  problem: string
  why: string
  model: Array<[string, string, string[]]>
  mistakes: string[]
  development: string[]
  question: string
  checkpoints?: Array<{ code: string; date: string; lead: string; items: string[] }>
}

const topics: Topic[] = [
  {
    title: 'Način razmišljanja u distribuiranom sistemu', subtitle: 'Vlasništvo i neizvesnost pre mrežne komunikacije', goal: 'Razumeti kako vreme, mreža i više procesa menjaju način na koji sistem donosi odluke.',
    problem: 'Komponente ne vide isto stanje u istom trenutku. Veza može nestati, odgovor zakasniti, a proces se može ponovo pojaviti.',
    why: 'Jasno vlasništvo nad stanjem i operacijom sprečava sukob više instanci i daje smisao statusima koje sistem prikazuje.',
    model: [
      ['Poslovni entitet', 'Poslovni entitet, poput naloga ili uređaja, ostaje isti i kada se procesi restartuju. Njegov identitet ne sme zavisiti od jedne izvršne instance.', [
        'identitet ne zavisi od jedne izvršne instance',
        'preživljava restart procesa koji ga obrađuje',
        'primer: misija ili stanica, ne worker koji je trenutno opslužuje',
      ]],
      ['Proces', 'Proces je privremeni izvršilac koji može nestati i ponovo se pojaviti. Zato njegovo lokalno stanje nije automatski izvor istine za ceo sistem.', [
        'privremeni izvršilac, ne izvor istine',
        'može nestati i ponovo se pojaviti',
        'lokalno stanje procesa nije globalno stanje sistema',
      ]],
      ['Mrežna veza', 'Mrežna veza može kasniti, prekinuti se ili vratiti bez jasne granice kada se to desilo. Sistem mora računati na tu neizvesnost.', [
        'kašnjenje i prekid su očekivano ponašanje, ne izuzetak',
        'nema jasne granice kada se prekid tačno desio',
        'sistem mora dizajnirati oko te neizvesnosti',
      ]],
      ['Vlasništvo', 'Vlasništvo određuje koja komponenta ima pravo da donese važeću odluku o stanju. Bez njega dve instance lako naprave sukobljene izmene.', [
        'određuje ko sme da donese važeću odluku o stanju',
        'sprečava da dve instance sukobljeno menjaju isto stanje',
        'mora biti eksplicitno, ne pretpostavljeno',
      ]],
    ],
    mistakes: ['prekid veze se tumači kao trajni kvar', 'dve instance menjaju isto stanje bez pravila', 'poslovno pravilo se sakrije u mrežni detalj'],
    development: ['opisati autoritet za važno stanje', 'razlikovati ono što sistem zna od onoga što pretpostavlja', 'testirati privremeni prekid kao očekivan scenario'],
    question: 'Koje stanje mora imati jedan jasan autoritet i šta se vidi kada taj autoritet privremeno nije dostupan?',
  },
  {
    title: 'Ugovori, simulatori i ponovljivost', subtitle: 'Zajedničko značenje poruke i kontrolisan eksperiment', goal: 'Razumeti kako ugovor i ponovljiv simulator omogućavaju nezavisnu promenu komponenti.',
    problem: 'Poruka bez stabilnog oblika i značenja tera primaoca da nagađa, a neponovljiv scenario ne daje pouzdan dokaz popravke.',
    why: 'Ugovori štite saradnju komponenti. Simulator omogućava da se problem ponovi bez oslanjanja na realnu opremu i slučajne uslove.',
    model: [
      ['Ugovor', 'Ugovor opisuje oblik poruke, njeno značenje i dozvoljene vrednosti. On sprečava da primalac nagađa šta je izvor hteo da pošalje.', [
        'opisuje oblik, značenje i dozvoljene vrednosti poruke',
        'sprečava nagađanje o nameri pošiljaoca',
        'promena zahteva verziju, ne tihu izmenu',
      ]],
      ['Izvor', 'Izvor šalje poruku prema dogovorenom ugovoru i bira verziju koju primalac može da razume. Slanje nije isto što i potvrđen poslovni ishod.', [
        'šalje prema dogovorenom ugovoru, ne proizvoljno',
        'bira verziju koju primalac razume',
        'slanje ≠ potvrđen poslovni ishod',
      ]],
      ['Simulator', 'Simulator namerno proizvodi poznat tok i smetnje. Njegova vrednost je u tome što tim može isti scenario da ponovi bez spoljne opreme.', [
        'proizvodi poznat, ponovljiv tok i smetnje',
        'zamenjuje realnu opremu kontrolisanim eksperimentom',
        'ne sme preuzeti poslovnu logiku sistema',
      ]],
      ['Primalac', 'Primalac validira poruku pre obrade i jasno odbija ono što ne razume. Tako nepoznata promena ne postaje tiha greška u poslovnom stanju.', [
        'validira pre obrade, ne posle',
        'jasno odbija ono što ne razume',
        'nepoznata promena ne sme tiho proći u poslovno stanje',
      ]],
    ],
    mistakes: ['promena poruke bez verzije', 'simulator preuzima poslovnu logiku sistema', 'test zavisi od slučajnog vremena ili spoljne usluge'],
    development: ['odrediti mali skup ključnih poruka', 'ponoviti isti scenario sa poznatim ulazom', 'odbiti poruku koju komponenta ne razume'],
    question: 'Koja poruka najpre treba da postane stabilan ugovor i kakav simulator bi proverio njeno značenje?',
    checkpoints: [{
      code: 'P1', date: '10.02.',
      lead: 'Prva kontrolna tačka (Vežba 1–2) proverava osnovne entitete, ponovljiv simulator i prve stabilne ugovore.',
      items: [
        'Mission/GroundStation/StationNode implementirani sa osnovnim statusima i heartbeat proverom',
        'ponovljiv DeviceSimulator sa najmanje dva profila ponašanja',
        'najmanje jedan pull request pokazuje pregled diff-a',
      ],
    }],
  },
  {
    title: 'Identitet, audit, observability i konfiguracija', subtitle: 'Poprečni sloj za razumevanje toka', goal: 'Razumeti kako se operacija prati kroz više komponenti bez gubitka konteksta.',
    problem: 'Kada se tok prekine, zasebni logovi ne daju odgovor ko je pokrenuo radnju, šta se dogodilo i pod kojim uslovima.',
    why: 'Zajednički kontekst i audit omogućavaju rekonstrukciju toka, dok konfiguracija čuva vidljive uslove pod kojima sistem radi.',
    model: [
      ['Identitet', 'Identitet pokazuje ko ili šta je pokrenulo radnju. Bez njega nije moguće povezati zahtev sa odgovornošću i pravom pristupa.', [
        'povezuje zahtev sa odgovornošću i pravom pristupa',
        'proverava se i uloga i pripadnost misiji',
        'nema odluku o pristupu bez poznatog identiteta',
      ]],
      ['Korelacija', 'Isti korelacioni identifikator prati operaciju kroz API, red i worker. On omogućava da se više tehničkih tragova pročita kao jedan tok.', [
        'isti identifikator kroz API, red i worker',
        'spaja tehničke tragove u jedan razumljiv tok',
        'ne sme se regenerisati u svakom sloju',
      ]],
      ['Audit', 'Audit beleži odluke koje imaju poslovni ili bezbednosni značaj: ko je šta promenio, kada i sa kojim ishodom. Nije zamena za svaki tehnički log.', [
        'beleži poslovno i bezbednosno značajne odluke',
        'append-only i pretraživ po correlation id-u',
        'nije zamena za svaki tehnički log',
      ]],
      ['Konfiguracija', 'Konfiguracija određuje pod kojim uslovima komponenta radi. Validne vrednosti, izvor i promena konfiguracije moraju biti vidljivi timu.', [
        'određuje uslove rada komponente',
        'validan opseg i izvor moraju biti vidljivi',
        'promena konfiguracije je sledljiva, ne tiha',
      ]],
    ],
    mistakes: ['tajne u logovima', 'novi korelacioni identifikator u svakom sloju', 'konfiguracija bez validnog opsega'],
    development: ['pratiti nekoliko važnih tokova od zahteva do ishoda', 'prenositi isti kontekst kroz granice', 'testirati promenjen ili nevalidan uslov rada'],
    question: 'Kako biste za jedan neuspešan zahtev spojili trag iz API-ja, reda poruka i workera?',
  },
  {
    title: 'Verzionisanje i failure-first testiranje', subtitle: 'Sistem koji računa na kašnjenje i duplikate', goal: 'Ugraditi neizvesnost mreže u ugovor, test i obrazloženje ponašanja.',
    problem: 'Poruke mogu kasniti, stići ponovo ili van redosleda. Lokalno uspešan test ne dokazuje da saradnja komponenti ostaje ispravna.',
    why: 'Kontrolisani failure scenariji otkrivaju granice sistema dok su male i razumljive, a verzionisanje čuva korisnike starog ugovora.',
    model: [
      ['Promena ugovora', 'Svaka promena poruke utiče na bar jednog pošiljaoca ili primaoca. Pre objave treba znati da li stariji korisnik i dalje može da sarađuje.', [
        'utiče na bar jednog pošiljaoca ili primaoca',
        'objavljena verzija se ne menja u mestu',
        'stariji korisnik mora i dalje moći da sarađuje',
      ]],
      ['Kompatibilnost', 'Kompatibilnost se posmatra iz ugla primaoca: može li da razume novu ili staru poruku bez pogrešne poslovne interpretacije?', [
        'posmatra se iz ugla primaoca, ne pošiljaoca',
        'breaking promena se ne sme označiti kao kompatibilna',
        'pogrešna interpretacija je gora od odbijanja poruke',
      ]],
      ['Failure scenario', 'Failure scenario namerno uvodi kašnjenje, duplikat, prekid ili promenjen redosled. Time se proverava ponašanje koje mreža realno može izazvati.', [
        'namerno uvodi kašnjenje, duplikat ili prekid',
        'proverava realno mrežno ponašanje, ne idealan slučaj',
        'testira se pre integracije, ne tek na kraju',
      ]],
      ['Testirani ishod', 'Test treba da proveri vidljiv poslovni ishod, a ne samo odsustvo izuzetka. To pokazuje da smetnja nije promenila značenje operacije.', [
        'proverava vidljiv poslovni ishod, ne samo odsustvo greške',
        'pokazuje da smetnja nije promenila značenje operacije',
        'osnova je za manual-core-baseline pre AI faze',
      ]],
    ],
    mistakes: ['pretpostavka o isporuci tačno jednom', 'breaking promena označena kao kompatibilna', 'prekid se testira tek na kraju integracije'],
    development: ['za važan tok navesti kašnjenje, duplikat i prekid', 'pokretati iste eksperimente više puta', 'proveriti ishod umesto odsustva izuzetka'],
    question: 'Za koju radnju bi kasno pristigla poruka bila opasnija od izgubljene i kako bi je sistem prepoznao?',
    checkpoints: [
      {
        code: 'P2', date: '10.03.',
        lead: 'Druga kontrolna tačka (Vežba 3–4) proverava da su identitet, audit, observability i konfiguracija stabilni pre operativnih tokova.',
        items: [
          'provera dozvole zahteva i ulogu i pripadnost misiji',
          'audit evidencija je append-only i pretraživa po correlation id-u',
          'message contract registry sprečava izmenu objavljene verzije u mestu',
          'failure simulator omogućava ponovljivo uvođenje kašnjenja i duplikacije',
        ],
      },
      {
        code: 'P3', date: '07.04.',
        lead: 'Treća kontrolna tačka (Vežba 4) zaokružuje osnovni nivo sistema i postavlja baznu liniju testova pred sledeću fazu rada.',
        items: [
          'ključni use-case-ovi imaju testove za uspešne, negativne i failure scenarije',
          'izveštaj o pokrivenosti je pregledan',
          'najmanje jedan bug je najpre reprodukovan testom uz FailureSimulator',
          'stabilna verzija jezgra je označena Git tag-om `manual-core-baseline`',
        ],
      },
    ],
  },
  {
    title: 'Tok podataka i read modeli', subtitle: 'Od mrežne poruke do pouzdane informacije', goal: 'Razdvojiti prijem, validaciju, distribuciju i čitanje podataka sa jasnim granicama odgovornosti.',
    problem: 'Podatak koji je stigao sa mreže još nema potvrđeno poreklo, kvalitet ni oblik pogodan za svakog korisnika sistema.',
    why: 'Razdvojeni slojevi čuvaju poreklo informacije i dopuštaju različite poglede na podatke, uz otvoreno prikazanu cenu kašnjenja.',
    model: [
      ['Prijem poruke', 'Prijem proverava izvor, osnovnu ispravnost i identitet poruke pre nego što podatak postane deo unutrašnjeg toka. Nevalidna poruka mora imati vidljiv ishod.', [
        'proverava izvor i ispravnost pre ulaska u sistem',
        'nevalidna poruka ima vidljiv, ne tih ishod',
        'prva linija odbrane od lošeg podatka',
      ]],
      ['Normalizacija', 'Normalizacija pretvara spoljašnji format u stabilan unutrašnji oblik uz očuvano poreklo i vreme. Tako ostatak sistema ne zavisi od detalja svakog izvora.', [
        'pretvara spoljašnji format u stabilan unutrašnji oblik',
        'čuva poreklo i vreme nastanka poruke',
        'ostatak sistema ne zavisi od detalja izvora',
      ]],
      ['Usmeravanje', 'Usmeravanje šalje obrađenu poruku samo komponentama koje zaista imaju razlog da je tumače. Ono odvaja odgovornosti i ograničava nepotrebne zavisnosti.', [
        'šalje poruku samo onima kojima je zaista potrebna',
        'odvaja odgovornosti između komponenti',
        'ograničava nepotrebne zavisnosti',
      ]],
      ['Read model', 'Read model je prikaz prilagođen čitanju, a ne nužno autoritativno stanje. Zato treba jasno pokazati kada je poslednji put osvežen i koliko može kasniti.', [
        'prikaz za čitanje, ne autoritativno stanje',
        'mora pokazati kada je poslednji put osvežen',
        'zastarelost je vidljiva, ne skrivena od korisnika',
      ]],
    ],
    mistakes: ['tiho odbacivanje problematične poruke', 'mešanje vremena nastanka i prijema', 'dupli poslovni efekat pri ponovljenoj poruci'],
    development: ['zadržati identitet i kvalitet poruke kroz tok', 'odrediti gde se poruka odbija', 'prikazati granicu svežine read modela'],
    question: 'Koji podatak kod vas sme da kasni i kako bi korisnik trebalo da vidi da nije potpuno svež?',
  },
  {
    title: 'Komande, poslovi i idempotentnost', subtitle: 'Pouzdan napredak bez sigurne potvrde', goal: 'Razumeti kako se komanda i dugotrajan posao vode kroz retry, preuzimanje i kasne odgovore.',
    problem: 'Slanje zahteva ne znači da je udaljena radnja završena. Ponovni pokušaj može pomoći, ali može i da ponovi poslovni efekat.',
    why: 'Idempotentnost čuva značenje ponovljenog zahteva, a ograničeno vlasništvo nad poslom sprečava sukob workera.',
    model: [
      ['Zahtev', 'Zahtev izražava poslovnu nameru i dobija stabilan identitet operacije. Taj identitet povezuje ponovljeni pokušaj sa istom namerom, a ne sa novom radnjom.', [
        'nosi stabilan identitet operacije, ne slučajan broj',
        'ponovljeni pokušaj se prepoznaje kao ista namera',
        'osnova za idempotentno rukovanje',
      ]],
      ['Izvršenje posla', 'Dugotrajan posao može čekati resurs, promeniti vlasnika ili biti preuzet nakon pada workera. Njegov status mora ostati vidljiv nezavisno od jednog procesa.', [
        'status vidljiv nezavisno od jednog procesa',
        'može biti preuzet nakon pada workera',
        'dva workera ne smeju verovati da su oba vlasnici',
      ]],
      ['Kasna potvrda', 'Potvrda može stići nakon isteka roka ili nakon novog pokušaja. Sistem mora proveriti da li se odnosi na aktuelno stanje pre nego što ga izmeni.', [
        'može stići posle isteka roka ili novog pokušaja',
        'proverava se prema aktuelnom stanju pre primene',
        'ne sme tiho prepisati novije stanje',
      ]],
      ['Jedinstven ishod', 'Idempotentnost čuva jedan poslovni ishod za istu nameru, čak i kada poruka stigne više puta. Ona ne znači da se svaka radnja može bezbedno ponavljati.', [
        'jedan poslovni ishod bez obzira na broj pokušaja',
        'ne znači da je svaka radnja bezbedna za retry',
        'retry ima granicu, ne izvodi se beskonačno',
      ]],
    ],
    mistakes: ['retry bez granice', 'dva workera veruju da su vlasnici', 'kasna potvrda prepisuje novo stanje'],
    development: ['razdvojiti prijem, obradu i prikaz ishoda', 'vezati ponavljanje za identitet operacije', 'testirati pad workera i kasnu potvrdu'],
    question: 'Koja radnja bi imala neprihvatljivu posledicu ako se izvrši dva puta i šta je njen stabilni identitet?',
  },
  {
    title: 'Rad bez veze i pouzdana isporuka', subtitle: 'Očuvanje namere kroz prekid i reconnect', goal: 'Razumeti kako buffer, outbox, deduplikacija i replay rade zajedno.',
    problem: 'Prekid veze razdvaja trenutak nastanka poruke od trenutka prijema. Sistem mora da izabere šta čuva, šta ponavlja i kako sprečava duplu obradu.',
    why: 'Pouzdana isporuka daje poruci vidljiv životni ciklus, umesto da se oslanja na pretpostavku da mreža neće napraviti grešku.',
    model: [
      ['Lokalna namera', 'Kada nema veze, sistem najpre trajno čuva nameru i njen identitet. Tako korisnikova radnja ne nestaje samo zato što udaljeni sistem trenutno nije dostupan.', [
        'trajno se čuva pre pokušaja isporuke',
        'radnja ne nestaje zbog nedostupnosti udaljenog sistema',
        'ima sopstveni stabilan identitet',
      ]],
      ['Outbox ili buffer', 'Outbox ili buffer čeka novu priliku za isporuku uz ograničen kapacitet i jasnu politiku kada se puni. Beskonačan red samo prikriva problem.', [
        'ograničen kapacitet, ne beskonačan red',
        'ima jasnu politiku za slučaj popunjenosti',
        'čeka novu priliku za isporuku, ne gubi poruku'
      ]],
      ['Deduplikacija', 'Primalac pamti stabilan identitet već obrađene poruke. Time reconnect i ponovna isporuka ne stvaraju drugi poslovni efekat.', [
        'pamti identitet već obrađene poruke',
        'sprečava drugi poslovni efekat pri ponovnoj isporuci',
        'identitet mora biti stabilan, ne promenljiv podatak',
      ]],
      ['Replay', 'Replay ponavlja vidljivo neuspešnu isporuku kroz isti tok validacije i audita. Ne sme biti prečica koja zaobilazi pravila zato što je poruka stara.', [
        'ponavlja isporuku kroz isti tok validacije',
        'ne zaobilazi pravila zato što je poruka stara',
        'prolazi i kroz audit kao svaka druga poruka',
      ]],
    ],
    mistakes: ['buffer bez ograničenja', 'replay koji zaobilazi validaciju', 'deduplikacija zasnovana na promenljivom podatku'],
    development: ['odrediti kapacitet i politiku pri popunjenosti', 'ponoviti povezivanje nakon prekida', 'pratiti poruku do konačnog ishoda'],
    question: 'Koju poruku biste obavezno sačuvali dok nema veze, a koju biste smeli da odbacite uz obaveštenje?',
  },
  {
    title: 'Koordinacija, protok i eventualna konzistentnost', subtitle: 'Jasni kompromisi pri rastu sistema', goal: 'Objasniti kako se biraju garancije vlasništva, opterećenja i svežine podataka.',
    problem: 'Više instanci, veći ulazni ritam i replike čitanja uvode sukob, zaostajanje i privremeno različite prikaze stanja.',
    why: 'Koordinacija štiti ekskluzivan rad, backpressure sprečava kolaps, a replike ubrzavaju čitanje uz cenu zastarelosti.',
    model: [
      ['Važeći izvršilac', 'Vlasništvo bira instancu čija odluka trenutno važi. Lease, epoch ili fencing token sprečavaju zakašnjelog vlasnika da piše nakon promene režima.', [
        'samo jedna instanca ima važeću odluku u datom trenutku',
        'fencing token sprečava zakašnjelog vlasnika da piše',
        'kratak prekid ne sme sam po sebi pokrenuti failover',
      ]],
      ['Opterećenje i protok', 'Protok poredi brzinu prijema i obrade. Backpressure uvodi granicu pre nego što red i memorija prerastu kapacitet sistema.', [
        'poredi brzinu prijema i obrade',
        'backpressure postavlja granicu pre kolapsa',
        'neograničen red samo odlaže i skriva problem',
      ]],
      ['Replika za čitanje', 'Replika ubrzava čitanje, ali može prikazati starije stanje od autoritativnog izvora. To je prihvatljivo samo kada je korisniku jasno šta garancija znači.', [
        'ubrzava čitanje uz cenu mogućeg zaostajanja',
        'korisnik mora znati da prikaz može biti zastareo',
        'ne sme se tumačiti kao autoritativan izvor',
      ]],
      ['Ugovor o ograničenju', 'Ugovor objašnjava kada rezultat može biti zastareo i kada sistem mora čekati autoritativno stanje. Time kompromis postaje svestan dizajnerski izbor.', [
        'jasno kaže kada je rezultat dozvoljeno da bude zastareo',
        'kaže i kada se mora čekati autoritativno stanje',
        'kompromis je svestan izbor, ne slučajna posledica',
      ]],
    ],
    mistakes: ['failover zbog kratkog prekida', 'neograničen red koji samo skriva problem', 'zastareo prikaz se tumači kao autoritet'],
    development: ['odrediti šta zahteva najnovije stanje', 'uvesti pragove za promenu režima rada', 'sprečiti zakašnjelog vlasnika jasnim tokenom ili epohom'],
    question: 'Za koju odluku vaš sistem može koristiti zastareo prikaz, a za koju mora čekati autoritativno stanje?',
    checkpoints: [{
      code: 'P4', date: '26.05.',
      lead: 'Poslednja kontrolna tačka (Vežba 5–8) proverava operativni i napredni nivo: telemetriju, komande, disconnected tokove i koordinaciju.',
      items: [
        'telemetry i command/job tokovi imaju dokumentovanu delivery semantiku',
        'disconnected station tok, dead-letter/replay i transactional outbox/inbox su implementirani',
        'najmanje tri evaluaciona/distribuirana scenarija, uključujući najmanje jedan failure/recovery slučaj',
        'svaki član tima objašnjava svoj deo bez oslanjanja na automatski generisan odgovor',
      ],
    }],
  },
]

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function conceptSlide([title, lead, points]: [string, string, string[]]) {
  return {
    title,
    lead,
    points,
  }
}

function mistakesSlide(mistakes: string[]) {
  return {
    title: 'Tipične greške',
    lead: 'Ove greške se najčešće ponavljaju kada se distribuirani princip površno primeni u razvoju sistema.',
    points: mistakes.map(capitalize),
  }
}

function practiceSlide(development: string[]) {
  return {
    title: 'Kako se princip primenjuje',
    lead: 'Ovi koraci pokazuju kako se princip prepoznaje i dosledno sprovodi u razvoju distribuiranog sistema.',
    points: development.map(capitalize),
  }
}

function checkpointSlide(checkpoint: NonNullable<Topic['checkpoints']>[number]) {
  return {
    title: `Kontrolna tačka ${checkpoint.code} (${checkpoint.date})`,
    lead: checkpoint.lead,
    points: checkpoint.items,
  }
}

export const odpThematicPresentationDecks: PresentationDeck[] = topics.map((topic, index) => ({
  id: `tema-${index + 1}`,
  exercise: index + 1,
  title: topic.title,
  subtitle: topic.subtitle,
  duration: '90 minuta',
  goal: topic.goal,
  slides: [
    { title: 'Tema i problem', lead: topic.problem, points: ['Tema gradi mentalni model za razvojni problem.', 'Cilj je da se razume granica garancije koju sistem može da pruži.'] },
    { title: 'Zašto je važno', lead: topic.why, points: topic.model.map(([title]) => title) },
    { title: 'Mentalni model', lead: 'Distribuirano ponašanje nastaje u odnosu komponenti, vremena, mreže i jasne odgovornosti.', points: topic.model.map(([title, lead]) => `${title}: ${lead}`) },
    ...topic.model.map(conceptSlide),
    mistakesSlide(topic.mistakes),
    practiceSlide(topic.development),
    { title: 'Od odluke do dokaza', lead: 'Distribuirani mehanizam ima smisao tek kada sistem jasno pokazuje šta zna, šta ne zna i koji ishod čuva u slučaju neizvesnosti.', points: ['imenovati autoritativno stanje i njegovog vlasnika', 'navesti ponašanje pri kašnjenju, duplikatu ili prekidu', 'pokazati ponovljiv failure scenario i očekivani ishod'] },
    { title: 'Provera razumevanja', lead: 'Tema je savladana kada se granica, failure scenario i dokaz ponašanja mogu jasno objasniti.', points: ['izabrati jedan distribuirani tok', 'navesti neizvestan ishod koji može nastati', 'pokazati dokaz očekivanog ponašanja'], question: topic.question },
    ...(topic.checkpoints ?? []).map(checkpointSlide),
  ],
}))
