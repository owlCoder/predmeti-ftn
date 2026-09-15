import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise6 = (): DocumentPage[] => [
  page('Vežba 6 — Detekcija, incident i vulnerability tok', [
    text('h1', 'Vežba 6 — Detekcija, incident i vulnerability tok'),
    text('paragraph', 'Bezbednosni događaj sam po sebi nije incident. Između "nešto se desilo" i "moramo da reagujemo" postoji niz odluka — detekcija, triage, eskalacija — koje moraju biti objašnjive i sledljive. U ovoj vežbi taj operativni ciklus gradimo od prvog signala do zatvorenog nalaza.'),
    text('paragraph', 'Tim koji ovaj lanac preskoči i incident otvara direktno na osnovu sirovog loga brzo se sudari sa dva suprotna problema: previše lažnih alarma (svaki neuspeo login postaje "napad") ili prekasno reagovanje (stvaran obrazac potone u šum). Detekcija i triage postoje upravo da ovaj kompromis učine eksplicitnim i podesivim, umesto da zavisi od raspoloženja dežurnog analitičara.'),
    diagram('Od događaja do zatvorenog nalaza', [
      ['Security Event', 'sirov signal', 'slate'],
      ['Detection Rule', 'prepoznat obrazac', 'cyan'],
      ['Alert', 'zahteva pažnju', 'blue'],
      ['Incident', 'potvrđen problem', 'amber'],
      ['Recovery', 'zatvoren uz dokaz', 'emerald'],
    ], 'Svaki korak u lancu je eksplicitna odluka, ne automatska posledica prethodnog.'),
  ]),

  page('6.1. Security detection rules', [
    text('h2', '6.1. Security detection rules (R2-07)'),
    text('paragraph', 'Pravilo detekcije prepoznaje sumnjiv obrazac ili kršenje politike nad bezbednosnim događajima. Da bi bilo korisno, mora biti objašnjivo — analitičar mora moći da razume zašto je signal prepoznat, ne samo da vidi da je alert nastao.'),
    code('csharp', `public sealed class RepeatedFailedLoginRule : IDetectionRule
{
    public string RuleId => "auth.repeated-failed-login";

    public DetectionOutcome Evaluate(IReadOnlyList<SecurityEvent> window)
    {
        var failures = window.Count(e => e.Action == "AuthenticationFailed");
        return failures >= 5
            ? DetectionOutcome.Match(Severity.Medium, $"{failures} neuspešnih prijava u prozoru od 5 minuta")
            : DetectionOutcome.NoMatch();
    }
}`, 'Pravilo mora biti testabilno nad kontrolisanim skupom događaja'),
    callout('note', 'Jedan događaj ne znači incident', 'Pet neuspešnih prijava generiše alert za analizu — ne automatski otvara incident. Odluka o eskalaciji je poseban korak sa sopstvenim kriterijumima.'),
    callout('task', 'Rad na vežbi', 'Implementirati najmanje jedno detection pravilo relevantno za projektnu celinu. Napisati test koji dokazuje da pravilo ne reaguje na događaje ispod praga.'),
  ]),

  page('6.2. Security alerts, triage i incident management', [
    text('h2', '6.2. Alerts, triage i incident management (R2-08, R2-09)'),
    text('paragraph', 'Alert prolazi kroz analitičara koji donosi triage odluku: da li je signal relevantan, da li zahteva eskalaciju u incident, ili se zatvara kao lažno pozitivan. Incident koji nastane ima jasan scope, vlasnika i zatvara se tek uz rezime rešenja.'),
    table(['Status alerta', 'Značenje'], [
      ['New', 'Alert je generisan, čeka pregled.'],
      ['Triaged', 'Analitičar je doneo odluku o relevantnosti.'],
      ['Escalated', 'Alert je postao incident.'],
      ['Closed', 'Zatvoren uz eksplicitan razlog (uključujući false positive).'],
    ]),
    callout('warning', 'Zatvaranje zahteva razlog', 'Alert se ne zatvara bez obrazloženja — čak i "false positive, prag prenizak" je validan, ali obavezan razlog koji ostaje u sistemu.'),
    code('csharp', `public sealed class SecurityIncident
{
    public IncidentStatus Status { get; private set; } = IncidentStatus.Open;
    public string? Resolution { get; private set; }

    public void Close(string resolutionSummary)
    {
        if (string.IsNullOrWhiteSpace(resolutionSummary))
            throw new InvalidOperationException("Incident se ne zatvara bez rezimea rešenja.");
        Resolution = resolutionSummary;
        Status = IncidentStatus.Closed;
    }
}`, 'Zatvaranje incidenta zahteva eksplicitan rezime, ne samo promenu statusa'),
    callout('task', 'Rad na vežbi', 'Implementirati tok Alert → Triage → (opciono) Incident → Closed za jedan scenario projektne celine, sa obaveznim razlogom zatvaranja na svakom koraku.'),
  ]),

  page('6.3. Vulnerability registry i remediation', [
    text('h2', '6.3. Vulnerability registry i remediation (R2-11)'),
    text('paragraph', 'Poznata slabost (simulirani nalaz, ne stvaran pentest nad realnim sistemom) se registruje, povezuje sa pogođenim asset-om i prati do zatvaranja uz verifikacioni dokaz — ne samo promenu statusa u "rešeno".'),
    table(['Element', 'Napomena'], [
      ['VulnerabilityFinding', 'Konkretan, simuliran nalaz sa severity oznakom.'],
      ['AffectedAsset', 'Asset na koji se nalaz odnosi.'],
      ['Remediation', 'Plan i vlasnik otklanjanja.'],
      ['FindingStatus', 'Open / InProgress / Resolved / Accepted.'],
    ]),
    callout('warning', 'Severity nije isto što i poslovni risk', 'Tehnički "Critical" nalaz na asset-u niske poslovne kritičnosti ne mora automatski imati isti prioritet kao isti nalaz na kritičnom sistemu — risk kombinuje oboje.'),
    callout('task', 'Rad na vežbi', 'Uvesti simulirani vulnerability nalaz povezan sa asset-om iz projektne celine. Implementirati zatvaranje nalaza koje zahteva verifikacioni dokaz (npr. rezultat ponovljene provere).'),
  ]),

  page('6.4. API security policies i supply-chain registry', [
    text('h2', '6.4. API security policies i supply-chain registry (R2-12, R2-13)'),
    text('paragraph', 'Aplikacione granice imaju centralizovana pravila (rate limit, input ograničenja, security header-i) koja se testiraju kao deo CI-ja, ne samo dokumentuju u wiki-ju. Paralelno, softverske zavisnosti nose sopstveni rizik koji mora biti evidentiran — poznat propust u tuđoj biblioteci postaje propust u sopstvenom sistemu čim se ta biblioteka uveze bez provere.'),
    diagram('Dve granice, isti princip', [
      ['API granica', 'rate limit, input, header-i', 'blue'],
      ['Supply-chain granica', 'zavisnost, verzija, poznat rizik', 'cyan'],
      ['CI provera', 'test, ne samo dokumentacija', 'emerald'],
    ], 'Obe granice dele isti princip: pravilo koje nije testirano u CI-ju lako postane pravilo koje se u praksi ne poštuje.'),
    table(['Element', 'Napomena'], [
      ['ApiSecurityPolicy', 'Pravilo vezano za endpoint klasu.'],
      ['RatePolicy', 'Ograničenje broja zahteva u vremenskom prozoru.'],
      ['SoftwareComponent / Dependency', 'Zavisnost sa poznatom verzijom.'],
      ['KnownRisk', 'Poznat bezbednosni rizik vezan za verziju zavisnosti.'],
    ]),
    callout('task', 'Rad na vežbi', 'Implementirati test koji proverava da endpoint iz projektne celine poštuje definisanu rate policy. Registrovati najmanje tri zavisnosti projekta sa verzijama u supply-chain registru.'),
  ]),

  page('6.5. Šesta projektna kontrolna tačka P6', [
    text('h2', '6.5. Projektna kontrolna tačka P6 — detekcija, incident i vulnerability tok'),
    text('paragraph', 'Šesta kontrolna tačka proverava operativni bezbednosni ciklus od događaja do reakcije: detection pravilo prepoznaje sumnjiv obrazac, alert prolazi triage, incident se vodi do zatvaranja, a poznata slabost ima vlasnika i plan otklanjanja.'),
    list([
      'Detection rule obrađuje simulirane security event-e i proizvodi objašnjiv rezultat, ne crnu kutiju.',
      'Alert i triage razlikuju lažno pozitivan signal od signala koji zahteva eskalaciju.',
      'Security incident ima status, severity, owner-a i zatvara se sa rezimeom rešenja.',
      'Vulnerability registry povezuje nalaz sa pogođenim asset-om i remediation vlasnikom.',
      'Najmanje jedna od API security policy ili dependency registry celina ima izvršiv test poslovnog pravila.',
      'Tim demonstrira ceo lanac na jednom simuliranom scenariju: event → detekcija → alert → incident → zatvaranje.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da poveže detekciju, alert triage, upravljanje incidentom i vulnerability registry u jedan operativni, dokaziv ciklus odgovora.'),
  ]),
]
