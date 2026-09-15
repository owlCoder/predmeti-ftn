import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise5 = (): DocumentPage[] => [
  page('Vežba 5 — MFA, sesije i privilegovan pristup', [
    text('h1', 'Vežba 5 — MFA, sesije i privilegovan pristup'),
    text('paragraph', 'Od ove vežbe sistem ulazi u operativni (R2) nivo. Osnovna autentikacija iz Vežbe 1 potvrđuje identitet jednom, na početku sesije — ali rizične i privilegovane operacije zahtevaju dodatnu, aktivnu potvrdu, a sam pristup mora biti vremenski i obimom ograničen, ne trajan podrazumevani status.'),
    text('paragraph', 'Razlog za ovu dodatnu potvrdu nije nepoverenje prema korisniku koji se već prijavio, već ograničavanje posledica ako je sesija ili token na neki način ukraden nakon prijave. Sesija otvorena na jutarnjoj prijavi ne treba automatski da nosi isti nivo poverenja šest sati kasnije, kada korisnik pokušava da obriše tuđ nalog ili odobri veliku transakciju.'),
    diagram('Od prijave do privremene privilegije', [
      ['Osnovna prijava', 'assurance nivo 1', 'slate'],
      ['MFA / step-up', 'dodatna potvrda', 'cyan'],
      ['Sesija', 'vremenski ograničena', 'blue'],
      ['JIT privilegija', 'odobrena i vremenski ograničena', 'amber'],
      ['Automatski istek', 'bez ručnog čišćenja', 'emerald'],
    ], 'Assurance nivo mora odgovarati riziku operacije, a privilegija nikad ne sme postati trajna podrazumevano.'),
  ]),

  page('5.1. Multi-factor i step-up autentikacija', [
    text('h2', '5.1. Multi-factor i step-up autentikacija (R2-01)'),
    text('paragraph', 'Step-up autentikacija zahteva dodatni faktor pre osetljive operacije, čak i ako je korisnik već prijavljen. Challenge mora imati kratak vek trajanja i ne sme biti ponovo iskorišćen (replay).'),
    table(['Element', 'Napomena'], [
      ['MfaChallenge', 'Konkretan zahtev za dodatnu potvrdu, sa istekom.'],
      ['Factor', 'Vrsta dodatnog faktora (OTP kroz simulator, itd.).'],
      ['ChallengeStatus', 'Pending / Verified / Expired / Consumed.'],
      ['RiskReason', 'Zašto je step-up zahtevan (privilegovana operacija, novi uređaj...).'],
    ]),
    code('csharp', `public sealed class MfaChallenge
{
    public Guid Id { get; init; }
    public string IdentityId { get; init; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; init; }
    public ChallengeStatus Status { get; private set; } = ChallengeStatus.Pending;

    public bool Verify(string submittedCode, string expectedCode, DateTimeOffset now)
    {
        if (Status != ChallengeStatus.Pending || now > ExpiresAt)
        {
            Status = ChallengeStatus.Expired;
            return false; // Nema drugog pokušaja nad istim challenge-om.
        }
        if (submittedCode != expectedCode) return false;

        Status = ChallengeStatus.Consumed; // Sprečava replay istog challenge-a.
        return true;
    }
}`, 'Challenge se troši nakon uspešne potvrde i ne može biti ponovo iskorišćen'),
    callout('task', 'Rad na vežbi', 'Implementirati MFA challenge kroz OTP simulator sa istekom i zaštitom od replay-a. Napisati test koji dokazuje da se već iskorišćen ili istekao challenge odbija.'),
  ]),

  page('5.2. Sessions, tokeni i revocation', [
    text('h2', '5.2. Sessions, tokeni i revocation (R2-02)'),
    text('paragraph', 'Sesija predstavlja aktivan, vremenski ograničen pristup nakon uspešne autentikacije. Revocation mora biti trenutan i nepovratan — jednom ukinuta sesija se ne sme "reaktivirati" propustom u proveri.'),
    code('csharp', `public async Task<bool> IsSessionValidAsync(string sessionId)
{
    var session = await _sessions.FindAsync(sessionId);
    if (session is null || session.RevokedAt is not null) return false;
    if (session.ExpiresAt < _clock.UtcNow) return false;
    return true;
}

public async Task RevokeAllSessionsAsync(string identityId, DateTimeOffset now)
{
    var active = await _sessions.FindActiveByIdentityAsync(identityId);
    foreach (var session in active) session.Revoke(now);
    await _audit.RecordAsync(SecurityEventType.SessionsRevoked, identityId, active.Count.ToString());
}`, 'Provera sesije mora eksplicitno pokriti revoked i expired slučaj'),
    callout('warning', 'Token vrednosti se ne zapisuju u log', 'Debug log koji ispisuje ceo JWT ili session token "radi lakšeg praćenja" predstavlja isti rizik kao i log sa lozinkom — token je kredencijal.'),
    callout('task', 'Rad na vežbi', 'Implementirati kreiranje, proveru i ukidanje sesije (pojedinačno i svih sesija korisnika). Test: revoked sesija ne sme proći proveru validnosti čak ni pre isteka.'),
  ]),

  page('5.3. Privileged Access i Just-in-Time pristup', [
    text('h2', '5.3. Privileged Access i Just-in-Time pristup (R2-03)'),
    text('paragraph', 'Privilegovan pristup nosi veći rizik od običnog pristupa i zato se ne dodeljuje trajno. Zahtev, odobrenje, aktivacija i istek čine jasan, auditovan životni ciklus.'),
    diagram('Životni ciklus privilegovanog pristupa', [
      ['Requested', 'zahtev sa razlogom', 'slate'],
      ['Approved', 'odobrenje ovlašćenog lica', 'cyan'],
      ['Active', 'privilegija u upotrebi', 'blue'],
      ['Expired / Revoked', 'automatski ili hitno okončano', 'rose'],
    ], 'Privilegija bez isteka je trajan rizik prerušen u privremeno rešenje.'),
    code('csharp', `public sealed class PrivilegeGrant
{
    public string Reason { get; init; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; init; }
    public bool IsRevoked { get; private set; }

    public bool IsActive(DateTimeOffset now) => !IsRevoked && now < ExpiresAt;

    public void Revoke() => IsRevoked = true; // hitno ukidanje, nezavisno od isteka
}`, 'Privilegija je aktivna samo unutar eksplicitnog vremenskog okvira'),
    callout('task', 'Rad na vežbi', 'Implementirati zahtev, odobrenje i automatski istek privilegovanog pristupa za jednu operaciju u projektnoj celini. Test: privilegija se ne može koristiti nakon isteka bez obzira na to da li je neko "zaboravio" da je ručno ukine.'),
  ]),

  page('5.4. Service identities i workload authentication', [
    text('h2', '5.4. Service identities i workload authentication (R2-04)'),
    text('paragraph', 'Kada aplikacije i servisi komuniciraju međusobno, svaki od njih treba sopstveni identitet — ne deljeni ljudski nalog i ne zajednički kredencijal za više nepovezanih servisa.'),
    diagram('Ljudski identitet naspram servisnog', [
      ['Human identity', 'osoba, MFA, sesija', 'blue'],
      ['Service identity', 'servis, kredencijal, scope', 'cyan'],
      ['Minimalan scope', 'samo neophodna prava', 'emerald'],
    ], 'Servisni identitet se rotira i ograničava nezavisno od ljudskih naloga koji njime "upravljaju".'),
    table(['Pravilo', 'Razlog'], [
      ['Ljudski nalog se ne koristi kao servisni identitet', 'Onemogućava jasnu odgovornost i otežava rotaciju.'],
      ['Servis dobija minimalno potreban scope', 'Ograničava štetu u slučaju kompromitacije.'],
      ['Shared credential između servisa nije prihvatljiv', 'Kompromitacija jednog servisa ugrožava sve ostale.'],
    ]),
    callout('task', 'Rad na vežbi', 'Registrovati service identity za jedan interni servis projektne celine sa eksplicitnim, ograničenim scope-om.'),
  ]),

  page('5.5. Secrets management i certificate lifecycle', [
    text('h2', '5.5. Secrets management i certificate lifecycle (R2-05, R2-06)'),
    text('paragraph', 'Tajne (API kredencijali, connection stringovi) i sertifikati prolaze kroz kontrolisan životni ciklus: kreiranje, kontrolisan pristup, rotacija, revocation. Ni u jednom trenutku se ne čuvaju u izvornom kodu.'),
    table(['Element', 'Napomena'], [
      ['Secret / SecretVersion', 'Tajna i njena istorija verzija.'],
      ['RotationPolicy', 'Pravilo koliko često se tajna rotira.'],
      ['Certificate', 'Sertifikat sa periodom važenja i statusom.'],
      ['RevocationStatus', 'Da li je sertifikat ili tajna povučena pre isteka.'],
    ]),
    callout('warning', 'Student ne implementira sopstvenu kriptografiju', 'Izdavanje i validacija sertifikata se oslanjaju na simulator CA i standardne biblioteke platforme — nikad na ručno pisan kriptografski kod.'),
    callout('task', 'Rad na vežbi', 'Implementirati kontrolisan pristup tajni (bez prikazivanja vrednosti korisniku bez potrebnog scope-a) i simulaciju rotacije sertifikata kroz CA simulator, uz test da istekao sertifikat nije važeći.'),
  ]),

  page('5.6. Peta projektna kontrolna tačka P5', [
    text('h2', '5.6. Projektna kontrolna tačka P5 — MFA, sesije i privilegovan pristup'),
    text('paragraph', 'Peta kontrolna tačka uvodi operativni (R2) nivo: dodatnu potvrdu identiteta za rizične operacije, kontrolisan životni ciklus sesija i vremenski ograničen privilegovan pristup umesto trajnih privilegija.'),
    list([
      'MFA/step-up se aktivira za najmanje jednu privilegovanu operaciju i ima kratak vek trajanja challenge-a.',
      'Sessions i revocation omogućavaju ukidanje pojedinačne ili svih sesija korisnika; revoked sesija ne dobija pristup.',
      'Privileged Access / Just-in-Time zahteva razlog, odobrenje i ima automatski istek bez ručnog čišćenja.',
      'Service identity je odvojen od ljudskog naloga i ima minimalno potreban scope.',
      'Najmanje jedan negativan test proverava replay isteklog MFA challenge-a ili korišćenje revoked sesije.',
      'Tim ume da objasni razliku između autentikacije i autorizacije na konkretnom primeru iz svoje celine.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da implementira dodatnu potvrdu identiteta, kontrolisan životni ciklus sesija i vremenski ograničen privilegovan pristup kao deo operativnog bezbednosnog sloja.'),
  ]),
]
