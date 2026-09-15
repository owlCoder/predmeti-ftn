import type { PresentationDeck } from '../presentations'

export const oibPresentationDecks: PresentationDeck[] = [
  {
    id: 'oib-vezba-1',
    exercise: 1,
    title: 'Identitet, uloge i osnovna autentikacija',
    subtitle: 'Od organizacije do prve proverene prijave',
    duration: '90 minuta',
    goal: 'Povezati organizacioni model, identitet, uloge i osnovnu autentikaciju u prvi sledljiv bezbednosni tok.',
    slides: [
      {
        title: 'Bezbednost kao osnovni domen, ne dodatak',
        lead: 'Projektni sistem upravlja identitetima, pristupom, politikama i dokazima. Bezbednosna kontrola bez zahteva i testa se ne smatra završenom.',
        points: [
          'asset → threat → requirement → control → test → evidence',
          'projekat je defanzivno orijentisan',
          'nema napada na realne sisteme ni razvoja eksploita',
          'svaki tim dobija dodeljenu projektnu celinu',
        ],
      },
      {
        title: 'Organizacije, domeni i vlasništvo',
        lead: 'Svaki zaštićeni resurs mora imati vlasnika ili eksplicitno definisan sistemski scope.',
        points: [
          'Organization i SecurityDomain kao osnovne celine',
          'Owner odgovoran za resurs unutar domena',
          'deaktiviran domen ne prima nove resurse',
          'promena vlasništva mora biti auditovana',
        ],
        example: 'Domen „Studentska služba" ima vlasnika koji odobrava pristup resursima tog domena.',
      },
      {
        title: 'Identity registry i životni ciklus',
        lead: 'Identitet prati osobu ili servis kroz ceo radni odnos — od kreiranja do gašenja pristupa.',
        points: [
          'Identity, Account i IdentityStatus',
          'jedna osoba bez nekontrolisano više privilegovanih identiteta',
          'suspendovan identitet ne dobija novu sesiju',
          'prestanak angažmana gasi aktivne privilegije',
        ],
      },
      {
        title: 'Osnovna autentikacija',
        lead: 'Autentikacija potvrđuje ko je subjekt — pre bilo kakve odluke o tome šta sme da radi.',
        points: [
          'lozinke se ne čuvaju u otvorenom obliku',
          'standardna biblioteka, ne sopstveni algoritam',
          'odgovor ne otkriva da li nalog postoji',
          'neuspeh prijave se auditom beleži',
        ],
        question: 'Zašto poruka „pogrešan korisnik ili lozinka" štiti sistem bolje od „nalog ne postoji"?',
      },
      {
        title: 'Uloge i osnovni RBAC',
        lead: 'Uloga grupiše dozvole, ali ne sme implicitno dati pristup izvan definisanog scope-a.',
        points: [
          'Role, Permission, Assignment',
          'dozvola se proverava serverski',
          'efektivna dozvola se izračunava, ne pretpostavlja',
          'privilegovana dodela se auditom beleži',
        ],
      },
      {
        title: 'Trust granica kao alat razmišljanja',
        lead: 'Za svaki značajan tok mora biti jasno gde se identitet potvrđuje i ko donosi odluku o pristupu.',
        points: [
          'Authentication → Context → Authorization → Access',
          'allow i deny podjednako prolaze kroz audit',
          'klasifikacija podataka utiče na odluku',
          'UI filter nikad ne zamenjuje server-side proveru',
        ],
      },
      {
        title: 'Tapiz Boards i security acceptance kriterijumi',
        lead: 'Stavka backlog-a nosi sopstveni security zahtev, ne samo funkcionalni opis.',
        points: [
          'security requirement vidljiv u opisu task-a',
          'acceptance kriterijum je proverljiv testom',
          'Backlog → Ready → In Progress → Review → Verify → Done',
          'direktan push na main nije dozvoljen',
        ],
      },
      {
        title: 'Git i sledljivost bezbednosne promene',
        lead: 'Promena auth/authz ugovora zahteva review pogođenih timova pre spajanja.',
        points: [
          'feature grana za svaku bezbednosnu izmenu',
          'pull request nosi razlog i rizik promene',
          'CI izvršava build, testove i security checks',
          'tajne se nikad ne commit-uju u repozitorijum',
        ],
      },
      {
        title: 'Simulatori umesto realnih napada',
        lead: 'Test identiteti i simulatori omogućavaju ponovljive scenarije bez ugrožavanja realnih sistema.',
        points: [
          'Identity Provider i OTP/MFA simulator',
          'ponovljiv scenario umesto jednokratnog eksperimenta',
          'test identiteti jasno odvojeni od realnih naloga',
          'simulator ne implementira realni napad',
        ],
      },
      {
        title: 'Kontrolna tačka P1',
        lead: 'Do prve kontrolne tačke tim pokazuje razumevanje problema i uredan razvojni tok, ne završenu arhitekturu.',
        points: [
          'repozitorijum sa README i pristupom tima',
          'backlog sa security acceptance kriterijumima',
          'osnovni identitet, uloge i autentikacija rade',
          'najmanje jedan pull request sa smislenim pregledom',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-2',
    exercise: 2,
    title: 'Object-level autorizacija, klasifikacija i audit',
    subtitle: 'Od validnog tokena do proverene odluke o pristupu',
    duration: '90 minuta',
    goal: 'Pokazati da autentikacija ne implicira autorizaciju i da svaka bezbednosna odluka ostavlja sledljiv trag.',
    slides: [
      {
        title: 'Validan token nije pravo pristupa svemu',
        lead: 'Autentikacija i autorizacija su odvojene odgovornosti koje se nikad ne smeju stopiti u jednu proveru.',
        points: [
          'autentikacija: ko je subjekt',
          'autorizacija: šta subjekt sme da uradi nad konkretnim objektom',
          'poznavanje resource ID-a nije pravo pristupa',
          'deny-by-default za osetljive operacije',
        ],
      },
      {
        title: 'Object-level authorization',
        lead: 'Provera vlasništva i scope-a mora se izvršiti nad konkretnim objektom, ne samo nad tipom endpoint-a.',
        points: [
          'ProtectedResource, ResourceOwner, AccessDecision',
          'provera vlasništva pre svake operacije',
          'UI filter ne zamenjuje serversku autorizaciju',
          'deny ne sme otkriti postojanje tuđeg resursa',
        ],
        example: 'Korisnik A menja URL i pokušava GET /orders/告B — sistem vraća 403, ne 404 sa detaljima.',
      },
      {
        title: 'Horizontalni pristup kao klasičan propust',
        lead: 'Najčešća greška nije nepostojanje autentikacije, već nedostatak provere vlasništva nad konkretnim objektom.',
        points: [
          'endpoint-level role check nije dovoljan',
          'ID u putanji ne sme biti jedina provera',
          'negativan test mora postojati za svaki zaštićen resurs',
          'ishod odbijanja mora biti kontrolisan i bez curenja podataka',
        ],
      },
      {
        title: 'Klasifikacija podataka',
        lead: 'Klasifikacija povezuje osetljivost podatka sa pravilima rukovanja i retention politikom.',
        points: [
          'DataClassification, HandlingRule, Sensitivity',
          'klasifikacija mora imati vlasnika i značenje',
          'niži nivo zaštite ne sme tiho prepisati viši',
          'retention i pristup koriste aktivnu klasifikaciju',
        ],
      },
      {
        title: 'Security policy katalog',
        lead: 'Politike se ne menjaju u mestu — svaka promena je nova verzija sa periodom važenja.',
        points: [
          'SecurityPolicy, PolicyVersion, PolicyScope',
          'istorijski događaj se povezuje sa politikom koja je tada važila',
          'kontradiktorne politike zahtevaju pravilo prioriteta',
          'arhivirana verzija ostaje dostupna radi sledljivosti',
        ],
      },
      {
        title: 'Audit log kao neizbrisiv trag',
        lead: 'Audit zapis se ne menja nakon upisa i mora razlikovati uspešan od neuspešnog ishoda.',
        points: [
          'SecurityEvent, Actor, Action, Target, Outcome',
          'tajne i kredencijali se nikad ne zapisuju',
          'korelacija povezuje aktivnosti kroz komponente',
          'izvoz pregleda je ograničen na dozvoljen scope',
        ],
        question: 'Zašto audit log koji dozvoljava izmenu prošlih zapisa gubi svoju osnovnu svrhu?',
      },
      {
        title: 'Secure configuration baseline',
        lead: 'Minimalni bezbednosni konfiguracioni zahtevi moraju biti proverljivi, ne samo dokumentovani.',
        points: [
          'SecurityBaseline, ConfigurationRule, ComplianceStatus',
          'tajna nikad nije plain-text konfiguraciona vrednost',
          'baseline ima verziju',
          'odstupanje se evidentira, ne skriva promenom očekivane vrednosti',
        ],
      },
      {
        title: 'Trust-boundary registry',
        lead: 'Eksplicitna evidencija trust zona pomaže da se threat model gradi na stvarnim granicama sistema.',
        points: [
          'TrustZone, TrustBoundary, DataFlow',
          'spoljni izvor ne dobija implicitno poverenje',
          'promena zone pokreće pregled relevantnih politika',
          'registry nije zamena za realnu mrežnu zaštitu',
        ],
      },
      {
        title: 'Katalog bezbednosnih kontrola',
        lead: 'Kontrola bez vlasnika i dokaza je governance gap, ne dokazana zaštita.',
        points: [
          'SecurityControl, ControlOwner, EvidenceRequirement',
          'postojanje zapisa ne dokazuje efektivnost',
          'promena cilja kontrole se auditom beleži',
          'povučena kontrola ostaje u istoriji',
        ],
      },
      {
        title: 'Kontrolna tačka P2',
        lead: 'Druga kontrolna tačka spaja object-authorization, klasifikaciju i audit u jedan dokaziv lanac.',
        points: [
          'RBAC i object-level authorization rade serverski',
          'negativan test za pristup tuđem resursu postoji',
          'audit beleži allow i deny sa jasnim poljima',
          'tajne se ne pojavljuju u logovima',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-3',
    exercise: 3,
    title: 'Politike, baseline i observability',
    subtitle: 'Eksplicitna pravila umesto ad-hoc odluka',
    duration: '90 minuta',
    goal: 'Pokazati da bezbednosna pravila, konfiguracioni zahtevi i osnovna observability čine jedan konzistentan, testabilan sloj.',
    slides: [
      {
        title: 'Zašto pravila moraju biti eksplicitna',
        lead: 'Bezbednosna odluka razbacana kroz kod nije objašnjiva ni testabilna — mora postojati kao jasan, verzionisan artefakt.',
        points: [
          'auth/authz, secrets i audit nisu ad-hoc kroz kod',
          'značajne trust granice su eksplicitne',
          'bezbednosno kritične odluke imaju kratak ADR zapis',
          'policy kao prvoklasni domenski koncept',
        ],
      },
      {
        title: 'Verzionisanje politika',
        lead: 'Objavljena politika se ne menja u mestu — nova verzija se aktivira, stara arhivira.',
        points: [
          'PolicyVersion i EffectivePeriod',
          'istorijski događaj referiše politiku koja je tada važila',
          'aktiviranje nove verzije je eksplicitna akcija',
          'arhiviranje ne briše istoriju',
        ],
      },
      {
        title: 'Konflikt politika i pravilo prioriteta',
        lead: 'Dve politike mogu dati suprotan zaključak — sistem mora imati definisano pravilo koje razrešava konflikt.',
        points: [
          'najrestriktivnije pravilo pobeđuje kao podrazumevano',
          'izuzetak mora biti eksplicitan, ne slučajan',
          'konflikt se testira kao poseban scenario',
          'tim dokumentuje izabrano pravilo prioriteta',
        ],
        question: 'Šta se dešava kada jedna politika dozvoljava, a druga zabranjuje istu operaciju?',
      },
      {
        title: 'Secure configuration baseline',
        lead: 'Baseline definiše minimalne bezbednosne konfiguracione zahteve po tipu asset-a.',
        points: [
          'ConfigurationRule povezan sa TargetType',
          'provera konfiguracije je automatizovana',
          'odstupanje se evidentira sa referencom na izuzetak',
          'tajna nije konfiguraciona vrednost u plain textu',
        ],
      },
      {
        title: 'Baseline drift i remediation',
        lead: 'Sistem se vremenom udaljava od baseline-a — drift mora biti otkriven i praćen do zatvaranja.',
        points: [
          'DriftFinding, Remediation, Verification',
          'nalaz sadrži dovoljno metapodataka bez otkrivanja tajni',
          'izuzetak ima razlog, vlasnika i rok',
          'zatvaranje zahteva novu proveru',
        ],
      },
      {
        title: 'Katalog bezbednosnih kontrola',
        lead: 'Svaka kontrola treba vlasnika, očekivani dokaz i period pregleda — inače je nevidljiv rizik.',
        points: [
          'SecurityControl, ControlOwner, ReviewCycle',
          'kontrola bez vlasnika je governance gap',
          'promena scope-a kontrole se auditom beleži',
          'istorija ostaje dostupna nakon povlačenja',
        ],
      },
      {
        title: 'Bezbednosna observability osnova',
        lead: 'Correlation id povezuje log zapise iz više komponenti u jednu razumljivu priču.',
        points: [
          'TraceContext, CorrelationId, SecurityMetric',
          'logovi ne sadrže lozinke ni token vrednosti',
          'metrika mora imati jasno definisano značenje',
          'correlation nije mehanizam autorizacije',
        ],
      },
      {
        title: 'Trust-boundary i data-flow registry',
        lead: 'Registar tokova podataka omogućava da se threat model gradi na stvarnim, evidentiranim granicama.',
        points: [
          'DataFlow, TrustBoundary, EntryPoint',
          'crossing ima jasan izvor, odredište i vlasnika',
          'promena zone pokreće pregled pretpostavki',
          'registar ne glumi realnu mrežnu zaštitu',
        ],
      },
      {
        title: 'Od pravila do dokaza',
        lead: 'Svaka projektna celina treba da pokaže lanac: Asset → Threat → Requirement → Control → Test → Evidence.',
        points: [
          'kontrola bez testa nije dokazana',
          'test bez evidence-a nije sledljiv',
          'evidence je konkretan, proverljiv artefakt',
          'lanac se pokazuje na demo scenariju, ne opisno',
        ],
      },
      {
        title: 'Kontrolna tačka P3',
        lead: 'Treća kontrolna tačka proverava da su politike, baseline i observability eksplicitni i testabilni.',
        points: [
          'policy katalog podržava verzionisanje',
          'baseline povezan sa asset tipom i detektuje drift',
          'najmanje tri kontrole u katalogu imaju vlasnike',
          'correlation id povezuje tok kroz komponente',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-4',
    exercise: 4,
    title: 'Zaokruživanje R1 nivoa i manual-core-baseline',
    subtitle: 'Asset, kriptografski inventar i granica prve faze kursa',
    duration: '90 minuta',
    goal: 'Zaokružiti osnovni (R1) bezbednosni model sistema i postaviti testiranu baznu liniju pre uvođenja AI podrške u razvoj.',
    slides: [
      {
        title: 'Zašto postoji granica manual-core-baseline',
        lead: 'Do ove tačke tim samostalno projektuje jezgro sistema; nakon toga AI dobija veću ulogu, ali uz postojeću mrežu testova.',
        points: [
          'R1 nivo mora biti stabilan pre uvođenja agentskog rada',
          'testovi postoje pre nego što AI predlaže izmene',
          'Git tag `manual-core-baseline` označava tu granicu',
          'svaki naredni predlog se proverava nezavisno',
        ],
      },
      {
        title: 'Asset inventory i kritičnost',
        lead: 'Centralna evidencija resursa je preduslov za gotovo svaku drugu bezbednosnu odluku u sistemu.',
        points: [
          'Asset, AssetOwner, Criticality, LifecycleStatus',
          'asset ima jedinstven identitet',
          'dekomisioniran asset ostaje u istoriji',
          'kritičnost je eksplicitna i auditovana',
        ],
      },
      {
        title: 'Cryptographic asset inventory',
        lead: 'Evidencija kriptografskih sredstava referencira ključeve i sertifikate bez čuvanja njihovog osetljivog sadržaja.',
        points: [
          'CryptoAsset, KeyReference, CertificateReference',
          'inventar ne sme čuvati privatni ključ ili plaintext secret',
          'isteklo ili revoked sredstvo se ne prikazuje kao važeće',
          'zabranjeni algoritam politikom mora proizvesti nalaz',
        ],
      },
      {
        title: 'External exposure i attack-surface registry',
        lead: 'Nepoznat exposure se ne proglašava odmah ranjivošću, ali mora biti vidljiv za proveru.',
        points: [
          'Exposure, ExposureOwner, ExposureStatus',
          'aktivan exposure ima vlasnika i poslovno obrazloženje',
          'zatvoren exposure ostaje u istoriji',
          'promena izloženosti kritičnog servisa se auditom beleži',
        ],
      },
      {
        title: 'Data retention i secure disposal',
        lead: 'Podaci se ne čuvaju zauvek — retention politika određuje kada se bezbedno uklanjaju.',
        points: [
          'RetentionPolicy, LegalHold, DisposalEvidence',
          'aktivan hold sprečava disposal bez dozvoljene procedure',
          'disposal evidence ne sadrži uklonjenu osetljivu vrednost',
          'istek perioda ne znači automatsko brisanje bez workflow-a',
        ],
      },
      {
        title: 'Data-flow i processing registry',
        lead: 'Model tokova podataka između sistema i trust zona podržava threat modeling i procenu zaštite.',
        points: [
          'DataFlow, ProcessingPurpose, TrustBoundary',
          'aktivan tok osetljivih podataka ima vlasnika i svrhu',
          'prelazak trust granice ima kontrolu ili eksplicitan gap',
          'model ne sadrži stvarne tajne ni pun sadržaj podataka',
        ],
      },
      {
        title: 'Threat model kao dokaz razumevanja',
        lead: 'Svaki tim priprema kratak threat model za svoju celinu pre prelaska na R2 nivo.',
        points: [
          'Asset, Threat/misuse, Control, Test, Evidence',
          'threat model je vezan za konkretan sistem ili tok',
          'mitigacija ima proverljiv zahtev',
          'model se revidira nakon značajne promene',
        ],
        question: 'Koji je najveći rizik za asset tvoje projektne celine i koja kontrola ga ublažava?',
      },
      {
        title: 'Testovi kao preduslov za AI podršku',
        lead: 'NUnit/Moq testovi nad ključnim use-case-ovima omogućavaju nezavisnu proveru svakog budućeg predloga.',
        points: [
          'pozitivni i negativni scenariji za policy i pravila',
          'Moq izoluje samo promenljive spoljne zavisnosti',
          'pokrivenost se pregleda, ne samo generiše',
          'bug se prvo reprodukuje testom, zatim ispravlja',
        ],
      },
      {
        title: 'Git tag kao proverljiva granica',
        lead: 'Tag `manual-core-baseline` označava trenutak od kog AI predlozi ulaze u kontrolisan razvojni tok.',
        points: [
          'tag se postavlja na stabilnu, testiranu verziju',
          'svaka naredna promena se poredi sa baseline-om',
          'baseline ne znači zamrznut razvoj, već proverljivu tačku',
          'tim ume da objasni šta je uključeno u baseline',
        ],
      },
      {
        title: 'Kontrolna tačka P4',
        lead: 'Četvrta kontrolna tačka zaokružuje R1 nivo i postavlja baznu liniju pred AI fazu razvoja.',
        points: [
          'asset inventory beleži kritičnost i vlasnika',
          'najmanje dve dodatne R1 celine imaju izvršive use-case-ove',
          'testovi pokrivaju ključne use-case-ove i negativne scenarije',
          'tag `manual-core-baseline` je postavljen',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-5',
    exercise: 5,
    title: 'MFA, sesije i privilegovan pristup',
    subtitle: 'Od jedne potvrde identiteta do vremenski ograničenih privilegija',
    duration: '90 minuta',
    goal: 'Uvesti dodatnu potvrdu identiteta, kontrolisan životni ciklus sesija i privremeno dodeljivanje privilegovanih prava.',
    slides: [
      {
        title: 'Zašto jedna prijava nije uvek dovoljna',
        lead: 'Rizične i privilegovane operacije zahtevaju dodatnu potvrdu identiteta — assurance nivo mora odgovarati riziku operacije.',
        points: [
          'uspešna osnovna prijava ≠ dovoljan assurance za svaku akciju',
          'step-up autentikacija za osetljive operacije',
          'MFA challenge ima kratak vek trajanja',
          'replay challenge-a se eksplicitno odbija',
        ],
      },
      {
        title: 'MFA/step-up tok',
        lead: 'Challenge se pokreće, potvrđuje kroz simulator i ima definisano ponašanje pri isteku.',
        points: [
          'MfaChallenge, Factor, ChallengeStatus',
          'istekao challenge se ne prihvata',
          'risk-triggered step-up kao moguće proširenje',
          'remembered device politika je eksplicitna odluka, ne podrazumevana',
        ],
      },
      {
        title: 'Sesije, tokeni i revocation',
        lead: 'Pristup ne sme počivati na beskonačno važećem tokenu — revoked sesija se odmah odbija.',
        points: [
          'Session, AccessTokenRef, RefreshTokenRef',
          'token životni vek je konačan',
          'revoked session ne nastavlja da dobija pristup',
          'token vrednosti se ne zapisuju u log',
        ],
        example: 'Korisnik menja lozinku nakon sumnjive aktivnosti — sve postojeće sesije se odmah ukidaju.',
      },
      {
        title: 'Privileged Access i Just-in-Time',
        lead: 'Privilegovano pravo se dodeljuje privremeno, uz razlog, odobrenje i automatski istek.',
        points: [
          'PrivilegedAccessRequest, Approval, ExpiresAt',
          'privilegija ima razlog i rok',
          'odobrenje i izvršenje mogu zahtevati separation of duties',
          'istekla privilegija se ne oslanja na ručno čišćenje',
        ],
      },
      {
        title: 'Break-glass i hitno ukidanje',
        lead: 'Sistem mora podržati i suprotan scenario — hitno oduzimanje pristupa kada je potrebno.',
        points: [
          'hitno ukidanje privilegije nezavisno od isteka',
          'break-glass access kao dokumentovan izuzetak',
          'svaka takva akcija se auditom beleži',
          'privileged session review kao moguće proširenje',
        ],
      },
      {
        title: 'Service identities i workload authentication',
        lead: 'Aplikacije i servisi koji komuniciraju međusobno imaju sopstveni identitet, odvojen od ljudskog naloga.',
        points: [
          'ServiceIdentity, ClientCredentialRef, ServiceScope',
          'ljudski nalog se ne koristi kao servisni identitet',
          'servis dobija minimalno potreban scope',
          'shared credential između nepovezanih servisa nije prihvatljiv',
        ],
      },
      {
        title: 'Secrets management i lifecycle',
        lead: 'Tajne se čuvaju centralno, uz kontrolisan pristup, rotaciju i revocation — nikad u kodu.',
        points: [
          'Secret, SecretVersion, RotationPolicy',
          'tajna se ne čuva u source code-u',
          'vrednost se ne prikazuje korisniku bez potrebnog scope-a',
          'rotacija se evidentira, ne menja ručno na više mesta',
        ],
      },
      {
        title: 'Certificates i key lifecycle',
        lead: 'Sertifikati i ključevi prolaze kroz kontrolisan životni ciklus koristeći standardne biblioteke i simuliranu CA.',
        points: [
          'Certificate, Issuer, ValidFrom/ValidTo',
          'privatni ključ se ne loguje niti nepotrebno prikazuje',
          'istekao ili revoked sertifikat nije važeći',
          'student ne implementira sopstvenu kriptografiju',
        ],
      },
      {
        title: 'Endpoint/device trust kao dodatni signal',
        lead: 'Poverenje u uređaj je dodatni ulaz u odluku o pristupu, ne zamena za autentikaciju identiteta.',
        points: [
          'DevicePosture, TrustLevel, PostureSignal',
          'posture signal ima vreme važenja',
          'device trust ne zamenjuje identity authentication',
          'nepoznat uređaj ima eksplicitan default tretman',
        ],
        question: 'Da li bi dozvolio privilegovanu operaciju sa nepoznatog, ali ispravno autentikovanog uređaja?',
      },
      {
        title: 'Kontrolna tačka P5',
        lead: 'Peta kontrolna tačka proverava operativni R2 sloj: MFA, sesije, privilegovan pristup i service identity.',
        points: [
          'step-up aktivan za najmanje jednu privilegovanu operaciju',
          'revoked sesija ne dobija pristup',
          'JIT privilegija ima razlog, odobrenje i istek',
          'service identity ima minimalan scope',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-6',
    exercise: 6,
    title: 'Detekcija, incident i vulnerability tok',
    subtitle: 'Od bezbednosnog događaja do zatvorenog nalaza',
    duration: '90 minuta',
    goal: 'Povezati detekciju, alert triage, upravljanje incidentom i vulnerability registry u jedan operativni ciklus odgovora.',
    slides: [
      {
        title: 'Jedan događaj ne znači odmah incident',
        lead: 'Detekcija, alert i incident su tri različita nivoa zrelosti istog signala — svaki zahteva sopstvenu odluku.',
        points: [
          'Security Event → Detection Rule → Alert → Triage → Incident',
          'lažno pozitivan signal mora biti prepoznat kao takav',
          'eskalacija je eksplicitna odluka, ne automatizam',
          'containment i recovery dolaze tek nakon potvrde',
        ],
      },
      {
        title: 'Security detection rules',
        lead: 'Pravilo detekcije mora biti objašnjivo — analitičar treba da razume zašto je signal prepoznat.',
        points: [
          'DetectionRule, RuleCondition, Severity',
          'jedan događaj ne mora automatski značiti incident',
          'suppression i deduplikacija sprečavaju šum',
          'false positive/negative posledice su dokumentovane',
        ],
      },
      {
        title: 'Security alerts i triage',
        lead: 'Alert prolazi kroz analitičara koji odlučuje da li zahteva eskalaciju ili zatvaranje.',
        points: [
          'SecurityAlert, TriageDecision, Owner',
          'zatvaranje zahteva eksplicitan razlog',
          'critical alert ima definisanu eskalaciju',
          'duplirani alert-i se ne pretvaraju automatski u incidente',
        ],
        example: 'Pet neuspešnih prijava u minuti sa istog naloga generiše alert, ne odmah incident.',
      },
      {
        title: 'Security incident management',
        lead: 'Incident ima jasan scope, vlasnika i zatvara se tek sa rezimeom rešenja.',
        points: [
          'SecurityIncident, Severity, ContainmentStatus',
          'incident mora imati jasan scope i pogođene asset-e',
          'kritičan incident se ne uklanja brisanjem događaja',
          'major incident mode za veće razmere',
        ],
      },
      {
        title: 'Investigation, evidence i timeline',
        lead: 'Istraga prikuplja artefakte i vremensku liniju bez menjanja dokaza nakon upisa.',
        points: [
          'Evidence, TimelineEntry, IntegrityMetadata',
          'pristup dokazima je strože kontrolisan od pregleda incidenta',
          'evidence se ne menja bez nove verzije zapisa',
          'integrity metadata nije forenzički dokaz ako mehanizam to ne garantuje',
        ],
      },
      {
        title: 'Vulnerability registry i remediation',
        lead: 'Poznata slabost dobija prioritet, vlasnika i zatvara se tek uz verifikacioni dokaz.',
        points: [
          'VulnerabilityFinding, AffectedAsset, FindingStatus',
          'nalaz bez pogođenog asset-a ostaje označen kao nepotpun',
          'severity nije isto što i poslovni risk',
          'zatvaranje zahteva dokaz, ne samo status promenu',
        ],
      },
      {
        title: 'API i application security policies',
        lead: 'Aplikacione i API granice imaju centralizovana pravila koja se testiraju, ne samo dokumentuju.',
        points: [
          'ApiSecurityPolicy, RatePolicy, SecurityHeaderPolicy',
          'validacija input-a ne zamenjuje poslovnu validaciju',
          'rate limit ima jasno definisan scope',
          'security header mora biti testiran',
        ],
      },
      {
        title: 'Dependency i supply-chain registry',
        lead: 'Softverske zavisnosti nose sopstveni rizik koji mora biti evidentiran i praćen.',
        points: [
          'SoftwareComponent, Dependency, KnownRisk',
          'paket mora imati identitet i verziju',
          'nepoznat izvor zavisnosti je vidljiv risk signal',
          'zatvaranje rizika zahteva verifikovanu verziju ili prihvaćen izuzetak',
        ],
      },
      {
        title: 'Telemetry ingestion i normalizacija',
        lead: 'Događaji iz više izvora moraju biti normalizovani u zajednički model pre nego što uđu u detekciju.',
        points: [
          'IngestionSource, NormalizedEvent, QualityFlag',
          'nevalidan događaj se ne pretvara tiho u validan',
          'duplikat ne proizvodi više istih downstream posledica',
          'prekid izvora se razlikuje od normalnog odsustva događaja',
        ],
        question: 'Kako razlikuješ „nema napada" od „log izvor je prestao da šalje podatke"?',
      },
      {
        title: 'Kontrolna tačka P6',
        lead: 'Šesta kontrolna tačka proverava ceo operativni ciklus od događaja do zatvorenog nalaza.',
        points: [
          'detection rule proizvodi objašnjiv rezultat',
          'alert i incident imaju jasan tok i vlasnika',
          'vulnerability nalaz je povezan sa asset-om',
          'tim demonstrira ceo lanac na jednom scenariju',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-7',
    exercise: 7,
    title: 'Policy engine, risk i threat modeling',
    subtitle: 'Napredne odluke o pristupu i strukturisan rizik',
    duration: '90 minuta',
    goal: 'Uvesti atributsku autorizaciju, strukturisan risk register i sistematski threat modeling workflow.',
    slides: [
      {
        title: 'Kada RBAC više nije dovoljan',
        lead: 'Neke odluke zavise od kombinacije više atributa — subjekta, resursa i konteksta — ne samo uloge.',
        points: [
          'RBAC odgovara na „koja uloga"',
          'ABAC/policy engine odgovara na „u kom kontekstu"',
          'deterministički rezultat za isti kontekst',
          'deny-by-default ostaje eksplicitna odluka',
        ],
      },
      {
        title: 'Policy engine i atributska autorizacija',
        lead: 'Odluka kombinuje atribute subjekta, resursa i okruženja u jedan objašnjiv rezultat.',
        points: [
          'PolicyDecision, SubjectAttribute, EnvironmentContext',
          'allow/deny razlog mora biti objašnjiv',
          'policy set je verzionisan',
          'konfliktan policy ima definisano pravilo prioriteta',
        ],
        example: 'Pristup finansijskom izveštaju dozvoljen samo tokom radnog vremena i sa upravljanog uređaja.',
      },
      {
        title: 'Periodic access review i certification',
        lead: 'Prava se periodično preispituju — dodela nije trajna samo zato što nekad ima poslovni smisao.',
        points: [
          'AccessReview, ReviewItem, CertificationDecision',
          'review se ne potvrđuje automatski zbog neaktivnosti',
          'privilegovana prava imaju stroži review',
          'odluka reviewera se auditom beleži',
        ],
      },
      {
        title: 'Risk register',
        lead: 'Rizik povezuje asset, pretnju, slabost i kontrolu u jedan procenjiv i sledljiv model.',
        points: [
          'Risk, Threat, Weakness, ResidualRisk',
          'risk score nije zamena za obrazloženje',
          'promena kritičnosti asset-a pokreće reviziju rizika',
          'risk acceptance zahteva vlasnika i period pregleda',
        ],
      },
      {
        title: 'Threat modeling workflow',
        lead: 'Threat model sistematski povezuje trust granice, tokove podataka i planirane mitigacije.',
        points: [
          'ThreatModel, TrustBoundary, DataFlow, Mitigation',
          'model je vezan za konkretan sistem ili tok',
          'mitigacija ima proverljiv zahtev',
          'značajna arhitektonska promena pokreće reviziju',
        ],
      },
      {
        title: 'Security exceptions i risk acceptance',
        lead: 'Odstupanje od politike je formalna odluka sa vlasnikom, rokom i povezanim rizikom, ne tiha izuzetnost.',
        points: [
          'SecurityException, Owner, ExpiresAt',
          'izuzetak ne briše osnovnu politiku',
          'svaki izuzetak ima rok',
          'istekao izuzetak vraća neusaglašeno stanje ako problem ostaje',
        ],
      },
      {
        title: 'Segregation of duties',
        lead: 'Kombinacija privilegija može biti opasna i kada je svaka pojedinačna dozvola opravdana.',
        points: [
          'SodRule, ToxicCombination, CompensatingControl',
          'nalaz se zasniva na efektivnim, ne samo direktnim privilegijama',
          'JIT privilegija ulazi u analizu tokom perioda važenja',
          'sistem ne ukida pristup bez definisanog odobrenja',
        ],
        question: 'Koja kombinacija dve „bezopasne" dozvole postaje rizična kada ih ima ista osoba?',
      },
      {
        title: 'Risk-based adaptive authentication',
        lead: 'Nivo potrebne autentikacije se prilagođava riziku konteksta prijave, ne samo identitetu korisnika.',
        points: [
          'AuthenticationRisk, ContextSignal, StepUpDecision',
          'odluka je deterministička za isti context snapshot',
          'nedostajući signal ne znači automatski nizak rizik',
          'risk score ne zamenjuje server-side authorization',
        ],
      },
      {
        title: 'Third-party i supplier security assessment',
        lead: 'Dobavljači koji utiču na interne asset-e nose sopstveni, praćen bezbednosni rizik.',
        points: [
          'ThirdParty, Assessment, RiskDecision',
          'assessment ima vlasnika i datum važenja',
          'dobavljački dokaz ne zatvara interni risk bez review-a',
          'kritična usluga sa isteklom procenom je vidljiv risk signal',
        ],
      },
      {
        title: 'Kontrolna tačka P7',
        lead: 'Sedma kontrolna tačka proverava napredni R3 sloj: policy engine, risk i threat modeling.',
        points: [
          'policy engine daje deterministički rezultat',
          'risk register povezuje asset, pretnju i kontrolu',
          'threat model ima evidentiranu trust granicu',
          'najmanje jedan izuzetak ima rok i vlasnika',
        ],
      },
    ],
  },
  {
    id: 'oib-vezba-8',
    exercise: 8,
    title: 'Napredna analitika i završna odbrana',
    subtitle: 'Attack-path, posture i objašnjiva bezbednosna analitika',
    duration: '90 minuta',
    goal: 'Povezati naprednu R3 analitiku sa nižim nivoima sistema i pripremiti tim za sledljivu, objašnjivu odbranu projekta.',
    slides: [
      {
        title: 'Analitika ne sme stvarati lažnu preciznost',
        lead: 'Attack-path, correlation i posture metrike su alati za razumevanje, ne dokaz da je nešto sigurno ili ugroženo.',
        points: [
          'confidence i ograničenja moraju biti vidljivi',
          'nedostajući podatak se ne tretira kao pozitivan rezultat',
          'agregatni score ne sme sakriti otvoren kritičan nalaz',
          'analitika ne menja automatski risk acceptance odluku',
        ],
      },
      {
        title: 'Attack-path i exposure graph analiza',
        lead: 'Analitički model pronalazi moguće puteve ka kritičnom asset-u bez izvođenja realnog napada.',
        points: [
          'AttackPath, ExposureEdge, CriticalAsset',
          'attack-path ne dokazuje da je exploit moguć',
          'nepoznata veza se ne tretira kao bezbedna',
          'what-if uklanjanje veze procenjuje efekat mitigacije',
        ],
      },
      {
        title: 'Security event correlation i analytics',
        lead: 'Kombinovanje više događaja daje objašnjivu sliku bez obaveznog mašinskog učenja.',
        points: [
          'CorrelationRule, EventWindow, Confidence',
          'pravilo je testabilno i objašnjivo',
          'nedostajući događaj se ne izmišlja',
          'confidence nije dokaz incidenta',
        ],
      },
      {
        title: 'Automatizacija containment i response',
        lead: 'Response akcija mora biti kontrolisana — destruktivna ili široka akcija zahteva viši nivo odobrenja.',
        points: [
          'ResponseAction, Playbook, RollbackRef',
          'automatizacija je idempotentna gde je moguće',
          'akcija ostavlja audit trag i mogućnost rollback-a',
          'safe dry-run pre stvarnog izvršenja',
        ],
        example: 'Automatsko ukidanje sesije je dozvoljeno bez dodatnog odobrenja; suspenzija naloga zahteva potvrdu.',
      },
      {
        title: 'Continuous control effectiveness',
        lead: 'Efektivnost kontrole se procenjuje kroz vreme na osnovu testova, dokaza i freshness-a evidence-a.',
        points: [
          'ControlMetric, EvidenceFreshness, PostureTrend',
          'missing evidence se ne tretira kao pass',
          'score formula je dokumentovana i reproduktibilna',
          'drill-down vodi do konkretnog failed testa',
        ],
      },
      {
        title: 'Cryptographic posture i migration planning',
        lead: 'Zastareli algoritmi i sertifikati zahtevaju planiranu, kontrolisanu migraciju, ne paniku pred istek.',
        points: [
          'CryptoPosture, AlgorithmRisk, MigrationWave',
          'posture score ima dokumentovanu formulu',
          'migration plan ne rotira produkciju automatski',
          'prioritet uzima u obzir poslovni impact',
        ],
      },
      {
        title: 'Security metrics i executive posture',
        lead: 'KPI/KRI pokazatelji povezuju rizike, incidente i remediation trendove bez lažne preciznosti.',
        points: [
          'SecurityMetric, KRI, Confidence',
          'svaka metrika ima definisanu formulu i izvor',
          'nedostajući podaci se ne tretiraju kao nula',
          'istorijski snapshot koristi definiciju koja je tada važila',
        ],
      },
      {
        title: 'Post-incident review i unapređenje',
        lead: 'Iskustvo iz incidenta se pretvara u merljive korektivne akcije, ne u traženje krivca.',
        points: [
          'PostIncidentReview, ActionItem, DueDate',
          'PIR nije mesto za pripisivanje krivice pojedincu',
          'akcija ima vlasnika i rok',
          'incident se zatvara operativno, akcije ostaju sledljive',
        ],
      },
      {
        title: 'Priprema za odbranu',
        lead: 'Odbrana projekta se ne oslanja na memorisan tekst — svaki član tima objašnjava sopstvenu celinu.',
        points: [
          'asset, pretnja, kontrola, test i residual risk',
          'trust granica prema drugim timovima',
          'objašnjenje bez automatski generisanog odgovora',
          'poznato ograničenje se priznaje, ne skriva',
        ],
        question: 'Koji je najveći preostali (residual) rizik u tvojoj projektnoj celini i zašto je prihvaćen?',
      },
      {
        title: 'Kontrolna tačka P8 — završna',
        lead: 'Poslednja kontrolna tačka proverava da je ceo sistem, od R1 do R3, sledljiv, testiran i objašnjiv.',
        points: [
          'najmanje jedna analitička R3 celina koristi stvarne podatke',
          'response akcija zahteva odgovarajuće odobrenje',
          'tri evaluaciona scenarija, uključujući negativni',
          'svaki član tima brani sopstvenu celinu',
        ],
      },
    ],
  },
]
