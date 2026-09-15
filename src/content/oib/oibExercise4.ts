import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise4 = (): DocumentPage[] => [
  page('Vežba 4 — Zaokruživanje R1 nivoa i manual-core-baseline', [
    text('h1', 'Vežba 4 — Zaokruživanje R1 nivoa i manual-core-baseline'),
    text('paragraph', 'Ova vežba zatvara osnovni (R1) nivo sistema i uvodi granicu koja razdvaja dve faze kursa. Do sada je tim samostalno projektovao identitet, autorizaciju, politike i observability. Od sledeće vežbe AI dobija veću ulogu u razvoju — ali tek pošto sistem poseduje dovoljno testova i strukture da se svaki predlog može nezavisno proveriti.'),
    text('paragraph', 'Vredi objasniti zašto se ova granica postavlja baš ovde, a ne na početku ili kraju kursa. Prerano uvođenje AI podrške, pre nego što tim uopšte razume sopstveni domen, dovodi do toga da se predlog prihvata "jer izgleda razumno" bez sposobnosti da se proveri. Prekasno uvođenje, s druge strane, ostavlja premalo vremena da se agentski tok rada uopšte osmisli i isproba. Sredina semestra — nakon što je jezgro poznato i testirano — je trenutak kada AI predlog postaje moguće nezavisno verifikovati postojećom mrežom testova.'),
    diagram('Zaokruživanje osnovnog nivoa', [
      ['Asset inventory', 'ko poseduje šta', 'slate'],
      ['Crypto inventory', 'kriptografska sredstva', 'cyan'],
      ['Exposure registry', 'spoljna izloženost', 'blue'],
      ['Retention/disposal', 'životni ciklus podataka', 'amber'],
      ['manual-core-baseline', 'testirana granica', 'emerald'],
    ], 'R1 nivo mora biti stabilan i testiran pre nego što AI dobije veću ulogu u razvoju.'),
  ]),

  page('4.1. Asset inventory i kritičnost resursa', [
    text('h2', '4.1. Asset inventory i kritičnost resursa (R1-02)'),
    text('paragraph', 'Asset inventory je centralna evidencija aplikacija, servisa, uređaja, podataka i drugih informacionih resursa. Skoro svaka druga bezbednosna odluka u sistemu — od autorizacije do risk registra — na kraju referiše konkretan asset, pa je ova evidencija preduslov, ne opciona funkcionalnost.'),
    table(['Element', 'Napomena'], [
      ['Asset', 'Jedinstveno identifikovan resurs (aplikacija, servis, dataset, uređaj).'],
      ['AssetOwner', 'Odgovorna osoba ili tim.'],
      ['Criticality', 'Eksplicitna oznaka poslovnog značaja.'],
      ['LifecycleStatus', 'Active / Deprecated / Decommissioned.'],
    ]),
    diagram('Asset kao referentna tačka', [
      ['Asset', 'jedinstven identitet resursa', 'slate'],
      ['Autorizacija', 'ko sme da pristupi', 'cyan'],
      ['Risk register', 'koja pretnja ga pogađa', 'blue'],
      ['Exposure/Crypto', 'kako je izložen i zaštićen', 'emerald'],
    ], 'Gotovo svaka kasnija bezbednosna evidencija (Vežbe 5-8) referiše konkretan asset iz ovog inventara.'),
    callout('note', 'Dekomisioniran asset ostaje u istoriji', 'Uklanjanje asset-a iz aktivne upotrebe ne znači brisanje iz sistema — istorijski podaci (ko ga je koristio, koje incidente je imao) moraju ostati dostupni radi sledljivosti.'),
    callout('task', 'Rad na vežbi', 'Implementirati registraciju asset-a sa vlasnikom i kritičnošću za projektnu celinu. Napisati test koji dokazuje da dekomisioniran asset ostaje pretraživ u istoriji, ali se ne prikazuje kao aktivan.'),
  ]),

  page('4.2. Cryptographic asset inventory', [
    text('h2', '4.2. Cryptographic asset inventory (R1-17)'),
    text('paragraph', 'Kriptografski inventar evidentira reference na ključeve, sertifikate i tajne — algoritam, dužinu, status, vlasnika — bez čuvanja samog osetljivog materijala. Ovo razdvajanje je namerno: inventar odgovara na pitanje "šta postoji i da li je važeće", a ne "koja je tačna vrednost".'),
    code('csharp', `public sealed class CryptoAsset
{
    public Guid Id { get; init; }
    public string Purpose { get; init; } = string.Empty;
    public string Algorithm { get; init; } = string.Empty;
    public int KeyLengthBits { get; init; }
    public CryptoAssetStatus Status { get; private set; }
    public DateTimeOffset? ExpiresAt { get; init; }
    // Namerno: NEMA polja za privatni ključ ili plaintext secret.

    public void MarkCompromised() => Status = CryptoAssetStatus.Compromised;
    public void MarkRevoked() => Status = CryptoAssetStatus.Revoked;
}`, 'Inventar referencira kriptografsko sredstvo, ne čuva njegov tajni sadržaj'),
    callout('warning', 'Zabranjen algoritam mora proizvesti nalaz', 'Ako politika zabranjuje npr. SHA-1 ili ključeve kraće od 2048 bita, svako aktivno sredstvo koje krši to pravilo mora biti automatski prijavljeno kao nalaz, ne otkriveno tek ručnim pregledom.'),
    callout('task', 'Rad na vežbi', 'Registrovati najmanje dva kriptografska sredstva relevantna za projektnu celinu (npr. potpisni ključ, TLS sertifikat). Implementirati proveru koja prijavljuje sredstvo sa zabranjenim algoritmom ili isteklim rokom.'),
  ]),

  page('4.3. External exposure i attack-surface registry', [
    text('h2', '4.3. External exposure i attack-surface registry (R1-18)'),
    text('paragraph', 'Evidencija spolja izloženih endpoint-a, portova i domena pomaže timu da razume stvarnu površinu napada organizacije — uključujući izloženost koja nije bila planirana ili je zaboravljena nakon eksperimenta. U praksi se veliki broj bezbednosnih incidenata ne dešava kroz sofisticiran napad, već kroz zaboravljen test endpoint koji je ostao dostupan sa interneta.'),
    table(['Element', 'Napomena'], [
      ['Exposure', 'Spolja dostupan endpoint, port ili domen.'],
      ['ExposureOwner', 'Odgovorna osoba za taj exposure.'],
      ['ExposureStatus', 'Approved / Temporary / Unknown.'],
    ]),
    callout('note', 'Nepoznat exposure nije odmah ranjivost', 'Exposure bez poznatog vlasnika ili svrhe se označava za proveru, ne automatski proglašava propustom — ali mora biti vidljiv, ne prećutan.'),
    callout('task', 'Rad na vežbi', 'Registrovati simulirani exposure za servis iz projektne celine sa vlasnikom i statusom. Implementirati periodičnu potvrdu da je exposure i dalje potreban.'),
  ]),

  page('4.4. Data retention, disposal i data-flow registry', [
    text('h2', '4.4. Data retention, disposal i data-flow registry (R1-15, R1-20)'),
    text('paragraph', 'Podaci se ne čuvaju zauvek "za svaki slučaj". Retention politika određuje koliko dugo se klasa podataka čuva, a data-flow registry prati kojim putem ti podaci prolaze kroz sistem i preko kojih trust granica.'),
    table(['Element', 'Napomena'], [
      ['RetentionPolicy', 'Verzionisano pravilo trajanja čuvanja po klasifikaciji.'],
      ['LegalHold', 'Privremena zabrana uklanjanja zbog pravnog ili operativnog razloga.'],
      ['DataFlow', 'Tok podataka između izvora i odredišta.'],
      ['DisposalEvidence', 'Dokaz da je uklanjanje sprovedeno prema politici.'],
    ]),
    diagram('Od isteka do bezbednog uklanjanja', [
      ['Retention period ističe', 'planirani datum', 'slate'],
      ['Provera holda', 'da li postoji zabrana', 'amber'],
      ['Disposal', 'kontrolisano uklanjanje', 'cyan'],
      ['Evidence', 'dokaz da je sprovedeno', 'emerald'],
    ], 'Aktivan legal ili operational hold uvek ima prioritet nad automatskim istekom perioda.'),
    callout('warning', 'Aktivan hold blokira disposal', 'Ako je nad podatkom postavljen legal ili operational hold, isti se ne sme ukloniti čak i ako je retention period istekao — hold uvek ima prioritet nad automatskim brisanjem.'),
    callout('task', 'Rad na vežbi', 'Definisati retention pravilo za jednu klasu podataka projektne celine. Implementirati proveru da aktivan hold sprečava disposal, i evidentirati najmanje jedan data flow koji prenosi tu klasu podataka.'),
  ]),

  page('4.5. Threat model i priprema baseline-a', [
    text('h2', '4.5. Threat model kao preduslov za baseline'),
    text('paragraph', 'Pre postavljanja `manual-core-baseline` oznake, svaki tim priprema kratak threat model svoje projektne celine — dovoljno da jasno poveže asset, pretnju, kontrolu, test i dokaz.'),
    code('text', `Asset -> Threat / misuse -> Security Requirement -> Control -> Security Test -> Evidence`, 'Minimalni lanac koji svaka celina mora moći da pokaže'),
    table(['Element threat modela', 'Primer'], [
      ['Asset', 'Kriptografski ključ za potpisivanje audit zapisa.'],
      ['Threat', 'Kompromitovan ključ omogućava falsifikovanje audit istorije.'],
      ['Control', 'Rotacija ključa i ograničen pristup privatnom materijalu.'],
      ['Test', 'Negativan test da stari ključ ne validira nove zapise nakon rotacije.'],
      ['Evidence', 'Rezultat testa i audit zapis o izvršenoj rotaciji.'],
    ]),
    callout('task', 'Rad na vežbi', 'Napisati threat model za dodeljenu projektnu celinu sa najmanje dva threat/misuse scenarija i pripadajućim kontrolama i testovima.'),
  ]),

  page('4.6. Testovi kao preduslov za AI podršku', [
    text('h2', '4.6. NUnit/Moq testovi nad ključnim use-case-ovima'),
    text('paragraph', 'Pre uvođenja veće AI podrške u razvoj, ključni use-case-ovi moraju imati automatizovane testove — pozitivne i negativne. Ovo nije formalnost: to je mreža koja omogućava da se svaki budući predlog (ljudski ili AI-generisan) nezavisno proveri.'),
    code('csharp', `[TestFixture]
public class ObjectAuthorizationTests
{
    [Test]
    public async Task Owner_Can_Access_Own_Resource() { /* ... */ }

    [Test]
    public async Task NonOwner_Without_Scope_Is_Denied() { /* ... */ }

    [Test]
    public async Task Denied_Access_Produces_Audit_Event() { /* ... */ }
}`, 'Struktura testova koja pokriva uspešan tok, negativan tok i audit posledicu'),
    list([
      'Moq se koristi samo za promenljive spoljne zavisnosti (npr. simulator), ne za zamenu poslovne logike koja se testira.',
      'Pokrivenost se pregleda ručno — broj procenata sam po sebi ne dokazuje kvalitet testova.',
      'Bug se prvo reprodukuje testom, zatim ispravlja — regresivni test ostaje trajno u paketu.',
    ]),
  ]),

  page('4.7. Četvrta projektna kontrolna tačka P4', [
    text('h2', '4.7. Projektna kontrolna tačka P4 — R1-baseline i manual-core-baseline'),
    text('paragraph', 'Ova kontrolna tačka zaokružuje osnovni (R1) nivo sistema i razdvaja dve faze kursa. Sistem već poseduje dovoljno testova i strukture da AI predlozi u narednim vežbama mogu biti nezavisno provereni.'),
    list([
      'Asset inventory evidentira kritičnost i vlasnika za svaki registrovan resurs.',
      'Najmanje dve dodatne R1 celine iz tima imaju izvršive use-case-ove.',
      'Ključni bezbednosni use-case-ovi imaju testove za uspešne i negativne scenarije.',
      'Izveštaj o pokrivenosti je pregledan; najmanje jedna nepokrivena rizična grana je obrazložena ili pokrivena testom.',
      'Stabilna verzija R1 jezgra označena je Git tag-om `manual-core-baseline`.',
      'Tim priprema kratak threat model (asset → threat → control → test → evidence) za svoju celinu.',
    ]),
    code('bash', `dotnet test
git tag -a manual-core-baseline -m "R1 core: identity, authz, policy, audit, asset inventory"
git push origin manual-core-baseline`, 'Postavljanje granice pre AI faze razvoja'),
    callout('success', 'Ishod vežbe', 'Student ume da zaokruži osnovni bezbednosni model sistema, poveže ga sa testovima i postavi proverljivu graničnu tačku pre uvođenja AI podrške u razvoj.'),
  ]),
]
