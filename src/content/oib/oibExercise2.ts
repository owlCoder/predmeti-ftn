import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise2 = (): DocumentPage[] => [
  page('Vežba 2 — Object-level autorizacija, klasifikacija i audit', [
    text('h1', 'Vežba 2 — Object-level autorizacija, klasifikacija i audit'),
    text('paragraph', 'Validan token ili aktivna sesija ne znače automatski pravo pristupa svakom resursu u sistemu. Najčešći bezbednosni propust u realnim aplikacijama nije odsustvo autentikacije, već nedostatak provere da li baš TAJ subjekt sme da pristupi baš TOM konkretnom objektu. U ovoj vežbi tu proveru gradimo eksplicitno, povezujemo je sa klasifikacijom podataka i zatvaramo lanac neizbrisivim audit zapisom.'),
    text('paragraph', 'Ova greška je toliko česta da ima sopstveno ime u bezbednosnoj literaturi — IDOR (Insecure Direct Object Reference) — i pojavljuje se čak i u sistemima koji imaju solidnu autentikaciju i uredan RBAC iz prethodne vežbe. Razlog je jednostavan: RBAC odgovara na pitanje "da li korisnik sme da čita porudžbine uopšte", a ne na pitanje "da li sme da čita baš OVU porudžbinu". Object-level autorizacija postoji da odgovori na to drugo pitanje.'),
    diagram('Od zahteva do audit zapisa', [
      ['Autentikovan korisnik', 'identitet je potvrđen', 'slate'],
      ['Zahtev za resurs', 'konkretan objekat', 'cyan'],
      ['Odluka o pristupu', 'ownership + scope + policy', 'blue'],
      ['Dozvola / odbijanje', 'kontrolisan ishod', 'amber'],
      ['Audit', 'sledljiv, nepromenljiv zapis', 'emerald'],
    ], 'Svaka odluka o pristupu — dozvoljena ili odbijena — mora ostaviti proverljiv trag.'),
    callout('warning', 'Najčešća greška u praksi', 'Endpoint koji proverava samo ulogu korisnika ("da li je ulogovan i da li ima rolu Employee"), a ne proverava da li korisnik zaista poseduje ili sme da vidi TAJ konkretan zapis, ostavlja sistem otvorenim za horizontalni pristup tuđim podacima.'),
  ]),

  page('2.1. Object-level authorization i vlasništvo resursa', [
    text('h2', '2.1. Object-level authorization i vlasništvo resursa (R1-06)'),
    text('paragraph', 'Object-level authorization proverava da li subjekt sme da izvrši konkretnu akciju nad konkretnim objektom — ne nad tipom endpoint-a uopšteno. Ova provera se izvršava nakon autentikacije i osnovne RBAC provere, kao dodatni, nezaobilazan sloj.'),
    text('paragraph', 'U praksi se ova provera najlakše "zaboravi" tamo gde je implementacija izgledala trivijalno: endpoint tipa GET /api/resources/{id} deluje kao obično čitanje po ključu, pa se lako napiše kao "pronađi po ID-u i vrati", bez ijedne dodatne linije koja proverava kome taj ID pripada. Upravo takvi, naizgled bezopasni endpoint-i su najčešća meta ručnog testiranja tokom code review-a.'),
    table(['Element', 'Uloga'], [
      ['ProtectedResource', 'Konkretan objekat nad kojim se izvršava akcija.'],
      ['ResourceOwner', 'Subjekt ili domen kome resurs pripada.'],
      ['Subject', 'Identitet koji pokušava operaciju.'],
      ['Action', 'Konkretna operacija (read, update, delete, approve...).'],
      ['AccessDecision', 'Konačan, auditovan ishod provere.'],
    ]),
    diagram('Object-level provera u dva koraka', [
      ['RBAC provera', 'da li uloga uopšte sme akciju', 'slate'],
      ['Object-level provera', 'da li sme baš nad ovim objektom', 'cyan'],
      ['AccessDecision', 'allow ili deny sa razlogom', 'blue'],
      ['Audit', 'ishod se beleži bez obzira na rezultat', 'emerald'],
    ], 'RBAC i object-level provera su dva odvojena, sekvencijalna koraka — nijedan ne zamenjuje drugi.'),
    code('csharp', `public async Task<AccessDecision> AuthorizeAsync(Identity subject, Guid resourceId, string action)
{
    var resource = await _resources.FindAsync(resourceId);
    if (resource is null)
    {
        // Isti ishod kao za nedozvoljen pristup - ne otkrivamo da li resurs postoji.
        await _audit.RecordAsync(SecurityEventType.AccessDenied, subject.Id, resourceId, action);
        return AccessDecision.Deny();
    }

    var isOwner = resource.OwnerId == subject.Id;
    var hasScopedPermission = _permissions.Has(subject, action, resource.Domain);

    if (!isOwner && !hasScopedPermission)
    {
        await _audit.RecordAsync(SecurityEventType.AccessDenied, subject.Id, resourceId, action);
        return AccessDecision.Deny();
    }

    await _audit.RecordAsync(SecurityEventType.AccessGranted, subject.Id, resourceId, action);
    return AccessDecision.Allow();
}`, 'Provera vlasništva i scope-a pre svake operacije nad konkretnim objektom'),
    callout('note', 'Poznavanje ID-a nije pravo pristupa', 'To što korisnik zna ili pogodi GUID/ID resursa (npr. iz URL-a) nikada ne sme samo po sebi predstavljati dozvolu za pristup. UI filter koji "sakriva" tuđe resurse ne zamenjuje ovu server-side proveru.'),
  ]),

  page('2.2. Negativni scenario — horizontalni pristup', [
    text('h2', '2.2. Negativni scenario — horizontalni pristup tuđem resursu'),
    text('paragraph', 'Horizontalni pristup (IDOR) nastaje kada korisnik A, izmenom identifikatora u zahtevu, uspe da pristupi resursu koji pripada korisniku B, iako oba korisnika imaju istu ulogu i istu vrstu pristupa svojim sopstvenim podacima. Ovaj scenario je toliko čest da svaka projektna celina mora imati barem jedan ovakav test, bez obzira na to koliko "očigledna" izgledala implementacija.'),
    table(['Korak', 'Očekivano ponašanje'], [
      ['Korisnik A se autentikuje', 'Uspešna prijava, validna sesija.'],
      ['Korisnik A traži pristup tuđem resursu', 'Sistem proverava vlasništvo, ne samo validnost sesije.'],
      ['Resurs pripada korisniku B', 'Odluka mora biti Deny, bez obzira na to da li A ima istu ulogu kao B.'],
      ['Odgovor klijentu', 'Kontrolisan odgovor (npr. 403) bez otkrivanja detalja o postojanju ili sadržaju resursa.'],
    ]),
    code('csharp', `[Test]
public async Task Should_Deny_Access_When_User_Requests_Foreign_Resource()
{
    var owner = await CreateIdentityAsync("owner@example.test");
    var attacker = await CreateIdentityAsync("attacker@example.test");
    var resource = await CreateResourceOwnedByAsync(owner);

    var decision = await _authorizationService.AuthorizeAsync(attacker, resource.Id, "read");

    Assert.That(decision.IsAllowed, Is.False);
    Assert.That(await _audit.HasDeniedEventFor(attacker.Id, resource.Id), Is.True);
}`, 'Negativni test kao obavezan deo Definition of Done'),
    callout('task', 'Rad na vežbi', 'Za dodeljenu projektnu celinu identifikovati najmanje jedan resurs koji nosi horizontalni rizik. Implementirati object-level proveru i napisati negativan test koji dokazuje da tuđi pristup biva odbijen bez curenja podataka.'),
  ]),

  page('2.3. Klasifikacija podataka i pravila rukovanja', [
    text('h2', '2.3. Klasifikacija podataka i pravila rukovanja (R1-07)'),
    text('paragraph', 'Nisu svi podaci jednako osetljivi. Klasifikacija podataka povezuje nivo osetljivosti sa konkretnim pravilima rukovanja — ko sme da pristupi, koliko dugo se čuvaju i koje dodatne kontrole se primenjuju. Bez eksplicitne klasifikacije, tim se oslanja na intuiciju pojedinca o tome šta je "osetljivo", a intuicija se razlikuje od osobe do osobe.'),
    table(['Nivo', 'Primer'], [
      ['Public', 'Opšte informacije bez uticaja na privatnost ili bezbednost ako procure.'],
      ['Internal', 'Interni operativni podaci namenjeni zaposlenima.'],
      ['Confidential', 'Osetljivi poslovni ili lični podaci sa ograničenim krugom pristupa.'],
      ['Restricted', 'Najosetljiviji podaci; pristup zahteva dodatnu proveru i strog audit.'],
    ]),
    diagram('Klasifikacija utiče na tri odluke', [
      ['Klasifikacija', 'nivo osetljivosti podatka', 'slate'],
      ['Pristup', 'ko sme da vidi/menja', 'cyan'],
      ['Retention', 'koliko dugo se čuva', 'blue'],
      ['Dodatna kontrola', 'MFA, audit, DLP...', 'emerald'],
    ], 'Ista klasifikacija se koristi kao ulaz u više nezavisnih odluka kroz ceo sistem.'),
    callout('warning', 'Niži nivo ne sme tiho prepisati viši', 'Ako je resurs jednom klasifikovan kao Confidential, kasnija izmena koja ga svodi na Internal mora biti eksplicitna, obrazložena i odobrena operacija — ne slučajna posledica podrazumevane vrednosti u kodu.'),
    callout('task', 'Rad na vežbi', 'Dodeliti klasifikaciju najmanje jednom tipu resursa u projektnoj celini. Implementirati pravilo da promena klasifikacije na niži nivo zahteva eksplicitnu potvrdu i ostavlja audit zapis.'),
  ]),

  page('2.4. Audit log i bezbednosni događaji', [
    text('h2', '2.4. Audit log i bezbednosni događaji (R1-09)'),
    text('paragraph', 'Audit log je sledljiva evidencija značajnih bezbednosnih i administrativnih aktivnosti. Njegova vrednost zavisi od dve osobine koje se ne smeju narušiti ni zarad performansi ni zarad jednostavnosti implementacije: nepromenljivost nakon upisa i jasno razlikovanje uspešnog od neuspešnog ishoda.'),
    text('paragraph', 'Vredi razmisliti o audit logu kao o svedoku, ne kao o statistici. Statistika (broj prijava dnevno) toleriše približne vrednosti i povremeni gubitak podataka. Svedok mora biti pouzdan u svakom pojedinačnom slučaju — kada nastane spor oko toga da li se nešto desilo, audit zapis je taj koji daje odgovor, a ne sećanje učesnika.'),
    table(['Polje', 'Svrha'], [
      ['Actor', 'Ko je izveo akciju (identitet ili servis).'],
      ['Action', 'Koja operacija je izvršena ili pokušana.'],
      ['Target', 'Nad kojim resursom ili entitetom.'],
      ['Outcome', 'Uspeh ili neuspeh, sa kontrolisanim nivoom detalja.'],
      ['CorrelationId', 'Veza sa ostalim događajima istog toka.'],
    ]),
    code('csharp', `public sealed record SecurityEvent(
    Guid Id,
    DateTimeOffset OccurredAt,
    string Actor,
    string Action,
    string Target,
    SecurityOutcome Outcome,
    string CorrelationId);

// Audit repozitorijum eksplicitno ne izlaže Update ili Delete operacije.
public interface IAuditLog
{
    Task AppendAsync(SecurityEvent securityEvent);
    Task<IReadOnlyList<SecurityEvent>> QueryAsync(AuditQuery query);
}`, 'Audit log kao append-only model — namerno bez Update/Delete operacija'),
    callout('warning', 'Tajne se ne zapisuju u audit', 'Lozinke, token vrednosti i drugi osetljivi podaci se nikada ne upisuju u audit zapis, čak ni radi "lakšeg debagovanja". Audit beleži da se nešto desilo, a ne sadržaj tajne koja je pritom korišćena.'),
    callout('task', 'Rad na vežbi', 'Implementirati append-only audit log za najmanje dve značajne operacije projektne celine (npr. promena privilegije i pristup osetljivom resursu). Napisati test koji pokušava izmenu postojećeg zapisa i očekuje da operacija ne postoji ili je odbijena.'),
  ]),

  page('2.5. Druga projektna kontrolna tačka P2', [
    text('h2', '2.5. Projektna kontrolna tačka P2 — object-authorization i audit'),
    text('paragraph', 'Do druge kontrolne tačke tim treba da pokaže da autentikovan korisnik ne dobija automatski pristup svakom resursu, i da svaka bezbednosno značajna odluka ostavlja sledljiv, nepromenljiv trag.'),
    list([
      'RBAC i object-level authorization su implementirani i pristup se proverava serverski.',
      'Postoji najmanje jedan negativan test u kome korisnik pokušava pristup tuđem resursu i dobija kontrolisan odgovor bez curenja podataka.',
      'Klasifikacija podataka je dodeljena najmanje jednom tipu resursa i utiče na dozvoljeno rukovanje.',
      'Audit log beleži uspešan i neuspešan pokušaj pristupa sa jasnim actor/action/target/outcome poljima.',
      'Audit zapis se ne može izmeniti nakon upisa; tim ume da objasni kako je to obezbeđeno.',
      'Tajne i lozinke se ne pojavljuju u log zapisima — provereno ručno i automatizovanim testom.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da implementira i testira object-level autorizaciju nezavisnu od role-based provere, poveže je sa klasifikacijom podataka i zatvori ceo tok neizbrisivim audit zapisom.'),
  ]),
]
