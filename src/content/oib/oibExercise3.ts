import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise3 = (): DocumentPage[] => [
  page('Vežba 3 — Politike, baseline i observability', [
    text('h1', 'Vežba 3 — Politike, baseline i observability'),
    text('paragraph', 'Bezbednosna pravila razbacana ad-hoc kroz kod — provera scattered po kontrolerima, magic string vrednosti, konfiguracija zakucana u kod — nisu ni objašnjiva ni testabilna. U ovoj vežbi bezbednosna pravila podižemo na nivo eksplicitnog, verzionisanog domenskog koncepta: policy katalog, konfiguracioni baseline, katalog kontrola i osnovna observability koja sve to povezuje.'),
    text('paragraph', 'Razlog zašto se ovoj temi posvećuje cela vežba, umesto da se politike jednostavno "primene u kodu", leži u tome što se bezbednosna pravila menjaju tokom vremena — nova pretnja, nova regulativa, novo iskustvo iz incidenta. Sistem koji ne razlikuje pravilo od njegove verzije ne može pouzdano da odgovori na pitanje "koje je pravilo važilo kada se ovo desilo", što je upravo pitanje koje audit i istraga postavljaju najčešće.'),
    diagram('Od pravila do dokaza', [
      ['Policy', 'eksplicitno, verzionisano pravilo', 'slate'],
      ['Baseline', 'minimalni konfiguracioni zahtev', 'cyan'],
      ['Control', 'katalogizovana kontrola sa vlasnikom', 'blue'],
      ['Observability', 'correlation kroz komponente', 'amber'],
      ['Trust boundary', 'evidentirana granica poverenja', 'emerald'],
    ], 'Politika bez verzije, kontrola bez vlasnika i log bez korelacije ne mogu se smatrati dokazanom bezbednošću.'),
    callout('info', 'ADR za bezbednosne odluke', 'Svaka bezbednosno kritična odluka (npr. izbor algoritma za rotaciju, pravilo prioriteta politika) dokumentuje se kratkim ADR zapisom: kontekst, odluka, alternative, posledice.'),
  ]),

  page('3.1. Security policy katalog', [
    text('h2', '3.1. Security policy katalog (R1-08)'),
    text('paragraph', 'Politika je centralizovano, imenovano pravilo sa jasnim opsegom primene. Ono što politiku čini korisnom nije samo njen tekst, već mogućnost da se svaki istorijski bezbednosni događaj poveže sa verzijom politike koja je u tom trenutku bila na snazi.'),
    table(['Element', 'Napomena'], [
      ['SecurityPolicy', 'Imenovano pravilo (npr. "Lozinka mora imati najmanje 12 karaktera").'],
      ['PolicyVersion', 'Konkretna, nepromenljiva verzija sadržaja politike.'],
      ['PolicyScope', 'Domen, asset tip ili organizacija na koju se politika odnosi.'],
      ['EffectivePeriod', 'Period važenja verzije politike.'],
    ]),
    diagram('Verzionisanje politike kroz vreme', [
      ['v1 — aktivna', 'važi od T0 do T1', 'blue'],
      ['v2 — aktivna', 'važi od T1 do T2', 'cyan'],
      ['v3 — trenutno aktivna', 'važi od T2 nadalje', 'emerald'],
    ], 'Događaj iz perioda T0-T1 se uvek povezuje sa v1, bez obzira na to koja je verzija aktivna danas.'),
    callout('warning', 'Objavljena politika se ne menja u mestu', 'Kada je verzija politike jednom aktivirana i korišćena u odlukama, njen sadržaj se više ne sme tiho izmeniti. Promena zahteva novu verziju — stara ostaje dostupna radi rekonstrukcije prošlih odluka.'),
    code('csharp', `public sealed class PolicyVersion
{
    public Guid PolicyId { get; init; }
    public int Version { get; init; }
    public string Content { get; init; } = string.Empty;
    public DateTimeOffset EffectiveFrom { get; init; }
    public DateTimeOffset? EffectiveTo { get; private set; }

    public void Archive(DateTimeOffset at) => EffectiveTo = at;
}`, 'Verzija politike je nepromenljiva nakon objave; arhiviranje samo zatvara period važenja'),
    callout('task', 'Rad na vežbi', 'Implementirati SecurityPolicy sa verzionisanjem. Napisati test koji dokazuje da se stara verzija ne menja prilikom aktivacije nove, i da se istorijski događaj i dalje može povezati sa verzijom koja je tada važila.'),
  ]),

  page('3.2. Secure configuration baseline', [
    text('h2', '3.2. Secure configuration baseline (R1-10)'),
    text('paragraph', 'Baseline definiše minimalne bezbednosne konfiguracione zahteve za tip asset-a — na primer, da li je enkripcija u mirovanju uključena, da li je port ograničen, da li je logovanje aktivno. Bez eksplicitnog baseline-a, "bezbedna konfiguracija" ostaje neproverljiva želja, a ne stanje sistema.'),
    text('paragraph', 'Vredi primetiti da baseline i policy katalog rešavaju srodan, ali različit problem. Politika kaže "šta sme, a šta ne sme" na nivou poslovnog pravila (ko sme da pristupi Confidential podatku). Baseline kaže "kako mora biti podešen" na nivou tehničke konfiguracije (da li je TLS uključen). Oba koncepta se oslanjaju na verzionisanje iz istog razloga — da bi prošla odluka ostala objašnjiva.'),
    table(['Element', 'Napomena'], [
      ['SecurityBaseline', 'Verzionisan skup pravila za tip asset-a.'],
      ['ConfigurationRule', 'Pojedinačan proverljiv zahtev (npr. "TLS 1.2 ili viši").'],
      ['ComplianceStatus', 'Rezultat provere konkretnog asset-a prema baseline-u.'],
      ['ExceptionRef', 'Referenca na odobreni, vremenski ograničen izuzetak.'],
    ]),
    code('csharp', `public sealed record ConfigurationCheckResult(string RuleId, bool Compliant, string? Detail);

public IReadOnlyList<ConfigurationCheckResult> Evaluate(AssetConfiguration config, SecurityBaseline baseline)
{
    return baseline.Rules
        .Select(rule => new ConfigurationCheckResult(rule.Id, rule.IsSatisfiedBy(config), rule.IsSatisfiedBy(config) ? null : rule.FailureDetail))
        .ToList();
}`, 'Evaluacija konfiguracije prema aktivnom baseline-u vraća proverljiv, po-pravilu rezultat'),
    callout('note', 'Tajna nije konfiguraciona vrednost', 'Baseline pravilo koje proverava da li je connection string ispravno konfigurisan ne sme sadržati ili logovati stvarnu vrednost connection stringa — samo rezultat provere.'),
    callout('task', 'Rad na vežbi', 'Definisati baseline sa najmanje tri pravila za jedan asset tip iz projektne celine. Implementirati proveru koja vraća listu ComplianceStatus rezultata i evidentira odstupanje.'),
  ]),

  page('3.3. Katalog bezbednosnih kontrola', [
    text('h2', '3.3. Katalog bezbednosnih kontrola i vlasništvo (R1-16)'),
    text('paragraph', 'Katalog kontrola centralizuje tehničke i procesne bezbednosne mere, njihove vlasnike, očekivane dokaze i status implementacije. Kontrola bez vlasnika nije "u redu zato što još nije bio problem" — ona je governance gap koji mora biti vidljiv, ne skriven.'),
    table(['Element', 'Napomena'], [
      ['SecurityControl', 'Imenovana kontrola sa jasnim ciljem.'],
      ['ControlOwner', 'Osoba ili tim odgovoran za efektivnost kontrole.'],
      ['ImplementationStatus', 'Planned / Implemented / Verified / Retired.'],
      ['EvidenceRequirement', 'Očekivani tip dokaza da kontrola zaista radi.'],
    ]),
    diagram('Od kontrole do dokazane efektivnosti', [
      ['Planned', 'kontrola je predviđena', 'slate'],
      ['Implemented', 'kod postoji', 'cyan'],
      ['Verified', 'test/evidence potvrđuje rad', 'blue'],
      ['Retired', 'povučena, ostaje u istoriji', 'rose'],
    ], 'Samo status Verified se oslanja na stvarni dokaz, ne na tvrdnju da je kod napisan.'),
    callout('warning', 'Postojanje zapisa nije dokaz efektivnosti', 'Kontrola registrovana u katalogu sa statusom "Implemented" ali bez ijednog povezanog testa ili evidence zapisa ne sme se tretirati kao dokazano efektivna.'),
    callout('task', 'Rad na vežbi', 'Registrovati najmanje tri bezbednosne kontrole relevantne za projektnu celinu, sa vlasnicima i očekivanim dokazom. Povezati najmanje jednu kontrolu sa konkretnim automatizovanim testom kao dokazom.'),
  ]),

  page('3.4. Bezbednosna observability osnova', [
    text('h2', '3.4. Bezbednosna observability osnova (R1-13)'),
    text('paragraph', 'Correlation id povezuje log zapise nastale u različitim komponentama tokom obrade jednog zahteva ili toka. Bez toga, rekonstrukcija incidenta kroz više servisa svodi se na nagađanje po vremenskim pečatima — pristup koji brzo postaje neupotrebljiv čim dva servisa rade paralelno ili sat jednog servera nije savršeno sinhronizovan.'),
    code('csharp', `public sealed class SecurityLogContext
{
    private static readonly AsyncLocal<string?> _correlationId = new();
    public static string CorrelationId => _correlationId.Value ??= Guid.NewGuid().ToString("N");

    public static void Propagate(string incomingCorrelationId) => _correlationId.Value = incomingCorrelationId;
}`, 'Correlation id se propagira kroz ceo tok obrade zahteva'),
    table(['Pravilo', 'Razlog'], [
      ['Logovi ne sadrže lozinke ni token vrednosti', 'Log sistem često ima širi krug pristupa od same aplikacije.'],
      ['Security metrika ima jasno definisano značenje', 'Broj bez definicije ("auth_failures") ne govori ništa o pragu ili očekivanoj vrednosti.'],
      ['Correlation nije mehanizam autorizacije', 'Isti correlation id ne sme se koristiti kao dokaz prava pristupa.'],
    ]),
    callout('task', 'Rad na vežbi', 'Implementirati propagaciju correlation id-a kroz najmanje dva sloja aplikacije (npr. API → Application → Audit). Dodati jednu security metriku sa jasno definisanim značenjem.'),
  ]),

  page('3.5. Security zone i trust-boundary registry', [
    text('h2', '3.5. Security zone i trust-boundary registry (R1-14)'),
    text('paragraph', 'Trust granica označava mesto gde se nivo poverenja menja — na primer, prelazak sa javnog interneta na internu mrežu, ili sa jednog bezbednosnog domena na drugi. Eksplicitna evidencija ovih granica je preduslov za doslednu threat-model analizu, ne detalj koji se može preskočiti.'),
    table(['Element', 'Napomena'], [
      ['TrustZone', 'Imenovana zona sa definisanim nivoom poverenja.'],
      ['TrustBoundary', 'Granica između dve zone preko koje prelazi tok podataka.'],
      ['DataFlow', 'Konkretan tok koji prelazi granicu.'],
      ['EntryPoint', 'Tačka ulaska toka u zonu.'],
    ]),
    diagram('Prelazak trust granice', [
      ['Zona niskog poverenja', 'javni internet, spoljni klijent', 'rose'],
      ['Trust boundary', 'eksplicitna, evidentirana granica', 'amber'],
      ['Zona visokog poverenja', 'interni servis, baza podataka', 'emerald'],
    ], 'Svaki prelazak granice zahteva eksplicitnu validaciju i autorizaciju, bez obzira na to koliko "pouzdano" izgleda pošiljalac.'),
    callout('warning', 'Spoljni izvor ne dobija implicitno poverenje', 'Podatak koji stiže iz zone nižeg poverenja (npr. javni API) mora proći kroz eksplicitnu validaciju i autorizaciju pre nego što uđe u zonu višeg poverenja.'),
    callout('task', 'Rad na vežbi', 'Registrovati najmanje dve trust zone relevantne za projektnu celinu i evidentirati najmanje jedan data flow koji prelazi granicu između njih, sa jasnim vlasnikom crossing-a.'),
  ]),

  page('3.6. Treća projektna kontrolna tačka P3', [
    text('h2', '3.6. Projektna kontrolna tačka P3 — politike, baseline i observability'),
    text('paragraph', 'Treća kontrolna tačka proverava da bezbednosna pravila nisu razbacana ad-hoc kroz kod, već postoje kao eksplicitan, verzionisan katalog koji se može povezati sa konkretnim asset-om i proveriti automatizovanim testom.'),
    list([
      'Security policy katalog podržava verzionisanje i aktivaciju nove verzije bez menjanja objavljene u mestu.',
      'Secure configuration baseline je povezan sa najmanje jednim asset tipom i detektuje odstupanje od očekivane konfiguracije.',
      'Katalog bezbednosnih kontrola ima najmanje tri registrovane kontrole sa vlasnicima.',
      'Correlation id se propagira kroz najmanje jedan tok i povezuje log zapise iz više komponenti.',
      'Trust-boundary registry evidentira najmanje jedan crossing sa jasnim izvorom i odredištem.',
      'Tim može da objasni koje pravilo prioriteta se primenjuje kada su dve politike u konfliktu.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da modeluje bezbednosnu politiku, konfiguracioni baseline i katalog kontrola kao eksplicitne, verzionisane koncepte povezane sledljivim, korelisanim logom.'),
  ]),
]
