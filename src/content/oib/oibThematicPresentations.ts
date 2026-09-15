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
  checkpoint?: { code: string; date: string; lead: string; items: string[] }
}

const topics: Topic[] = [
  {
    title: 'Identitet, autentikacija i RBAC', subtitle: 'Temelj odluke o pristupu', goal: 'Razumeti od čega se sastoji odluka o pristupu i zašto se identitet, prijava i ovlašćenje ne smeju spojiti.',
    problem: 'Sistem ne može bezbedno da odlučuje ako ne razlikuje subjekat koji pokušava radnju od prava koja taj subjekat trenutno ima.',
    why: 'RBAC povezuje pristup sa odgovornošću u organizaciji. Umesto pojedinačnih izuzetaka, tim upravlja razumljivim ulogama i malim dozvolama.',
    model: [
      ['Identitet', 'Identitet je trajna oznaka korisnika ili servisa. Sistem njime povezuje prijavu, ovlašćenja i trag aktivnosti sa istim subjektom.', [
        'ne menja se pri svakoj prijavi',
        'povezuje nalog, ovlašćenje i audit trag',
        'status identiteta (aktivan/suspendovan) utiče na svaku odluku',
      ]],
      ['Autentikacija', 'Autentikacija proverava da li je tvrdnja o identitetu uverljiva. Uspešna prijava dokazuje ko je subjekat, ali sama po sebi ne daje pravo na radnju.', [
        'dokazuje „ko", ne „šta sme"',
        'neuspeh se ne razlikuje po tipu greške prema korisniku',
        'lozinke se čuvaju hešovane standardnom bibliotekom',
      ]],
      ['Uloga', 'Uloga grupiše odgovornosti koje pripadaju istoj poslovnoj funkciji. Ona smanjuje broj pojedinačnih izuzetaka koje tim mora da održava.', [
        'grupiše dozvole oko poslovne funkcije',
        'smanjuje broj ručnih izuzetaka',
        'ne sme implicitno širiti pristup van scope-a',
      ]],
      ['Dozvola', 'Dozvola precizno opisuje radnju nad resursom, na primer pregled, izmenu ili odobravanje. Ona je poslednji korak odluke o pristupu.', [
        'opisuje konkretnu radnju nad resursom',
        'proverava se serverski, ne u klijentu',
        'efektivna dozvola se izračunava, ne pretpostavlja',
      ]],
    ],
    mistakes: ['uspešna prijava se tumači kao pravo na sve', 'široka uloga dobija nepovezana prava', 'klijentski interfejs se tretira kao kontrola pristupa'],
    development: ['odluku o pristupu donosi server', 'status identiteta utiče na svaku novu odluku', 'testovi obuhvataju i dopuštenu i odbijenu radnju'],
    question: 'Za jednu administrativnu radnju objasnite ko je subjekat, koja dozvola je potrebna i u kom opsegu ona važi.',
  },
  {
    title: 'Autorizacija nad resursom i klasifikacija podataka', subtitle: 'Pravo pristupa zavisi od konkretnog konteksta', goal: 'Razumeti zašto provera uloge nije dovoljna kada sistem štiti pojedinačne zapise i različito osetljive podatke.',
    problem: 'Korisnik može imati legitimnu ulogu, ali nema automatski pravo nad svakim objektom iste vrste.',
    why: 'Klasifikacija podatka daje osnovu za dosledan pristup, prikaz, čuvanje i audit. Ona pretvara nejasnu procenu osetljivosti u pravilo sistema.',
    model: [
      ['Subjekat i radnja', 'Odluka počinje pitanjem ko traži koju radnju. Sam naziv endpointa ne govori da li je zahtev opravdan.', [
        'identitet subjekta je već potvrđen autentikacijom',
        'radnja je precizno imenovana (pregled, izmena, brisanje)',
        'poznavanje URL-a nije dokaz prava pristupa',
      ]],
      ['Resurs', 'Resurs nosi podatke o vlasništvu i klasifikaciji. Zato isti tip zapisa može zahtevati različitu odluku za dva korisnika.', [
        'ima vlasnika ili eksplicitan sistemski scope',
        'klasifikacija utiče na dozvoljeno rukovanje',
        'isti endpoint daje različit ishod za različit resurs',
      ]],
      ['Kontekst', 'Kontekst opisuje odnos subjekta i resursa: vlasništvo, članstvo, status ili poslovni zadatak. On sprečava da uloga postane preširoko pravo.', [
        'vlasništvo i članstvo su deo odluke, ne samo uloga',
        'status resursa (aktivan/arhiviran) menja dozvoljenu radnju',
        'sprečava da jedna uloga pokrije tuđe podatke',
      ]],
      ['Ishod odluke', 'Server mora eksplicitno da dozvoli ili odbije radnju. Korisnički interfejs sme da sakrije opciju, ali ne sme da bude jedina zaštita.', [
        'server je jedini autoritet za odluku',
        'UI sakriva opciju, ne zamenjuje proveru',
        'odbijanje ne sme otkriti detalje o tuđem resursu',
      ]],
    ],
    mistakes: ['provera samo na nivou endpointa', 'skrivanje tuđeg resursa samo u korisničkom interfejsu', 'odbijanje koje otkriva detalje o tuđem resursu'],
    development: ['uz svaku operaciju opisati negativan scenario', 'proveru vlasništva držati uz serversku odluku', 'promenu klasifikacije učiniti vidljivom i obrazloženom'],
    question: 'Koji resurs bi korisnik mogao da pogodi promenom identifikatora i kako ga sistem štiti?',
    checkpoint: {
      code: 'P1', date: '12.10.',
      lead: 'Prva kontrolna tačka (Vežba 1–2) spaja identitet, RBAC, object-authorization i audit u jedan dokaziv lanac.',
      items: [
        'osnovna autentikacija i RBAC rade serverski',
        'object-level authorization proverava vlasništvo nad konkretnim resursom',
        'negativan test za pristup tuđem resursu postoji',
        'audit log beleži uspešan i neuspešan pokušaj pristupa',
      ],
    },
  },
  {
    title: 'Politike, konfiguracija i vidljivost', subtitle: 'Pravila koja se mogu objasniti i proveriti', goal: 'Razumeti zašto bezbednosna pravila, konfiguracija i dokaz o ponašanju moraju biti vidljivi artefakti.',
    problem: 'Pravilo rasuto kroz kod teško je pregledati, promeniti i povezati sa istorijskim odlukama sistema.',
    why: 'Politika kaže šta se očekuje, konfiguracija kako se to primenjuje, a log i test daju dokaz da se odluka zaista dogodila.',
    model: [
      ['Politika', 'Politika opisuje očekivano ponašanje: ko sme šta, pod kojim uslovom i zbog čega. Treba da bude čitljiva ljudima koji proveravaju sistem.', [
        'čitljiva je ljudima, ne samo kodu',
        'ima verziju i period važenja',
        'konfliktna pravila imaju definisan prioritet',
      ]],
      ['Konfiguracija', 'Konfiguracija prilagođava pravilo konkretnom okruženju bez promene njegovog značenja. Njena vrednost i istorija moraju biti vidljive.', [
        'prilagođava pravilo okruženju, ne menja njegov smisao',
        'odstupanje od očekivane vrednosti se evidentira',
        'tajna nikad nije plain-text konfiguraciona vrednost',
      ]],
      ['Kontrola', 'Kontrola je izvršivi mehanizam koji primenjuje pravilo u trenutku odluke. Može biti provera pristupa, validacija, ograničenje ili nadzor.', [
        'izvršava pravilo u trenutku odluke',
        'bez vlasnika i dokaza je samo governance gap',
        'promena cilja kontrole se auditom beleži',
      ]],
      ['Dokaz', 'Dokaz pokazuje šta je sistem uradio i pod kojim okolnostima. Bez njega se kasnija provera svodi na pretpostavku.', [
        'pretvara tvrdnju u proverljivu činjenicu',
        'mora biti ponovljiv za drugog člana tima',
        'nedostajući dokaz se ne tumači kao uspešan ishod',
      ]],
    ],
    mistakes: ['izmena objavljene politike bez istorije', 'tajne u logu ili konfiguracionom fajlu', 'metrika bez pitanja na koje treba da odgovori'],
    development: ['izabrati odluke koje tim mora umeti da rekonstruiše', 'prenositi korelacioni kontekst kroz slojeve', 'proveriti odstupanje od očekivane konfiguracije'],
    question: 'Koju bezbednosnu odluku biste želeli da objasnite za šest meseci i koji trag vam je za to potreban?',
    checkpoint: {
      code: 'P2', date: '26.10.',
      lead: 'Druga kontrolna tačka (Vežba 2–3) proverava da su politike, klasifikacija i baseline eksplicitni i testabilni.',
      items: [
        'policy katalog podržava verzionisanje',
        'baseline povezan sa asset tipom i detektuje drift',
        'klasifikacija podataka utiče na dozvoljeno rukovanje',
        'tim ume da objasni prioritet pri konfliktu politika',
      ],
    },
  },
  {
    title: 'Imovina, granice poverenja i threat modeling', subtitle: 'Pretnja ima smisao samo u kontekstu sistema', goal: 'Povezati vrednu imovinu, tokove podataka i granice poverenja sa realnim izborom kontrola.',
    problem: 'Kontrole se često biraju iz kataloga pre nego što tim razume šta štiti i gde se pretpostavka o poverenju menja.',
    why: 'Threat modeling otkriva rizik dok je arhitekturu još lako menjati i povezuje tehničke odluke sa poslovnim posledicama.',
    model: [
      ['Imovina', 'Imovina je ono čiji gubitak, izmena ili nedostupnost ima posledicu. Vlasnik određuje zašto je važna i ko prihvata preostali rizik.', [
        'ima jedinstven identitet i vlasnika',
        'kritičnost je eksplicitna, ne pretpostavljena',
        'dekomisionirana imovina ostaje u istoriji',
      ]],
      ['Tok podataka', 'Tok pokazuje gde podatak nastaje, kroz koje komponente prolazi i gde se čuva. Bez tog toka pretnja ostaje apstraktna.', [
        'bez toka pretnja ostaje apstraktna priča',
        'pokazuje gde podatak nastaje i gde se čuva',
        'osnova je za threat modeling, ne zamena za njega',
      ]],
      ['Granica poverenja', 'Na granici poverenja menjaju se pretpostavke o izvoru, zaštiti i ovlašćenju. Tu se najčešće traže eksplicitne provere.', [
        'mesto gde se pretpostavka o poverenju menja',
        'spoljni izvor ne dobija implicitno poverenje',
        'promena granice pokreće pregled politika',
      ]],
      ['Kontrola', 'Kontrola treba da umanji jasno imenovan scenario, a ne da bude samo stavka sa opšte liste bezbednosnih mera.', [
        'umanjuje jasno imenovan rizik, ne opštu listu pretnji',
        'vezana je za konkretnu imovinu ili tok',
        'bez povezanog rizika je usputna komplikacija',
      ]],
    ],
    mistakes: ['inventar bez vlasnika i životnog ciklusa', 'opšta lista pretnji bez veze sa sistemom', 'kontrola bez jasno imenovanog rizika'],
    development: ['nacrtati važan tok podataka', 'označiti granice i pretpostavke', 'za nekoliko scenarija povezati zahtev, kontrolu i dokaz'],
    question: 'Gde u vašem sistemu podatak prelazi granicu poverenja i šta se tačno menja u tom trenutku?',
    checkpoint: {
      code: 'P3', date: '16.11.',
      lead: 'Treća kontrolna tačka (Vežba 4) zaokružuje osnovni nivo sistema i postavlja baznu liniju testova pred sledeću fazu rada.',
      items: [
        'asset inventory beleži kritičnost i vlasnika',
        'ključni use-case-ovi imaju testove za uspešne i negativne scenarije',
        'izveštaj o pokrivenosti je pregledan',
        'stabilna verzija jezgra je označena Git tag-om `manual-core-baseline`',
      ],
    },
  },
  {
    title: 'MFA, sesije, servisi i tajne', subtitle: 'Poverenje se menja kroz vreme', goal: 'Razumeti kako se pristup ograničava nakon prijave i zašto isti principi važe za korisnike i servisne identitete.',
    problem: 'Jedna uspešna prijava ne garantuje da pristup treba da ostane važeći za svaku kasniju, rizičniju radnju.',
    why: 'Dodatna potvrda, opoziv sesije i kratkotrajne privilegije smanjuju posledicu ukradenog ili pogrešno korišćenog kredencijala.',
    model: [
      ['Početno poverenje', 'Prijava uspostavlja početni nivo poverenja u subjekat. Taj nivo se može pokazati nedovoljnim za osetljiviju narednu radnju.', [
        'uspešna prijava ≠ dovoljan assurance za svaku akciju',
        'nivo poverenja treba da odgovara riziku radnje',
        'osetljiva operacija traži step-up potvrdu',
      ]],
      ['Sesija', 'Sesija čuva privremeni kontekst prijave. Ona mora imati rok, vezu sa identitetom i način da se prekine kada se okolnosti promene.', [
        'ima konačan životni vek, ne trajno važenje',
        'revoked sesija se odmah odbija',
        'token vrednosti se ne zapisuju u log',
      ]],
      ['Dodatna potvrda', 'MFA ili ponovna potvrda prati rizik radnje, ne samo trenutak prijave. Time ukradena ili ostavljena sesija ima manju vrednost napadaču.', [
        'prati rizik radnje, ne samo trenutak prijave',
        'challenge ima kratak vek trajanja',
        'istekao ili ponovljen challenge se odbija',
      ]],
      ['Opoziv i istek', 'Istek i opoziv prekidaju važenje ranije odluke. Promena lozinke, gubitak uređaja ili sumnjiva aktivnost moraju imati posledicu na sesiju.', [
        'promena lozinke ukida postojeće sesije',
        'hitno ukidanje ne čeka istek roka',
        'svaka takva akcija se auditom beleži',
      ]],
    ],
    mistakes: ['token se smatra trajnim pravom', 'administratorski pristup ostaje bez roka', 'jedna tajna se deli među nepovezanim servisima'],
    development: ['odrediti radnje koje menjaju nivo rizika', 'definisati kada pristup gubi važnost', 'tajne čuvati van koda, logova i istorije repozitorijuma'],
    question: 'Koja radnja zaslužuje dodatnu potvrdu i koji događaj treba odmah da opozove sesiju?',
  },
  {
    title: 'Detekcija, incident i ranjivosti', subtitle: 'Od signala do obrazložene reakcije', goal: 'Razlikovati signal, upozorenje i incident, pa povezati ranjivost sa imovinom i dokazom rešavanja.',
    problem: 'Bez konteksta svaki događaj može izgledati kao napad, a važan signal može ostati izgubljen među nebitnim porukama.',
    why: 'Triage i upravljanje incidentom čuvaju činjenice, vlasništvo i odluke u trenutku kada sistem i tim rade pod pritiskom.',
    model: [
      ['Signal', 'Signal ukazuje na odstupanje od očekivanog ponašanja, ali sam ne dokazuje napad. Njegov kvalitet zavisi od jasnog izvora, praga i konteksta.', [
        'ukazuje na odstupanje, ne dokazuje napad',
        'kvalitet zavisi od izvora, praga i konteksta',
        'lažno pozitivan signal mora biti prepoznat kao takav',
      ]],
      ['Triage', 'Triage procenjuje uticaj, hitnost i verovatnoću. Njegova svrha je da odvoji koristan prioritet od buke, uz sačuvane činjenice.', [
        'odvaja koristan prioritet od buke',
        'zatvaranje zahteva eksplicitan razlog',
        'duplirani alert se ne pretvara automatski u incident',
      ]],
      ['Incident', 'Incident okuplja vlasnika, odluke i vremensku liniju reakcije kada postoji stvaran uticaj. To nije isto što i pojedinačno upozorenje.', [
        'postoji tek kad ima stvaran uticaj, ne za svako upozorenje',
        'ima jasan scope, vlasnika i pogođenu imovinu',
        'zatvara se sa rezimeom rešenja, ne brisanjem događaja',
      ]],
      ['Pregled posle incidenta', 'Pregled traži šta treba promeniti u sistemu, signalu ili postupku. Cilj nije krivica, već smanjenje verovatnoće i posledice ponavljanja.', [
        'cilj je poboljšanje procesa, ne pripisivanje krivice',
        'akcija iz pregleda ima vlasnika i rok',
        'incident se zatvara operativno, akcije ostaju sledljive',
      ]],
    ],
    mistakes: ['upozorenje bez vlasnika i praga', 'zatvaranje bez razloga ili dokaza', 'nalaz ranjivosti bez odnosa prema stvarnoj imovini'],
    development: ['izabrati mali broj smislenih signala', 'opisati normalno ponašanje i odgovornu osobu', 'proveriti korekciju pre zatvaranja nalaza'],
    question: 'Koji događaj kod vas predstavlja koristan signal, ali ne i dovoljan dokaz incidenta?',
  },
  {
    title: 'Atributi, rizik i pregled pristupa', subtitle: 'Kontekstualne odluke i preostali rizik', goal: 'Razumeti kada RBAC treba dopuniti kontekstom i kako periodični pregled pristupa podržava odgovornost.',
    problem: 'Jedna uloga ne može pošteno da izrazi svaku odluku koja zavisi od vlasništva, vremena, stanja resursa ili nivoa rizika.',
    why: 'Atributska pravila čuvaju kontekst, dok rizik i pregled pristupa proveravaju da li stara odluka i dalje ima poslovno opravdanje.',
    model: [
      ['Atributi', 'Atributi opisuju kontekst koji uloga ne može sama da izrazi: vlasništvo, region, vreme, klasifikaciju ili stanje zahteva.', [
        'dopunjuju ulogu kontekstom koji ona ne izražava',
        'moraju imati jasan izvor i značenje',
        'primer: radno vreme, upravljan uređaj, vlasništvo nad zapisom',
      ]],
      ['Politika', 'Politika tumači atribute u odluku koja mora biti objašnjiva. Ako rezultat nije moguće objasniti, pravilo je previše nejasno za održavanje.', [
        'tumači atribute u objašnjiv rezultat',
        'neobjašnjiv ishod znači da je pravilo previše nejasno',
        'konfliktan skup pravila ima definisan prioritet',
      ]],
      ['Rizik', 'Rizik povezuje pretnju, imovinu i posledicu sa kontrolom koja ga umanjuje. Tako tim razlikuje nužnu meru od usputne komplikacije.', [
        'povezuje pretnju, imovinu i kontrolu',
        'promena kritičnosti imovine pokreće reviziju',
        'prihvatanje rizika zahteva vlasnika i rok pregleda',
      ]],
      ['Pregled pristupa', 'Periodični pregled proverava da li staro pravo i dalje ima poslovno opravdanje. Pristup ne sme ostati zauvek samo zato što je jednom dodeljen.', [
        'proverava da li staro pravo još ima opravdanje',
        'privilegovana prava imaju stroži pregled',
        'ne potvrđuje se automatski zbog neaktivnosti',
      ]],
    ],
    mistakes: ['atribut bez jasnog izvora i značenja', 'politika koja daje neobjašnjiv rezultat', 'pravo pristupa koje ostaje zauvek bez pregleda'],
    development: ['izdvojiti odluke koje ne staju u jednu ulogu', 'testirati ista pravila sa suprotnim kontekstima', 'evidentirati ko prihvata preostali rizik'],
    question: 'Koja odluka traži još jedan atribut pored korisnikove uloge?',
  },
  {
    title: 'Korelacija, efektivnost i učenje', subtitle: 'Kontrola vredi koliko i dokaz da i dalje radi', goal: 'Povezati događaje, kontrole i dokaze u objašnjivu sliku bezbednosti sistema.',
    problem: 'Pojedinačni događaji retko daju celu sliku, a sama implementacija kontrole ne dokazuje da je ona korisna i ispravna.',
    why: 'Korelacija otkriva obrazac kroz vreme i komponente. Svež dokaz efektivnosti sprečava da se sistem oslanja na kontrolu koja postoji samo na papiru.',
    model: [
      ['Događaji', 'Događaji beleže pojedinačne radnje i promene. Korisni su samo ako sadrže dovoljno vremena, identiteta i konteksta za kasnije tumačenje.', [
        'korisni su samo uz dovoljno vremena i konteksta',
        'nedostajući događaj se ne izmišlja',
        'jedan zapis retko daje celu sliku',
      ]],
      ['Korelacija', 'Korelacija povezuje tragove iz više komponenti u jednu vremensku priču. Tako se razlikuje izolovan događaj od obrasca koji zaslužuje reakciju.', [
        'povezuje tragove iz više komponenti',
        'razlikuje izolovan događaj od obrasca',
        'pravilo korelacije mora biti objašnjivo',
      ]],
      ['Kontrola i rizik', 'Svaka kontrola treba da se poveže sa rizikom koji umanjuje. Ta veza omogućava da se proverava njena stvarna, a ne samo deklarativna vrednost.', [
        'kontrola bez povezanog rizika je deklarativna, ne stvarna',
        'omogućava proveru stvarne, ne samo formalne vrednosti',
        'ocena po tome da li je implementirana nije dovoljna',
      ]],
      ['Efektivnost', 'Efektivnost odgovara na pitanje da li kontrola i dalje radi u stvarnim uslovima. Implementirana kontrola bez svežeg dokaza nije dovoljan zaključak.', [
        'traži svež dokaz, ne jednokratnu implementaciju',
        'missing evidence se ne tretira kao prolaz',
        'formula ocene je dokumentovana i ponovljiva',
      ]],
    ],
    mistakes: ['zaključak na osnovu jednog log zapisa', 'automatska akcija velike posledice bez zaštite', 'ocena kontrole samo po tome da li je implementirana'],
    development: ['pokazati vezu rizik, kontrola, test i dokaz', 'odgovor većeg uticaja ostaviti pod ljudskim odobrenjem', 'post-incident pregled koristiti za poboljšanje procesa'],
    question: 'Koji dokaz bi pokazao da jedna vaša kontrola više ne radi kako je zamišljeno?',
    checkpoint: {
      code: 'P4', date: '07.12.',
      lead: 'Poslednja kontrolna tačka (Vežba 5–8) proverava operativni i napredni sloj: MFA, sesije, detekciju, incident, rizik i analitiku.',
      items: [
        'step-up aktivan za najmanje jednu privilegovanu operaciju',
        'detection pravilo i incident tok pokazuju ceo lanac do zatvaranja',
        'najmanje tri evaluaciona scenarija, uključujući negativni',
        'svaki član tima brani sopstvenu projektnu celinu',
      ],
    },
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
    lead: 'Ove greške se najčešće ponavljaju kada se tema površno primeni u razvoju informacionog sistema.',
    points: mistakes.map(capitalize),
  }
}

