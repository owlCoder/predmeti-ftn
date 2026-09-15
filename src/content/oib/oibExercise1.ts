import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, image, diagram, page } from '../canvaPracticumShared'

export const oibExercise1 = (): DocumentPage[] => [
  page('Vežba 1 — Identitet, uloge i osnovna autentikacija', [
    text('h1', 'Vežba 1 — Identitet, uloge i osnovna autentikacija'),
    text('paragraph', 'Bezbednost informacionog sistema ne počinje od enkripcije ili detekcije napada, već od jednostavnog pitanja: ko je subjekt koji nešto pokušava da uradi, i kome taj subjekt pripada? Pre nego što sistem uopšte može da donese bilo kakvu bezbednosnu odluku, mora postojati jasan model organizacije, bezbednosnog domena, vlasništva i identiteta. U ovoj vežbi postavljamo taj temelj i uvodimo prvi proverljiv mehanizam potvrde identiteta — osnovnu autentikaciju.'),
    text('paragraph', 'Ova vežba nije samo teorijski uvod. Svaki tim tokom semestra razvija sopstveni bezbednosni sistem — nezavisno od toga kako se on te godine zove ili kojim redosledom su projektne celine dodeljene, isti temelj se uvek gradi prvi: bez jasnog vlasništva nad resursom i bez pouzdanog identiteta, nijedna kasnija bezbednosna odluka (autorizacija, klasifikacija, audit) nema na čemu da se osloni.'),
    diagram('Od organizacije do prve prijave', [
      ['Organizacija', 'domen i vlasništvo', 'slate'],
      ['Identitet', 'osoba ili nalog', 'cyan'],
      ['Uloga', 'grupisane dozvole', 'blue'],
      ['Autentikacija', 'potvrda identiteta', 'violet'],
      ['Audit', 'sledljiv trag odluke', 'emerald'],
    ], 'Svaki bezbednosni tok počinje od jasnog vlasništva i identiteta, a završava se proverljivim tragom.'),
    callout('info', 'Projekat je defanzivno orijentisan', 'Projektni sistem ne zahteva razvoj eksploita ni napad na realne sisteme. Sumnjiva aktivnost i pokušaji nedozvoljenog pristupa se reprodukuju kontrolisanim simulatorima i testnim identitetima.'),
  ]),

  page('1.1. Organizacije, bezbednosni domeni i vlasništvo', [
    text('h2', '1.1. Organizacije, bezbednosni domeni i vlasništvo (R1-01)'),
    text('paragraph', 'Svaki zaštićeni resurs u sistemu mora imati vlasnika ili eksplicitno definisan sistemski scope — inače pitanje „ko sme da pristupi ovome" nema odgovor. Organizacija i bezbednosni domen (SecurityDomain) predstavljaju okvir unutar kog se to vlasništvo dodeljuje i menja.'),
    text('paragraph', 'U praksi to znači da nijedan resurs u sistemu ne sme "visiti u vazduhu" bez vlasnika. Kada tim doda novu tabelu, servis ili tip dokumenta, prva odluka nije "kako ćemo ga sačuvati u bazi", već "kom domenu pripada i ko je odgovoran za njega". Domen tako postaje prirodna granica za dalje bezbednosne odluke: politike, klasifikacija i audit se najčešće posmatraju u okviru jednog domena.'),
    table(['Pojam', 'Uloga u modelu'], [
      ['Organization', 'Najviša organizaciona celina kojoj pripadaju domeni i resursi.'],
      ['SecurityDomain', 'Logička celina unutar organizacije sa sopstvenim vlasnikom i pravilima.'],
      ['Owner', 'Subjekt odgovoran za resurs ili domen; menja se kroz auditovanu operaciju.'],
      ['Criticality', 'Eksplicitna oznaka značaja domena ili resursa za poslovanje.'],
    ]),
    diagram('Hijerarhija vlasništva', [
      ['Organization', 'najviša celina', 'slate'],
      ['SecurityDomain', 'domen sa vlasnikom', 'cyan'],
      ['Resource', 'konkretan resurs', 'blue'],
      ['Owner', 'odgovorna osoba', 'emerald'],
    ], 'Resurs bez vlasnika unutar domena predstavlja governance grešku, ne izuzetak koji se toleriše.'),
    callout('note', 'Deaktiviran domen ne prima nove resurse', 'Deaktivacija domena mora biti nepovratna operacija u smislu da se u njega više ne mogu dodavati novi resursi — postojeći ostaju vidljivi radi istorije i audita.'),
    callout('task', 'Rad na vežbi', 'Modelovati Organization i SecurityDomain za dodeljenu projektnu celinu. Implementirati kreiranje domena, dodelu vlasnika i povezivanje najmanje jednog resursa sa domenom. Promena vlasništva mora ostaviti audit zapis.'),
  ]),

  page('1.2. Identity registry i životni ciklus korisnika', [
    text('h2', '1.2. Identity registry i životni ciklus korisnika (R1-03)'),
    text('paragraph', 'Identitet predstavlja osobu, saradnika ili drugog ljudskog korisnika koji učestvuje u bezbednosnoj odluci. Za razliku od običnog korisničkog naloga u aplikaciji, identitet u ovakvom sistemu prati ceo životni ciklus — od kreiranja, preko aktivacije i eventualne suspenzije, do gašenja pristupa pri prestanku angažmana.'),
    text('paragraph', 'Razlika između "naloga" i "identiteta" nije samo terminološka. Nalog je tehnički zapis sa lozinkom; identitet je subjekt koji kroz vreme može imati više naloga, promeniti status, dobiti i izgubiti privilegije. Model koji meša ta dva pojma teško podnosi promene poput smene angažmana, privremenog udaljenja ili spajanja dupliranih naloga iste osobe.'),
    table(['Status', 'Značenje'], [
      ['Created', 'Identitet je registrovan, ali još nema aktivan nalog ili pristup.'],
      ['Active', 'Identitet ima aktivan nalog i može da se autentikuje.'],
      ['Suspended', 'Pristup je privremeno onemogućen; identitet ostaje evidentiran.'],
      ['Deactivated', 'Angažman je prestao; aktivne privilegije su ugašene prema politici.'],
    ]),
    diagram('Životni ciklus identiteta', [
      ['Created', 'registrovan, bez pristupa', 'slate'],
      ['Active', 'može da se autentikuje', 'blue'],
      ['Suspended', 'privremeno bez pristupa', 'amber'],
      ['Deactivated', 'privilegije ugašene', 'rose'],
    ], 'Prelaz između statusa je uvek eksplicitna, auditovana operacija — nikad tiha posledica druge promene.'),
    callout('warning', 'Jedna osoba, više identiteta', 'Jedna osoba ne sme nekontrolisano imati više nepovezanih privilegovanih identiteta. Ako je to poslovno opravdano (npr. administratorski i običan nalog), veza mora biti eksplicitno evidentirana, ne skrivena.'),
    text('paragraph', 'Suspendovan identitet ne sme moći da dobije novu sesiju, čak i ako poseduje ispravne kredencijale — provera statusa identiteta mora prethoditi svakoj proveri lozinke ili tokena.'),
    callout('task', 'Rad na vežbi', 'Implementirati Identity sa statusima Created/Active/Suspended/Deactivated. Napisati test koji pokazuje da suspendovan identitet ne može da kreira novu sesiju čak ni sa ispravnim kredencijalima.'),
  ]),

  page('1.3. Osnovna autentikacija', [
    text('h2', '1.3. Osnovna autentikacija (R1-04)'),
    text('paragraph', 'Autentikacija je proces kojim sistem potvrđuje da je subjekt zaista onaj za koga se predstavlja. To je nužan, ali ne i dovoljan uslov za pristup — sama uspešna prijava ne govori ništa o tome šta subjekt sme da radi. Ta razlika, iako izgleda očigledna, jedan je od najčešćih izvora bezbednosnih propusta kada se zanemari u implementaciji.'),
    text('paragraph', 'Vredi se zaustaviti i na naizgled sitnim detaljima ovog procesa, jer se upravo tu najčešće greši u praksi: odgovor na neuspelu prijavu, brzina odgovora, i količina detalja koju sistem otkriva mogu, sabrani zajedno, otkriti napadaču da li konkretan nalog uopšte postoji — čak i kada je sama lozinka bezbedno heširana.'),
    list([
      'Lozinke se nikada ne čuvaju u otvorenom obliku — koristi se standardna, proverena biblioteka za heširanje.',
      'Sopstveni kriptografski ili hashing algoritam nije dozvoljen ni kao vežba ni kao "privremeno" rešenje.',
      'Odgovor na neuspešnu prijavu ne sme otkriti da li nalog uopšte postoji.',
      'Svaki neuspešan pokušaj autentikacije mora biti auditovan sa jasnim razlogom neuspeha (bez otkrivanja detalja korisniku).',
    ]),
    code('csharp', `public sealed class AuthenticationResult
{
    public bool Succeeded { get; }
    public string? FailureReason { get; } // Interno; ne prosleđuje se klijentu.

    private AuthenticationResult(bool succeeded, string? failureReason)
    {
        Succeeded = succeeded;
        FailureReason = failureReason;
    }

    public static AuthenticationResult Success() => new(true, null);
    public static AuthenticationResult Fail(string reason) => new(false, reason);
}

public async Task<AuthenticationResult> AuthenticateAsync(string username, string password)
{
    var identity = await _identities.FindByUsernameAsync(username);
    if (identity is null || identity.Status != IdentityStatus.Active)
    {
        await _audit.RecordAsync(SecurityEventType.AuthenticationFailed, username, "identity-not-found-or-inactive");
        return AuthenticationResult.Fail("invalid-credentials"); // Isti odgovor kao za pogrešnu lozinku.
    }

    if (!_passwordHasher.Verify(password, identity.PasswordHash))
    {
        await _audit.RecordAsync(SecurityEventType.AuthenticationFailed, username, "invalid-password");
        return AuthenticationResult.Fail("invalid-credentials");
    }

    await _audit.RecordAsync(SecurityEventType.AuthenticationSucceeded, username, null);
    return AuthenticationResult.Success();
}`, 'Odgovor na neuspeh ne otkriva da li nalog postoji'),
    callout('warning', 'Curenje informacije kroz razliku u odgovoru', 'Poruke „nalog ne postoji" i „pogrešna lozinka" moraju biti spojene u jedinstven odgovor prema korisniku. Detaljan razlog neuspeha ostaje samo u audit zapisu, dostupan ovlašćenom osoblju.'),
  ]),

  page('1.4. Uloge i osnovni RBAC', [
    text('h2', '1.4. Uloge i osnovni RBAC (R1-05)'),
    text('paragraph', 'Role-Based Access Control grupiše dozvole u imenovane uloge koje se dodeljuju identitetima. Uloga olakšava upravljanje pravima na nivou organizacije, ali ne sme postati "crna kutija" koja implicitno daje pristup izvan definisanog opsega.'),
    text('paragraph', 'Praktičan problem sa ulogama nastaje kada tim počne da ih koristi kao prečicu: umesto da doda novu, precizno definisanu dozvolu, "proširi" postojeću ulogu jer je "jednostavnije". Vremenom takva uloga postane skup nepovezanih prava koja niko ne ume da objasni u potpunosti — a to je tačno stanje koje access review (Vežba 7) treba da otkrije i ispravi.'),
    table(['Pojam', 'Napomena'], [
      ['Role', 'Imenovan skup dozvola (npr. SecurityOperator, Auditor).'],
      ['Permission', 'Atomarna dozvola nad tipom operacije ili resursa.'],
      ['Assignment', 'Veza između identiteta i uloge, sa opcionim scope-om.'],
      ['EffectivePermission', 'Izračunata, stvarna dozvola koja se koristi u proveri pristupa.'],
    ]),
    diagram('Od uloge do efektivne dozvole', [
      ['Role', 'imenovan skup prava', 'slate'],
      ['Assignment', 'veza sa identitetom', 'cyan'],
      ['Scope', 'opseg primene', 'blue'],
      ['EffectivePermission', 'stvarna dozvola u proveri', 'emerald'],
    ], 'Provera pristupa nikad ne gleda naziv uloge direktno — uvek izračunatu efektivnu dozvolu.'),
    callout('note', 'Dozvola se proverava serverski', 'Provera dozvole na klijentskoj strani (sakrivanje dugmeta, onemogućavanje opcije u meniju) je isključivo pitanje korisničkog iskustva. Stvarna odluka o dozvoli mora se izvršiti na serveru, nezavisno od toga šta je klijent prikazao.'),
    code('csharp', `public bool HasPermission(Identity identity, string permission, string? scope = null)
{
    var effective = _roleService.GetEffectivePermissions(identity);
    return effective.Any(p => p.Name == permission && (scope is null || p.Scope == scope));
}`, 'Efektivna dozvola se izračunava, ne pretpostavlja iz naziva uloge'),
    callout('task', 'Rad na vežbi', 'Implementirati Role i Permission model sa dodelom uloge identitetu. Napisati test koji pokazuje da uklanjanje uloge odmah menja izračunatu efektivnu dozvolu, bez potrebe za ponovnom prijavom korisnika u testnom okruženju.'),
  ]),

  page('1.5. Backlog, Tapiz Boards i security acceptance kriterijumi', [
    text('h2', '1.5. Backlog, Tapiz Boards i security acceptance kriterijumi'),
    text('paragraph', 'Rad tima prati isti razvojni proces kao i svaki drugi softverski projekat — Product Backlog, sprintovi i Tapiz Boards — uz jednu ključnu razliku: svaka stavka backlog-a koja dotiče bezbednosnu logiku mora eksplicitno navesti security requirement i njegove acceptance kriterijume, ne samo funkcionalni opis.'),
    image('/course-assets/tapiz/03-backlog-view.webp', 'Product Backlog u Tapiz Boards-u omogućava timu da sagleda prioritete, stanje pripreme i plan narednog rada.', 'Tapiz Boards — pregled backlog-a'),
    table(['Status', 'Značenje'], [
      ['Backlog', 'Stavka postoji, ali još nije spremna za neposredan rad.'],
      ['Ready', 'Cilj, security zahtev i kriterijumi su dovoljno jasni za početak rada.'],
      ['In Progress', 'Implementacija je u toku i postoji odgovorna osoba ili par.'],
      ['Code Review', 'Promena čeka pregled koda, uz poseban fokus na auth/authz granice.'],
      ['QA/Verify', 'Proverava se ponašanje sistema, uključujući negativne security scenarije.'],
      ['Done', 'Promena je integrisana i ispunjava Definition of Done, uključujući security kriterijume.'],
    ]),
    image('/course-assets/tapiz/02-board-overview.webp', 'Radna tabla prikazuje stvarno stanje bezbednosnih stavki u dogovorenom razvojnom procesu.', 'Tapiz Boards — tok rada'),
    callout('note', 'Security zahtev nije naknadna napomena', 'Stavka „Dodaj korisnički nalog" bez opisanog security zahteva nije spremna za rad. Ready znači i da je jasno ko sme, ko ne sme, i šta se dešava kada neko pokuša da zaobiđe pravilo.'),
    text('paragraph', 'Detalj stavke objedinjuje opis, security acceptance kriterijume, prioritet i dodeljenu osobu — sve na jednom mestu, tako da odluka o tome da li je stavka spremna za rad ne zavisi od usmenog dogovora ili razbacanih napomena van alata.'),
    image('/course-assets/tapiz/05-create-or-edit-story.webp', 'Forma za kreiranje ili izmenu stavke: naslov, kolona, sprint i opis se definišu pre nego što stavka uđe u aktivan rad — uključujući i security zahtev kada je relevantan.', 'Tapiz Boards — kreiranje stavke backlog-a'),
    image('/course-assets/tapiz/06-acceptance-criteria-example.webp', 'Bezbednosni acceptance kriterijumi se pišu kao deo opisa stavke, u obliku koji tim može direktno da prevede u pozitivan i negativan test.', 'Tapiz Boards — acceptance kriterijumi u opisu stavke'),
    text('paragraph', 'Kada je stavka dovoljno velika da zahteva i implementaciju kontrole i pripadajući negativan test, razbija se na manje, proverljive korake kroz checklistu — na primer, odvojeno se prate "implementacija provere", "negativan test" i "audit zapis".'),
    image('/course-assets/tapiz/07-task-breakdown.webp', 'Checklist unutar stavke razlaže bezbednosnu promenu na male korake koje tim može pojedinačno da prati i otkačinje.', 'Tapiz Boards — raspodela zadataka unutar stavke'),
    callout('info', 'Tapiz Boards je alat, ne cilj', 'Svrha ovih ekrana nije da se nauči jedan konkretan alat, već da se vidi kako backlog, security acceptance kriterijumi i raspodela na zadatke rade zajedno kao jedan koherentan proces planiranja bezbednosno relevantnog rada.'),
  ]),

  page('1.6. Git i sledljivost bezbednosne promene', [
    text('h2', '1.6. Git i sledljivost bezbednosne promene'),
    text('paragraph', 'Direktan push na main granu nije dozvoljen. Svaka promena prolazi kroz feature granu, pull request, CI (build, testovi, relevantne security provere) i tek nakon review-a se integriše. Promena auth/authz ugovora dodatno zahteva review pogođenih timova, jer takva izmena po pravilu utiče na više projektnih celina odjednom.'),
    diagram('Tok jedne bezbednosne promene', [
      ['Stavka', 'jasan security zahtev', 'slate'],
      ['Grana', 'izolovana implementacija', 'cyan'],
      ['Commit-i', 'smisleni razvojni koraci', 'blue'],
      ['Pregled', 'kod, testovi i auth/authz rizik', 'amber'],
      ['CI i merge', 'proverena promena u glavnoj grani', 'emerald'],
    ], 'Pull request povezuje security zahtev sa implementacijom i dokazom da je provera zaista sproveden test, ne samo tvrdnja u opisu.'),
    code('bash', `git checkout -b feature/identity-suspend-blocks-session
git add src/Domain/Identity.cs tests/IdentitySuspensionTests.cs
git commit -m "Suspend identity blocks new session creation"
git push -u origin feature/identity-suspend-blocks-session`, 'Mala, proverljiva izmena vezana za jedan security zahtev'),
    callout('warning', 'Tajne se ne commit-uju u repozitorijum', 'Connection stringovi, API ključevi i test lozinke ne smeju završiti u istoriji Git-a, čak ni u eksperimentalnoj grani koja se kasnije briše — istorija ostaje dostupna preko reflog-a i klonova.'),
  ]),

  page('1.7. Prva projektna kontrolna tačka P1', [
    text('h2', '1.7. Projektna kontrolna tačka P1 — identitet, uloge i autentikacija'),
    text('paragraph', 'Na prvoj kontrolnoj tački ne očekuje se završen bezbednosni model. Potrebno je pokazati da tim razume subjekte sistema, da backlog sadrži proverljive security zahteve i da repozitorijum već predstavlja sledljiv trag razvoja.'),
    list([
      'Postoji zajednički projektni repozitorijum sa README dokumentom, dodeljenom projektnom celinom i pristupom svih članova tima.',
      'Tapiz Boards sadrži backlog sa security acceptance kriterijumima vidljivim direktno u opisu stavke.',
      'Model organizacije, bezbednosnog domena i identiteta je implementiran sa osnovnim tokovima.',
      'Osnovna autentikacija koristi standardnu biblioteku za heširanje lozinki, ne sopstveni algoritam.',
      'Najmanje jedan pull request pokazuje pregled diff-a, rezultat provere i smislen razgovor o promeni.',
      'Tim ume da objasni koji je threat/misuse scenario razmatran za identity lifecycle.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da poveže organizacioni model, identitet, uloge i osnovnu autentikaciju u prvi sledljiv bezbednosni tok, uz proveran razvojni proces kroz Git i Tapiz Boards.'),
  ]),
]
