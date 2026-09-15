import type { DocumentPage } from '../../types'
import { callout, diagram, list, page, table, text } from '../canvaPracticumShared'

type Topic = {
  number: number
  title: string
  subtitle: string
  opening: string
  why: string
  model: Array<[string, string, 'slate' | 'cyan' | 'blue' | 'violet' | 'emerald' | 'amber' | 'rose']>
  principleTitle: string
  principles: string[]
  developmentTitle: string
  development: string
  pitfalls: string[]
  prompt: string
  caseTitle: string
  caseText: string
  casePoints: string[]
  schemaTitle: string
  schema: Array<[string, string, 'slate' | 'cyan' | 'blue' | 'violet' | 'emerald' | 'amber' | 'rose']>
  schemaFooter: string
}

const topics: Topic[] = [
  {
    number: 1,
    title: 'Način razmišljanja u distribuiranom sistemu',
    subtitle: 'Vlasništvo, granice i neizvesnost pre prve mrežne poruke',
    opening: 'Distribuirani sistem nije obična aplikacija raspoređena na više procesa. Komponente posmatraju svet iz različitih trenutaka, mreža može kasniti ili prekinuti vezu, a potvrda operacije može stići nakon što je lokalni kontekst već promenjen. Zato dizajn počinje jasnim vlasništvom i granicama odgovornosti.',
    why: 'Kada se zna koja komponenta je nadležna za podatak ili operaciju, lakše je objasniti šta se dešava pri prekidu veze i ko donosi konačnu odluku. To sprečava da više instanci tiho rade istu stvar ili da se nestanak procesa pogrešno protumači kao nestanak poslovnog entiteta.',
    model: [['Poslovni entitet', 'stabilan kroz vreme', 'slate'], ['Čvor ili proces', 'privremena izvršna instanca', 'cyan'], ['Veza', 'može kasniti ili nestati', 'amber'], ['Vlasništvo', 'jasna nadležnost', 'emerald']],
    principleTitle: 'Sistem ne vidi sve u isto vreme',
    principles: ['Proces, mrežna veza i poslovni entitet nisu ista stvar.', 'Timeout znači da odgovor nije stigao na vreme, ne da se operacija sigurno nije desila.', 'Status treba da izrazi ono što sistem zna, a ne ono što pretpostavlja.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim najpre opisuje granice sistema, odgovornost svake komponente i stanje koje je za nju autoritativno. Takav opis kasnije određuje gde se rade provere, gde se čuva istorija i šta se testira kada čvor privremeno izgubi vezu.',
    pitfalls: ['Izjednačavanje prekida veze sa trajnim kvarom.', 'Dve instance koje bez pravila menjaju isto stanje.', 'Poslovno pravilo skriveno u komunikacionom detalju.'],
    prompt: 'Koji podatak ili operacija mora imati jasan autoritet i kako sistem prepoznaje da je taj autoritet privremeno nedostupan?',
    caseTitle: 'Primer: prekid veze nije nestanak stanja',
    caseText: 'Centralna komponenta prestaje da prima heartbeat od udaljenog čvora. Ona zna da potvrda nije stigla, ali ne zna da li je proces prestao, mreža prekinuta ili je poruka izgubljena. Razlika je važna jer pogrešna pretpostavka može pokrenuti dupli rad ili pogrešno zatvoriti poslovni tok.',
    casePoints: ['Status treba da izrazi poslednje pouzdano saznanje sistema.', 'Ponovno povezivanje ne sme automatski značiti da je nastala nova poslovna instanca.', 'Promena vlasništva nad radom mora imati pravilo koje sprečava stari čvor da nastavi sa radom.'],
    schemaTitle: 'Šema autoriteta i neizvesnosti',
    schema: [['Poslovno stanje', 'stabilna činjenica sistema', 'slate'], ['Autoritet', 'komponenta koja odlučuje', 'cyan'], ['Mreža', 'potvrda može kasniti', 'amber'], ['Vidljiv status', 'ono što sistem pouzdano zna', 'emerald']],
    schemaFooter: 'Proces i veza mogu nestati, ali poslovno stanje zahteva jasan i stabilan autoritet.',
  },
  {
    number: 2,
    title: 'Ugovori, simulatori i ponovljivost',
    subtitle: 'Zajednički jezik komponenti i bezbedan način učenja iz greške',
    opening: 'Komponente mogu da sarađuju samo ako dele ugovor o obliku poruke i očekivanom ponašanju. Ugovor nije sporedna dokumentacija: on je granica koja omogućava nezavisnu promenu i daje jasan odgovor na pitanje da li poruka ima značenje za primaoca.',
    why: 'Simulator daje timu ponovljiv način da proveri tokove bez oslanjanja na realnu opremu, nestabilnu mrežu ili slučajne ulaze. Ponovljivost je uslov da se greška razume i da popravka zaista bude dokazana.',
    model: [['Ugovor', 'oblik i značenje poruke', 'slate'], ['Izvor', 'šalje prema ugovoru', 'cyan'], ['Simulator', 'ponavlja poznat scenario', 'violet'], ['Primalac', 'validira i tumači', 'emerald']],
    principleTitle: 'Poruka mora da ima zajedničko značenje',
    principles: ['Objavljena verzija ugovora čuva očekivanja postojećih korisnika.', 'Validacija odbija poruku koju sistem ne razume, umesto da joj nagađa značenje.', 'Simulator odvaja stvarni problem sistema od slučajnosti spoljnog sveta.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim zapisuje mali skup poruka i scenarija koji predstavljaju ključne tokove. Zatim pokreće isti scenario više puta, sa poznatim ulazima, i proverava da svaki put dobija isti relevantan rezultat.',
    pitfalls: ['Promena poruke bez verzije i bez razmišljanja o primaocima.', 'Simulator koji sadrži poslovnu logiku centralnog sistema.', 'Test koji zavisi od slučajnog vremena ili spoljne usluge.'],
    prompt: 'Koju poruku biste najpre pretvorili u stabilan ugovor i koji scenario simulatora bi najbolje otkrio nesporazum između pošiljaoca i primaoca?',
    caseTitle: 'Primer: primalac ne razume novu poruku',
    caseText: 'Pošiljalac proširuje poruku novim poljem i smatra da promena nema posledice. Stariji primalac, međutim, drugačije tumači vrednost ili odbacuje poruku. Ugovor čuva obe strane tako što oblik, verziju i pravila kompatibilnosti čini eksplicitnim pre nego što poruka stigne do produkcionog toka.',
    casePoints: ['Verzija govori primaocu kako da tumači poruku.', 'Simulator može ponoviti isti tok sa starim i novim primaocem.', 'Nejasna ili nepoznata poruka dobija kontrolisan ishod, a ne proizvoljno tumačenje.'],
    schemaTitle: 'Šema ugovora između komponenti',
    schema: [['Pošiljalac', 'stvara poruku', 'slate'], ['Ugovor', 'oblik, značenje i verzija', 'cyan'], ['Simulator', 'ponovljiv scenario', 'violet'], ['Primalac', 'validira i obrađuje', 'emerald']],
    schemaFooter: 'Stabilan ugovor omogućava komponentama da se menjaju bez nagađanja o značenju poruke.',
  },
  {
    number: 3,
    title: 'Identitet, audit, observability i konfiguracija',
    subtitle: 'Poprečne mogućnosti koje svaka komponenta koristi na isti način',
    opening: 'Distribuirani sistem mora moći da odgovori na četiri pitanja: ko je pokrenuo radnju, šta se dogodilo, kroz koje komponente je tok prošao i pod kojim uslovima je radio. Identitet, audit, observability i konfiguracija daju odgovore koji se ne smeju izmišljati iznova u svakoj funkcionalnosti.',
    why: 'Kada se tok pokvari, pojedinačni logovi nisu dovoljni. Zajednički korelacioni identifikator i jasan audit trag omogućavaju da tim sastavi priču o operaciji bez nagađanja i bez izlaganja osetljivih podataka.',
    model: [['Identitet', 'ko pokreće radnju', 'slate'], ['Korelacija', 'jedan tok kroz komponente', 'cyan'], ['Audit', 'poslovno značajna odluka', 'blue'], ['Konfiguracija', 'uslovi rada sistema', 'emerald']],
    principleTitle: 'Vidljivost mora biti ugrađena',
    principles: ['Audit čuva odluke koje su važne za odgovornost i istragu.', 'Logovi i tragovi čuvaju tehnički kontekst, ali ne tajne.', 'Konfiguracija ima validno značenje, vlasnika i način promene.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim bira nekoliko operacija koje mora umeti da prati od zahteva do ishoda. Svaka komponenta prenosi zajednički kontekst, a testovi proveravaju da promena konfiguracije ili prekid toka ostavlja dovoljno informacija za razumevanje.',
    pitfalls: ['Log koji otkriva kredencijale ili lične podatke.', 'Korelacioni identifikator kreiran u svakoj komponenti umesto prenet.', 'Konfiguracija prihvaćena bez provere opsega i uticaja.'],
    prompt: 'Kako biste rekonstruisali jednu neuspelu operaciju koja je prošla kroz API, red poruka i worker, a da ne čitate neograničenu količinu logova?',
    caseTitle: 'Primer: zahtev prolazi kroz tri komponente',
    caseText: 'Korisnik pokreće operaciju kroz API, API objavljuje poruku, a worker završava obradu. Ako svaka komponenta beleži svoj nepovezan identifikator, tim ne može brzo da odgovori da li je zahtev prihvaćen, obrađen ili izgubljen između koraka. Zajednički kontekst pretvara tri zasebna zapisa u jednu proverljivu priču.',
    casePoints: ['Korelacioni identifikator nastaje na granici toka i prenosi se dalje.', 'Audit čuva odluke koje utiču na odgovornost, dok log čuva tehnički kontekst.', 'Konfiguracija određuje očekivano ponašanje, kao što su rokovi i pragovi, i mora biti proverljiva.'],
    schemaTitle: 'Šema sledljivog distribuiranog toka',
    schema: [['Ulazni zahtev', 'identitet i korelacija', 'slate'], ['API', 'prihvata ili odbija', 'cyan'], ['Poruka i worker', 'obrađuju isti kontekst', 'blue'], ['Audit i trag', 'objašnjavaju ishod', 'emerald']],
    schemaFooter: 'Jedan kontekst prolazi kroz sve komponente, pa se neuspeh može objasniti bez nagađanja.',
  },
  {
    number: 4,
    title: 'Verzionisanje i failure-first testiranje',
    subtitle: 'Razvoj koji računa na kašnjenje, duplikate i prekide',
    opening: 'U distribuiranom sistemu normalan scenario nikada nije cela priča. Poruka može da stigne dva puta, van redosleda ili nakon isteka roka. Verzije ugovora i kontrolisani failure scenariji omogućavaju timu da te situacije prouči dok su bezbedne i razumljive.',
    why: 'Failure-first pristup ne predviđa svaki mogući kvar. On podstiče tim da za važnu operaciju postavi prava pitanja: šta ako odgovor kasni, šta ako se zahtev ponovi i šta ako komponenta nestane između dve radnje?',
    model: [['Promena', 'novi ugovor ili ponašanje', 'slate'], ['Kompatibilnost', 'šta stari korisnici razumeju', 'cyan'], ['Failure scenario', 'kontrolisana smetnja', 'amber'], ['Test', 'dokaz očekivanog ishoda', 'emerald']],
    principleTitle: 'Neizvesnost je deo ugovora',
    principles: ['Kompatibilnost se procenjuje prema primaocima poruke, ne samo prema kodu pošiljaoca.', 'Kašnjenje i duplikat su normalni ulazi koje komponenta mora da objasni.', 'Test treba da proveri vidljiv ishod, ne samo da metoda ne baca izuzetak.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Za najvažnije tokove tim formuliše nekoliko malih failure eksperimenata i pokreće ih u istom okruženju. Rezultat ulazi u testnu bazu i u opis odluke, pa sledeća promena ne mora ponovo da otkriva ista ograničenja.',
    pitfalls: ['Pretpostavka da se poruka isporučuje tačno jednom.', 'Breaking promena označena kao bezopasna jer lokalni testovi prolaze.', 'Testiranje prekida tek nakon integracije svih komponenti.'],
    prompt: 'Za koju operaciju bi kasno pristigla poruka bila opasnija od potpuno izgubljene poruke i zašto?',
    caseTitle: 'Primer: potvrda stiže nakon isteka roka',
    caseText: 'Komponenta čeka odgovor do isteka roka i pokreće bezbedan oporavak. Zatim stigne stara potvrda iz prvog pokušaja. Ako sistem nema stabilan identitet operacije i pravilo za redosled, ta potvrda može prepisati novije stanje. Failure scenario zato nije izuzetak koji se samo uhvati, već deo ugovora o ponašanju.',
    casePoints: ['Timeout znači da odgovor nije stigao na vreme, ne da se radnja sigurno nije izvršila.', 'Duplikat i kasna poruka moraju se razdvojiti od nove legitimne operacije.', 'Ponovljiv simulator omogućava da se isti redosled greške proveri nakon svake izmene.'],
    schemaTitle: 'Šema failure-first provere',
    schema: [['Normalan tok', 'zahtev i očekivan odgovor', 'slate'], ['Kontrolisana smetnja', 'kašnjenje, duplikat ili prekid', 'amber'], ['Vidljiv ishod', 'stanje koje sistem zadržava', 'cyan'], ['Test', 'dokaz ponovljivog ponašanja', 'emerald']],
    schemaFooter: 'Cilj nije pretpostaviti savršen transport, već jasno definisati ponašanje kada transport nije savršen.',
  },
  {
    number: 5,
    title: 'Tok podataka: prijem, validacija, routing i čitanje',
    subtitle: 'Od poruke sa mreže do informacije kojoj korisnik može da veruje',
    opening: 'Podatak koji stigne preko mreže još nije pouzdana poslovna informacija. Potrebno je utvrditi poreklo, validnost, kvalitet i način na koji će različiti delovi sistema dobiti svoj pogled na njega. Razdvajanje ovih odgovornosti čuva jasnoću kada se pojave kašnjenja ili duplikati.',
    why: 'Tok podataka obično služi više korisnika sa različitim potrebama. Routing odvaja njihovu obradu, a read modeli prilagođavaju podatak čitanju. Cena tog izbora je da prikaz može kasniti, što sistem treba otvoreno da pokaže.',
    model: [['Prijem', 'izvor i osnovna validacija', 'slate'], ['Normalizacija', 'interni oblik i kvalitet', 'cyan'], ['Distribucija', 'nezavisni konzumenti', 'blue'], ['Read model', 'pogled za korišćenje', 'emerald']],
    principleTitle: 'Poreklo i kvalitet putuju sa podatkom',
    principles: ['Stabilan identitet poruke omogućava da se prepozna njeno ponavljanje.', 'Vreme nastanka i vreme prijema imaju različito značenje.', 'Read model pokazuje korisnu sliku, ali mora znati granicu svoje svežine.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim opisuje koji sloj sme da odbije poruku, koji joj dodeljuje kvalitet i koji je čuva za kasnije čitanje. Ta podela olakšava testiranje jer svaka odluka ima svoj ulaz, vidljiv ishod i razlog u evidenciji.',
    pitfalls: ['Tiho odbacivanje poruke bez razloga i traga.', 'Mešanje vremena izvora i prijema.', 'Read model koji duplira poslovni efekat pri ponovljenoj poruci.'],
    prompt: 'Koji podatak u vašem sistemu može kasniti, a ipak ostati koristan? Kako korisnik treba da vidi tu ogradu?',
    caseTitle: 'Primer: poruka stiže dva puta i kasno',
    caseText: 'Telemetrijska poruka može stići dva puta, a njeno vreme nastanka može biti starije od vremena prijema. Ako skladište samo dodaje svaki zapis, prikaz poslednje vrednosti može postati pogrešan ili pretrpan duplikatima. Tok podataka zato čuva identitet poruke, poreklo i oba vremena dok ne formira read model za korisnika.',
    casePoints: ['Prijem proverava izvor i minimalni oblik poruke.', 'Normalizacija čuva kvalitet i razliku između vremena nastanka i prijema.', 'Read model otvoreno prikazuje svežinu informacije i ne pretvara duplikat u novi poslovni događaj.'],
    schemaTitle: 'Šema toka podataka',
    schema: [['Prijem', 'izvor i identitet poruke', 'slate'], ['Normalizacija', 'kvalitet i unutrašnji oblik', 'cyan'], ['Distribucija', 'nezavisna obrada', 'blue'], ['Read model', 'pogled sa granicom svežine', 'emerald']],
    schemaFooter: 'Podatak postaje pouzdan tek kada su poznati njegovo poreklo, kvalitet i granice prikaza.',
  },
  {
    number: 6,
    title: 'Komande, poslovi, retry i idempotentnost',
    subtitle: 'Kako sistem napreduje kada potvrda nije trenutna ni sigurna',
    opening: 'Komanda je zahtev za promenu sveta, a ne običan poziv metode. Nakon slanja, sistem može čekati, ponavljati pokušaj ili dobiti kasnu potvrdu. Zato se životni ciklus komande modeluje eksplicitno i razlikuje od lokalne namere korisnika.',
    why: 'Retry povećava verovatnoću uspeha, ali bez idempotentnosti može ponoviti poslovni efekat. Lease i ograničeno vlasništvo nad poslom sprečavaju da dva workera istovremeno dovrše istu radnju nakon neusaglašenog pogleda na stanje.',
    model: [['Zahtev', 'validirana namera', 'slate'], ['Izvršenje', 'rad u pozadini', 'cyan'], ['Potvrda', 'može kasniti', 'amber'], ['Ishod', 'jednom zabeležen rezultat', 'emerald']],
    principleTitle: 'Ponovni pokušaj ne sme menjati značenje radnje',
    principles: ['Status komande opisuje znanje sistema, ne nagađanje o udaljenom svetu.', 'Idempotency ključ vezuje ponovljene pokušaje za isti poslovni rezultat.', 'Lease ima rok i štiti sistem od zakašnjelog rada prethodnog vlasnika.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim razdvaja prijem zahteva, obradu u pozadini i prikaz ishoda. Zatim testira prekid između njih: ponovljeni zahtev, pad workera i kasna potvrda ne smeju proizvesti novu poslovnu radnju niti poništiti novije stanje.',
    pitfalls: ['Retry bez granice i bez razloga za prestanak.', 'Dve obrade koje obe veruju da su vlasnici posla.', 'Kasna potvrda koja prepisuje završeno stanje.'],
    prompt: 'Koja bi posledica duplog izvršenja bila neprihvatljiva i koji identitet operacije sprečava takav ishod?',
    caseTitle: 'Primer: ponovljen zahtev za istu radnju',
    caseText: 'Klijent ne dobija odgovor na vreme i šalje isti zahtev ponovo. Sistem želi da bude otporan na prekid, pa drugi zahtev ne sme automatski smatrati novom namerom. Idempotency ključ povezuje ponovljene pokušaje sa istim poslovnim rezultatom, dok status životnog ciklusa jasno odvaja prihvatanje, obradu, čekanje i završetak.',
    casePoints: ['Ponovni pokušaj koristi isti identitet operacije kada namera korisnika nije promenjena.', 'Worker koji preuzima posao ima ograničeno vreme vlasništva i ne može završiti rad nakon isteka.', 'Kasna potvrda ne sme prepisati novije, završeno stanje.'],
    schemaTitle: 'Šema pouzdane komande',
    schema: [['Zahtev', 'jedinstvena namera', 'slate'], ['Red ili posao', 'obrada u pozadini', 'cyan'], ['Lease', 'privremeno vlasništvo workera', 'amber'], ['Ishod', 'jednom zabeležen rezultat', 'emerald']],
    schemaFooter: 'Retry povećava šansu da se radnja završi, dok idempotentnost čuva njeno značenje.',
  },
  {
    number: 7,
    title: 'Rad bez veze i pouzdana isporuka',
    subtitle: 'Sistem koji čuva smisao poruke kroz prekid i ponovni kontakt',
    opening: 'Prekid veze ne mora da zaustavi lokalni rad, ali uvodi pitanje šta se desilo dok druga strana nije bila dostupna. Buffer, replay i outbox obrasci čuvaju nameru i istoriju, dok deduplikacija sprečava da ponovna isporuka stvori drugi poslovni efekat.',
    why: 'Pouzdana isporuka nije obećanje da mreža nikada neće pogrešiti. Ona je skup jasnih odgovornosti koji omogućava da se poruka sačuva, ponovo pošalje, objasni ako ne prođe i obradi jednom sa stanovišta poslovnog efekta.',
    model: [['Lokalna namera', 'nastaje i čuva se', 'slate'], ['Outbox ili buffer', 'čeka sigurnu isporuku', 'cyan'], ['Primalac', 'pamti obrađene poruke', 'blue'], ['DLQ i replay', 'vidljiva korekcija neuspeha', 'emerald']],
    principleTitle: 'Isporuka i obrada su odvojene odgovornosti',
    principles: ['Poruka koja ne prolazi ne nestaje tiho, već dobija vidljiv razlog.', 'Ponovljena isporuka je očekivana i primalac je prepoznaje.', 'Lokalni kapacitet i politika odbacivanja moraju biti eksplicitni.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Tim najpre odlučuje šta može da se zadrži lokalno, koliko dugo i šta se dešava pri popunjenom kapacitetu. Zatim proverava reconnect scenarije i pokazuje da se poruka može pratiti od lokalne namere do konačnog poslovnog ishoda.',
    pitfalls: ['Buffer bez ograničenja i bez politike pri popunjenosti.', 'Replay koji zaobilazi istu validaciju kao prvi pokušaj.', 'Deduplikacija oslonjena samo na podatak koji se može promeniti.'],
    prompt: 'Koju poruku biste morali sačuvati tokom prekida veze, a koju biste smeli izgubiti uz jasno obaveštenje? Zašto?',
    caseTitle: 'Primer: reconnect posle lokalnog rada',
    caseText: 'Udaljena komponenta nastavlja lokalni rad dok nema vezu i čuva poruke za kasnije. Kada se ponovo poveže, neke od tih poruka su možda već stigle drugim putem. Pouzdana isporuka zato ne znači da se sve šalje bez provere, već da se poruke mogu identifikovati, ponoviti i obrađivati bez duplog poslovnog efekta.',
    casePoints: ['Buffer ima ograničenje i jasno pravilo kada više nema prostora.', 'Outbox čuva nameru zajedno sa poslovnom promenom koju predstavlja.', 'Primalac vodi evidenciju obrađenih poruka, a dead-letter čuva neuspehe za kontrolisan replay.'],
    schemaTitle: 'Šema rada bez veze',
    schema: [['Lokalna promena', 'nastaje bez mreže', 'slate'], ['Buffer ili outbox', 'čuva poruku i razlog', 'cyan'], ['Reconnect', 'ponavlja isporuku', 'amber'], ['Inbox i rezultat', 'sprečavaju dupli efekat', 'emerald']],
    schemaFooter: 'Prekid veze menja trenutak isporuke, ali ne sme da izbriše nameru niti da je proizvoljno udvostruči.',
  },
  {
    number: 8,
    title: 'Koordinacija, protok i eventualna konzistentnost',
    subtitle: 'Svesni kompromisi kada sistem raste i radi pod pritiskom',
    opening: 'Napredni distribuirani dizajn prihvata da različite komponente mogu privremeno imati različit pogled na stanje. Izazov nije da se ta činjenica sakrije, već da se vlasništvo, prebacivanje rada, opterećenje i svežina podataka modeluju tako da korisnik i operater znaju šta sistem može da garantuje.',
    why: 'Koordinacija sprečava sukob nad ekskluzivnim radom, backpressure štiti sistem kada obrada zaostaje, a replike ubrzavaju čitanje uz cenu privremene zastarelosti. Svaki mehanizam ima korist i cenu koju tim mora umeti da objasni.',
    model: [['Vlasništvo', 'jedan važeći izvršilac', 'slate'], ['Opterećenje', 'ritam proizvodnje i obrade', 'amber'], ['Replika', 'brže čitanje uz kašnjenje', 'cyan'], ['Jasan ugovor', 'vidljiva ograničenja', 'emerald']],
    principleTitle: 'Konzistentnost je odluka o garanciji',
    principles: ['Fencing token sprečava da stari vlasnik nastavi rad nakon preuzimanja.', 'Backpressure bira kontrolisano usporavanje ili ograničen gubitak pre potpunog kolapsa.', 'Read model može biti zastareo, ali sistem mora pokazati koliko i kada to utiče na odluku.'],
    developmentTitle: 'Kako se ova tema vidi u razvoju',
    development: 'Završna odbrana ne traži savršenu arhitekturu. Traži jasan trade-off: koje stanje mora biti trenutno, gde je prihvatljivo kašnjenje, kako se sprečava stari vlasnik i šta sistem radi kada ne može da prati ulazni ritam.',
    pitfalls: ['Failover pokrenut na osnovu jednog kratkog prekida.', 'Neograničen red poruka koji samo odlaže kvar.', 'Korišćenje zastarelog read modela kao da je autoritativno stanje.'],
    prompt: 'Za jednu odluku navedite da li zahteva najnovije stanje ili može da koristi zastareo prikaz, pa objasnite posledicu izbora.',
    caseTitle: 'Primer: dva čvora i jedan ekskluzivan posao',
    caseText: 'Dve instance nakratko izgube vezu jedna sa drugom. Obe mogu misliti da smeju da nastave isti ekskluzivan posao. Fencing token ili epoha daje novom vlasniku jači dokaz vlasništva, pa sistem može odbiti zakašneli pokušaj stare instance čak i kada se ona kasnije ponovo pojavi.',
    casePoints: ['Koordinacija bira jednog važećeg izvršioca za rad koji ne sme biti paralelan.', 'Backpressure odlučuje kako sistem reaguje kada ulazni ritam nadmaši obradu.', 'Replika ubrzava čitanje, ali njen prikaz mora moći da pokaže zastarelost.'],
    schemaTitle: 'Šema rada pod pritiskom',
    schema: [['Vlasništvo', 'jedan važeći izvršilac', 'slate'], ['Opterećenje', 'kontrolisan ritam obrade', 'amber'], ['Replika', 'brže čitanje uz kašnjenje', 'cyan'], ['Jasan ugovor', 'vidljive granice garancije', 'emerald']],
    schemaFooter: 'Napredni distribuirani dizajn ne skriva kompromis, već korisniku i operateru jasno pokazuje garanciju.',
  },
]

function pagesFor(topic: Topic): DocumentPage[] {
  return [
    page(`Vežba ${topic.number} — ${topic.title}`, [
      text('h1', `Vežba ${topic.number} — ${topic.title}`),
      text('paragraph', topic.opening),
      text('paragraph', topic.why),
      diagram(topic.subtitle, topic.model, 'Distribuirana svojstva nastaju u odnosu između komponenti, vremena i granica odgovornosti.'),
      callout('info', 'Fokus vežbe', 'Materijal objašnjava distribuirani problem, posledice izbora i granice garancije koju sistem može da pruži.'),
    ]),
    page(`${topic.number}.1. ${topic.principleTitle}`, [
      text('h2', `${topic.number}.1. ${topic.principleTitle}`),
      text('paragraph', topic.why),
      list(topic.principles),
      callout('note', 'Pitanje za diskusiju', topic.prompt),
    ]),
    page(`${topic.number}.2. ${topic.developmentTitle}`, [
      text('h2', `${topic.number}.2. ${topic.developmentTitle}`),
      text('paragraph', topic.development),
      text('h3', 'Česte greške koje treba prepoznati'),
      list(topic.pitfalls),
      callout('success', 'Veza sa ostatkom gradiva', 'Ovaj princip se nadovezuje na ugovore, failure scenarije, observability i testiranje. Ista logika važi bez obzira na konkretnu tehnologiju ili domen sistema.'),
    ]),
    page(`${topic.number}.3. ${topic.caseTitle}`, [
      text('h2', `${topic.number}.3. ${topic.caseTitle}`),
      text('paragraph', topic.caseText),
      list(topic.casePoints),
      callout('note', 'Kako se scenario analizira', 'Najpre razdvojite ono što sistem zna od onoga što pretpostavlja. Zatim odredite stabilan identitet operacije i vidljiv ishod koji se može proveriti.'),
    ]),
    page(`${topic.number}.4. Od principa do dokaza`, [
      text('h2', `${topic.number}.4. Od principa do dokaza`),
      text('paragraph', 'Distribuirani princip je koristan tek kada sistem ima jasan, proverljiv odgovor na njegov failure scenario. Dobar dokaz ne pokazuje samo da je normalan tok uspeo, već i da kašnjenje, duplikat, prekid ili kasna poruka ne menjaju poslovno značenje operacije.'),
      list(['Imenovati stanje koje je autoritativno i komponentu koja ima pravo da ga menja.', 'Navesti šta se dešava kada odgovor izostane ili stigne nakon isteka roka.', 'Ponavljati kontrolisani scenario dok se ishod može objasniti i nezavisno proveriti.']),
    ]),
    page(`${topic.number}.5. ${topic.schemaTitle}`, [
      text('h2', `${topic.number}.5. ${topic.schemaTitle}`),
      diagram(topic.schemaTitle, topic.schema, topic.schemaFooter),
      text('paragraph', 'Šemu koristite kao kratku proveru: za svaki korak treba umeti navesti vlasnika odluke, poruku ili stanje koje se prenosi i failure scenario koji može promeniti tok.'),
    ]),
    page(`${topic.number}.6. Uporedni pregled elemenata toka`, [
      text('h2', `${topic.number}.6. Uporedni pregled elemenata toka`),
      table(['Element', 'Uloga u toku', 'Pitanje koje treba postaviti'], topic.model.map(([name, role]) => [name, role, `Šta se dešava kada ${name.toLocaleLowerCase('sr-Latn-RS')} nije dostupan ili daje zastarelu informaciju?`])),
      callout('note', 'Poređenje pojmova', 'Svaki element toka rešava drugi deo problema. Stabilan dizajn ne prebacuje odgovornost jednog elementa na drugi samo zato što je to kratkoročno jednostavnije.'),
    ]),
    page(`${topic.number}.7. Pitanja za analizu distribuiranog ponašanja`, [
      text('h2', `${topic.number}.7. Pitanja za analizu distribuiranog ponašanja`),
      text('paragraph', 'Kada se analizira distribuirani tok, nije dovoljno opisati samo srećan put. Potrebno je imenovati stanje koje se menja, granicu odgovornosti, poruku ili vreme koje može zakasniti i ishod koji sistem mora sačuvati uprkos neizvesnosti.'),
      list([...topic.principles, 'Koji kontrolisani scenario bi pokazao da se poslovno značenje operacije ne menja pri kašnjenju, duplikatu ili prekidu?'], true),
      callout('success', 'Pitanje za vežbu', topic.prompt),
      callout('task', 'Rad na vežbi — primena na projekat', `Na dodeljenoj projektnoj celini primeniti princip iz teme „${topic.title}". Identifikovati konkretnu distribuiranu odluku, implementirati je i pripremiti ponovljiv failure scenario i test koji tim može da pokaže na projektnoj kontrolnoj tački.`),
    ]),
  ]
}

export const odpThematicExercises = () => topics.flatMap(pagesFor)
