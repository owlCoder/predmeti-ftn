import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise8 = (): DocumentPage[] => [
  page('Vežba 8 — Napredna analitika i završna odbrana', [
    text('h1', 'Vežba 8 — Napredna analitika i završna odbrana'),
    text('paragraph', 'Poslednja vežba povezuje naprednu R3 analitiku — correlation, attack-path, kontrolisanu automatizaciju odgovora i posture metrike — sa nižim nivoima sistema izgrađenim u prethodnim vežbama. Ključno pravilo ostaje isto od početka kursa: analitika objašnjava, ne zamenjuje ljudsku odluku, i nikad ne stvara lažnu preciznost.'),
    text('paragraph', 'Ovakva analitika je najkorisnija kada tim otvoreno prizna njena ograničenja. Grafik koji izgleda uverljivo, ali je izgrađen nad nepotpunim ili zastarelim podacima, može biti opasniji od potpunog odsustva analitike — jer stvara lažan osećaj kontrole. Zato svaki rezultat u ovoj vežbi mora biti praćen eksplicitnim nivoom poverenja i poznatim ograničenjem.'),
    diagram('Od signala do objašnjive slike', [
      ['Correlation', 'više događaja, jedna priča', 'slate'],
      ['Attack-path', 'analitički, ne dokazan put', 'cyan'],
      ['Response', 'kontrolisana, odobrena akcija', 'amber'],
      ['Posture', 'trend efektivnosti kontrola', 'blue'],
      ['Odbrana', 'objašnjiv, sledljiv sistem', 'emerald'],
    ], 'Agregatni score nikad ne sme sakriti otvoren kritičan nalaz.'),
  ]),

  page('8.1. Security event correlation i analytics', [
    text('h2', '8.1. Security event correlation i analytics (R3-05)'),
    text('paragraph', 'Korelacija kombinuje više događaja u objašnjivu bezbednosnu sliku, bez potrebe za mašinskim učenjem. Pravilo korelacije mora biti testabilno i objašnjivo — confidence koji ono proizvodi nije dokaz incidenta, već signal za dalju analizu.'),
    code('csharp', `public sealed class ImpossibleTravelCorrelation : ICorrelationRule
{
    public CorrelationResult Evaluate(IReadOnlyList<SecurityEvent> loginsInWindow)
    {
        var distinctLocations = loginsInWindow.Select(e => e.Location).Distinct().Count();
        if (distinctLocations < 2) return CorrelationResult.NoMatch();

        return CorrelationResult.Match(
            confidence: 0.6,
            reason: $"{distinctLocations} različite lokacije prijave u prozoru od 10 minuta");
    }
}`, 'Correlation rezultat nosi objašnjenje i eksplicitan nivo poverenja'),
    callout('task', 'Rad na vežbi', 'Implementirati jedno correlation pravilo koje kombinuje najmanje dva tipa događaja relevantna za projektnu celinu.'),
  ]),

  page('8.2. Attack-path analiza i kontrolisan odgovor', [
    text('h2', '8.2. Attack-path analiza i automatizacija odgovora (R3-06, R3-10)'),
    text('paragraph', 'Attack-path analiza pronalazi moguće puteve od ulazne tačke do kritičnog asset-a na osnovu poznatih trust, vulnerability i privilege veza — bez izvođenja realnog napada. Kada se otkrije rizičan put ili incident, response akcija koja sledi mora biti kontrolisana: destruktivna ili široka akcija zahteva viši nivo odobrenja.'),
    text('paragraph', 'Vrednost ove analize nije u tome da pronađe jedan senzacionalan put ka najkritičnijem asset-u, već da sistematski pokrije male, naizgled bezopasne veze koje se, sabrane, pretvaraju u ozbiljan rizik — zaboravljen test nalog sa privilegijama, servis koji veruje internoj mreži bez dodatne provere, ili trust granica dokumentovana u Vežbi 4 koja u međuvremenu više ne odgovara stvarnoj implementaciji.'),
    diagram('Exposure graf u tri sloja', [
      ['Entry point', 'javno dostupna tačka', 'slate'],
      ['Lateral veza', 'trust ili privilege veza', 'cyan'],
      ['Kritičan asset', 'cilj potencijalnog puta', 'amber'],
      ['Kontrolisan odgovor', 'odobrenje pre akcije', 'emerald'],
    ], 'Otkriven put je signal za prioritizaciju mitigacije, ne dokaz da je napad izvršen.'),
    table(['Pravilo', 'Razlog'], [
      ['Attack-path ne dokazuje da je exploit moguć', 'Model je analitički, zasnovan na poznatim podacima, ne na stvarnom pokušaju.'],
      ['Nepoznata veza se ne tretira kao bezbedna', 'Nedostatak podatka nije isto što i potvrđeno odsustvo rizika.'],
      ['Automatizacija je idempotentna gde je moguće', 'Ponovljeno izvršenje iste akcije ne sme praviti dodatnu štetu.'],
      ['Destruktivna akcija zahteva viši nivo odobrenja', 'Ukidanje sesije je niskorizično; suspenzija naloga zahteva potvrdu.'],
    ]),
    callout('task', 'Rad na vežbi', 'Izgraditi jednostavan exposure graf za projektnu celinu (asset, trust granica, poznata slabost) i pronaći najmanje jedan mogući put ka kritičnom asset-u. Implementirati response akciju koja zahteva odobrenje za destruktivan korak.'),
  ]),

  page('8.3. Continuous control effectiveness i cryptographic posture', [
    text('h2', '8.3. Control effectiveness i crypto posture (R3-12, R3-19)'),
    text('paragraph', 'Efektivnost kontrole se procenjuje kroz vreme na osnovu testova, dokaza i njihove svežine — nedostajući dokaz se nikad ne tretira kao "prošao test". Slično, kriptografska izloženost se prati agregatno kako bi se zastareli algoritmi migrirali planirano, ne u panici pred istek.'),
    text('paragraph', 'Kontrola koja je jednom testirana i nikad ponovo proverena postepeno gubi verodostojnost — kod oko nje se menja, konfiguracija drifta, a dokaz iz prošlog semestra ne govori ništa o trenutnom stanju. Zato effectiveness score mora eksplicitno opadati sa starošću dokaza, a ne ostajati zamrznut na poslednjem poznatom rezultatu.'),
    diagram('Dokaz koji stari', [
      ['Test prošao', 'dokaz svež', 'emerald'],
      ['Vreme prolazi', 'dokaz zastareva', 'cyan'],
      ['Dokaz zastareo', 'tretira se kao neefikasno', 'amber'],
      ['Ponovljen test', 'dokaz ponovo svež', 'blue'],
    ], 'Kontrola bez skorašnjeg dokaza je operativno ista kao kontrola koja nikad nije testirana.'),
    code('csharp', `public sealed record ControlEffectiveness(string ControlId, bool HasFreshEvidence, bool LastTestPassed)
{
    public bool IsEffective => HasFreshEvidence && LastTestPassed; // Nedostajuci dokaz uvek daje false, nikad true.
}`, 'Nedostajući dokaz se eksplicitno tretira kao neefikasna kontrola, ne kao prolaz'),
    callout('task', 'Rad na vežbi', 'Implementirati jednostavan effectiveness score za jednu kontrolu iz Vežbe 3, koji uzima u obzir i postojanje i svežinu dokaza.'),
  ]),

  page('8.4. Post-incident review i priprema za odbranu', [
    text('h2', '8.4. Post-incident review i priprema za odbranu (R3-09)'),
    text('paragraph', 'Iskustvo iz incidenta se pretvara u merljive korektivne akcije sa vlasnikom i rokom — PIR nije mesto za pripisivanje krivice pojedincu, već za sistemsko unapređenje.'),
    text('paragraph', 'Post-incident review ima smisla samo ako se dešava dosledno — i posle malog incidenta koji je brzo zatvoren, ne samo posle velikog koji je izazvao paniku. Tim koji PIR radi samo za "ozbiljne" slučajeve gubi upravo one male signale koji, ponovljeni kroz vreme, ukazuju na sistemski problem pre nego što on preraste u veći incident.'),
    diagram('Od incidenta do sistemske promene', [
      ['Incident zatvoren', 'operativno rešen', 'slate'],
      ['Root cause', 'proces ili kontrola, ne "greška"', 'cyan'],
      ['Improvement akcija', 'vlasnik i rok', 'amber'],
      ['Sledljivost', 'ostaje vidljivo do izvršenja', 'emerald'],
    ], 'Operativno zatvaranje incidenta i zatvaranje njegovih korektivnih akcija su dva različita, nezavisno praćena koraka.'),
    list([
      'Root cause se evidentira na odgovarajućem nivou (proces, kontrola, ne samo "ljudska greška").',
      'Svaka improvement akcija ima vlasnika i rok.',
      'Incident se može operativno zatvoriti pre završetka svih akcija, ali one ostaju sledljive.',
    ]),
    callout('warning', 'Odbrana bez memorisanog teksta', 'Svaki član tima mora umeti da objasni threat model, kontrolu, test i preostali (residual) rizik svoje projektne celine — bez oslanjanja na automatski generisan odgovor ili tuđe objašnjenje.'),
  ]),

  page('8.5. Završna projektna kontrolna tačka P8', [
    text('h2', '8.5. Projektna kontrolna tačka P8 — proverljiva bezbednost celog sistema'),
    text('paragraph', 'Završni rezultat kursa nije sistem čiju bezbednosnu logiku tim ne razume, već platforma čiji svaki član može da objasni asset, pretnju, kontrolu, test i preostali rizik za dodeljenu projektnu celinu.'),
    list([
      'Najmanje jedna analitička R3 celina je povezana sa stvarnim podacima iz nižih nivoa.',
      'Automatizacija containment/response akcije zahteva viši nivo odobrenja za destruktivnu akciju i ostavlja audit trag.',
      'Postoje najmanje tri evaluaciona/bezbednosna scenarija, uključujući negativni ili abuse-case.',
      'Peer security review je zabeležen i relevantne sugestije su obrađene pre završne odbrane.',
      'Tim može da objasni residual risk ili poznato ograničenje svoje projektne celine bez izbegavanja pitanja.',
      'Na odbrani svaki član tima objašnjava threat model, kontrolu i test svoje celine bez oslanjanja na automatski generisan odgovor.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da poveže naprednu bezbednosnu analitiku sa nižim nivoima sistema i da samostalno objasni bezbednosni model, dokaze i preostali rizik dodeljene projektne celine.'),
  ]),
]
