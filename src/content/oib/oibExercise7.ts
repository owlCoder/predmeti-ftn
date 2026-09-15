import type { DocumentPage } from '../../types'
import { text, list, callout, code, table, diagram, page } from '../canvaPracticumShared'

export const oibExercise7 = (): DocumentPage[] => [
  page('Vežba 7 — Policy engine, risk i threat modeling', [
    text('h1', 'Vežba 7 — Policy engine, risk i threat modeling'),
    text('paragraph', 'RBAC odgovara na pitanje "koju ulogu ima korisnik". Neke odluke, međutim, zavise od kombinacije više atributa — ko je subjekt, kakav je resurs, u kom je kontekstu zahtev nastao. Ova vežba uvodi napredni (R3) sloj: atributsku autorizaciju, strukturisan risk register i sistematski threat modeling.'),
    text('paragraph', 'Prelazak na ovaj nivo nije zamena za RBAC iz Vežbe 1, već njegova nadogradnja tamo gde uloga sama po sebi ne nosi dovoljno informacije za bezbednu odluku. Administrator koji pristupa sistemu sa upravljanog laptopa u radno vreme i administrator koji isti pristup pokušava sa nepoznatog uređaja u tri ujutru nose istu ulogu, ali ne bi trebalo da nose isti nivo poverenja.'),
    diagram('Od atributa do odluke', [
      ['Subject attribute', 'uloga, department, risk score', 'slate'],
      ['Resource attribute', 'klasifikacija, vlasnik', 'cyan'],
      ['Environment context', 'vreme, uređaj, lokacija', 'blue'],
      ['Policy decision', 'deterministički allow/deny', 'amber'],
      ['Evidence', 'objašnjiv razlog odluke', 'emerald'],
    ], 'Policy engine mora dati isti rezultat za isti kontekst — nasumičnost ovde nije prihvatljiva.'),
  ]),

  page('7.1. Policy engine i atributska autorizacija', [
    text('h2', '7.1. Policy engine i atributska autorizacija (R3-01)'),
    text('paragraph', 'Policy engine kombinuje atribute subjekta, resursa i okruženja u jedan objašnjiv allow/deny rezultat. Za razliku od proste RBAC provere, ovde se u obzir uzima kontekst — vreme pristupa, tip uređaja, lokacija — ali odluka mora ostati determinstička.'),
    code('csharp', `public sealed record PolicyContext(
    string Role,
    string ResourceClassification,
    bool IsManagedDevice,
    TimeOnly RequestTime);

public sealed class BusinessHoursConfidentialAccessPolicy : IPolicyRule
{
    public PolicyDecision Evaluate(PolicyContext context)
    {
        if (context.ResourceClassification != "Confidential")
            return PolicyDecision.NotApplicable();

        var withinHours = context.RequestTime is >= { Hour: >= 7 } and { Hour: < 19 };
        if (!withinHours)
            return PolicyDecision.Deny("Pristup Confidential resursu van radnog vremena nije dozvoljen.");

        if (!context.IsManagedDevice)
            return PolicyDecision.Deny("Pristup Confidential resursu zahteva upravljan uređaj.");

        return PolicyDecision.Allow("Uslovi radnog vremena i uređaja su ispunjeni.");
    }
}`, 'Odluka je objašnjiva — svaki deny nosi konkretan razlog'),
    callout('task', 'Rad na vežbi', 'Implementirati policy pravilo koje kombinuje najmanje dva atributa konteksta za resurs iz projektne celine. Napisati test koji dokazuje deterministički rezultat za isti context snapshot.'),
  ]),

  page('7.2. Periodic access review i risk register', [
    text('h2', '7.2. Periodic access review i risk register (R3-02, R3-03)'),
    text('paragraph', 'Access review periodično proverava da li korisnici i servisi i dalje treba da imaju dodeljena prava — dodela nije trajna samo zato što je nekad imala poslovni smisao. Risk register povezuje asset, pretnju, slabost i kontrolu u procenjiv, sledljiv model.'),
    table(['Element', 'Napomena'], [
      ['AccessReview', 'Kampanja periodičnog pregleda prava.'],
      ['CertificationDecision', 'Potvrda ili ukidanje pojedinačnog prava.'],
      ['Risk', 'Kombinacija pretnje, slabosti i konteksta nad asset-om.'],
      ['ResidualRisk', 'Rizik koji ostaje nakon primene kontrola.'],
    ]),
    callout('warning', 'Review se ne potvrđuje automatski', 'Ako reviewer ne odgovori do roka, prava se ne smeju automatski potvrditi zbog "podrazumevanog da je sve u redu" — nedostatak odgovora je sopstveni signal koji zahteva eskalaciju.'),
    callout('task', 'Rad na vežbi', 'Implementirati jednostavnu access review kampanju za privilegovana prava iz projektne celine i risk zapis koji povezuje asset, pretnju i kontrolu sa izračunatim rezidualnim rizikom.'),
  ]),

  page('7.3. Threat modeling workflow', [
    text('h2', '7.3. Threat modeling workflow (R3-04)'),
    text('paragraph', 'Threat model sistematski povezuje trust granice, tokove podataka i planirane mitigacije za konkretan sistem ili tok — ne apstraktnu listu "mogućih napada" bez veze sa stvarnom arhitekturom.'),
    diagram('Threat model kao živi dokument', [
      ['Trust boundary (Vežba 3)', 'poznata granica', 'slate'],
      ['Nova implementacija (R2)', 'otkriva novi tok', 'cyan'],
      ['Ažuriran threat model', 'nova pretnja + mitigacija', 'blue'],
      ['Review', 'nakon svake značajne promene', 'emerald'],
    ], 'Threat model iz Vežbe 4 se ne piše jednom — ažurira se čim implementacija otkrije novu granicu ili tok.'),
    table(['Element', 'Primer'], [
      ['TrustBoundary', 'Granica između javnog API-ja i internog servisa.'],
      ['DataFlow', 'Zahtev korisnika koji prelazi tu granicu.'],
      ['Threat', 'Neovlašćen pristup internom servisu zaobilaženjem gateway-a.'],
      ['Mitigation', 'Obavezna autentikacija servisa na granici, ne oslanjanje na mrežnu izolaciju.'],
    ]),
    callout('task', 'Rad na vežbi', 'Ažurirati threat model projektne celine (iz Vežbe 4) sa najmanje jednom novom trust granicom otkrivenom kroz R2 implementaciju, i pripadajućom mitigacijom.'),
  ]),

  page('7.4. Security exceptions i segregation of duties', [
    text('h2', '7.4. Security exceptions i segregation of duties (R3-08, R3-13)'),
    text('paragraph', 'Odstupanje od politike je formalna, vremenski ograničena odluka — ne tiha izuzetnost. Segregation of duties, sa druge strane, sprečava da kombinacija pojedinačno bezopasnih dozvola postane rizična kada ih poseduje ista osoba.'),
    code('csharp', `public sealed record SodRule(string PermissionA, string PermissionB, string Reason);

public bool HasToxicCombination(IReadOnlyList<string> effectivePermissions, SodRule rule)
    => effectivePermissions.Contains(rule.PermissionA) && effectivePermissions.Contains(rule.PermissionB);`, 'Nalaz se zasniva na efektivnim, ne direktno dodeljenim privilegijama'),
    callout('info', 'Primer', 'Osoba koja sme i da odobrava rashode i da izvršava isplate predstavlja toxic combination — čak i ako je svaka dozvola pojedinačno opravdana za drugu ulogu.'),
    callout('task', 'Rad na vežbi', 'Definisati najmanje jedno SoD pravilo relevantno za projektnu celinu i implementirati detekciju toxic combination na osnovu efektivnih privilegija.'),
  ]),

  page('7.5. Sedma projektna kontrolna tačka P7', [
    text('h2', '7.5. Projektna kontrolna tačka P7 — policy engine, risk i threat modeling'),
    text('paragraph', 'Sedma kontrolna tačka uvodi napredni (R3) nivo: odluke o pristupu koje kombinuju više atributa, strukturisan risk register i threat modeling workflow koji povezuje trust granice sa planiranim kontrolama.'),
    list([
      'Policy engine daje deterministički allow/deny rezultat za isti kontekst i ima eksplicitan deny-by-default gde je primenjeno.',
      'Risk register povezuje asset, pretnju, slabost i kontrolu u jedan procenjiv rizik sa impact/likelihood.',
      'Threat modeling workflow je primenjen na najmanje jedan tok tima sa evidentiranom trust granicom i mitigacijom.',
      'Access review ili security exceptions imaju rok, vlasnika i ne dozvoljavaju tihu automatsku potvrdu.',
      'Tim objašnjava kako se policy odluka menja kada se promeni jedan atribut konteksta.',
      'Dokumentovan je najmanje jedan slučaj gde je izuzetak od politike odobren sa rokom i razlogom.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da implementira atributsku autorizaciju, strukturisan risk register i threat model koji objašnjava stvarne trust granice sistema.'),
  ]),
]