function practiceSlide(development: string[]) {
  return {
    title: 'Kako se princip primenjuje',
    lead: 'Ovi koraci pokazuju kako se princip prepoznaje i dosledno sprovodi u razvoju informacionog sistema.',
    points: development.map(capitalize),
  }
}

function checkpointSlide(checkpoint: NonNullable<Topic['checkpoint']>) {
  return {
    title: `Kontrolna tačka ${checkpoint.code} (${checkpoint.date})`,
    lead: checkpoint.lead,
    points: checkpoint.items,
  }
}

export const oibThematicPresentationDecks: PresentationDeck[] = topics.map((topic, index) => ({
  id: `tema-${index + 1}`,
  exercise: index + 1,
  title: topic.title,
  subtitle: topic.subtitle,
  duration: '90 minuta',
  goal: topic.goal,
  slides: [
    { title: 'Tema i problem', lead: topic.problem, points: ['Tema objašnjava bezbednosni problem i njegovu posledicu.', 'Cilj je razumeti odluku sistema i njeno ograničenje.'] },
    { title: 'Zašto je važno', lead: topic.why, points: topic.model.map(([title]) => title) },
    { title: 'Mentalni model', lead: 'Odluka je pouzdana tek kada su identitet, kontekst, kontrola i dokaz povezani.', points: topic.model.map(([title, lead]) => `${title}: ${lead}`) },
    ...topic.model.map(conceptSlide),
    mistakesSlide(topic.mistakes),
    practiceSlide(topic.development),
    { title: 'Od odluke do dokaza', lead: 'Bezbednosna kontrola ima pun smisao tek kada se može povezati sa rizikom koji umanjuje i dokazom da njeno ponašanje odgovara nameri.', points: ['imenovati imovinu ili radnju koju kontrola štiti', 'navesti kontekst u kome odluka važi', 'sačuvati ponovljiv dokaz dopuštenog i odbijenog ishoda'] },
    { title: 'Provera razumevanja', lead: 'Tema je savladana kada se odluka, njen kontekst i dokaz mogu jasno objasniti.', points: ['izabrati jednu bezbednosnu odluku', 'opisati njene ulaze, ishod i ograničenje', 'pokazati test ili dokaz ponašanja'], question: topic.question },
    ...(topic.checkpoint ? [checkpointSlide(topic.checkpoint)] : []),
  ],
}))
