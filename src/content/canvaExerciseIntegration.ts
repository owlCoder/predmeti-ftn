import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exerciseIntegration = (): DocumentPage[] => [
  page('Vežba 5 — Integracija modula kroz izvršivi EquipmentReservation primer', [
    text('h1', 'Vežba 5 — Integracija modula, ugovori i podaci'),
    text('paragraph', 'Od ove vežbe do kraja praktikuma koristi se jedan isti izvršivi primer: <b>Equipment Reservation</b>. Kompletan kod se nalazi u <code>examples/ers-ai-workflow/</code>, a glavna ulazna tačka je <code>EquipmentReservation.sln</code>. Student zato ne posmatra izolovane snippet-e, već prati kako se isti sistem nadograđuje kroz integraciju, AI workflow, MCP i guardrails.'),
    code('bash', `cd examples/ers-ai-workflow
dotnet restore EquipmentReservation.sln
dotnet build EquipmentReservation.sln --configuration Release
dotnet test EquipmentReservation.sln --configuration Release --no-build`, 'Otvaranje i provera kompletnog nastavnog primera'),
    diagram('Jedan solution, jasne granice', [
      ['Domain', 'poslovna pravila i entiteti', 'slate'],
      ['Application', 'use-case i portovi', 'cyan'],
      ['Infrastructure', 'adapteri ka spoljnim detaljima', 'blue'],
      ['API', 'composition root i transport', 'violet'],
      ['Tests', 'nezavisna provera ponašanja', 'emerald'],
    ], 'MCP i Guardrails projekti postoje u istom solution-u, ali ne postaju zavisnosti poslovnog jezgra.'),
  ]),

  page('5.1. Struktura solution-a i Dependency Rule', [
    text('h2', '5.1. Struktura solution-a i Dependency Rule'),
    text('paragraph', 'Solution učitava sedam projekata. Prvih četiri čine aplikaciju, dok su MCP i Guardrails razvojni alati; test projekat proverava i poslovno jezgro i determinističke zaštite. Najvažnije pravilo je smer zavisnosti: unutrašnji slojevi ne poznaju spoljne detalje.'),
    table(['Projekat', 'Odgovornost'], [
      ['EquipmentReservation.Domain', 'Entiteti i poslovna pravila; nema projektnih zavisnosti.'],
      ['EquipmentReservation.Application', 'Slučajevi upotrebe i portovi prema drugim modulima/infrastrukturi.'],
      ['EquipmentReservation.Infrastructure', 'Implementacije portova; u primeru in-memory adapteri.'],
      ['EquipmentReservation.Api', 'Composition root i HTTP granica; ne sadrži poslovna pravila.'],
      ['EquipmentReservation.Mcp', 'Kontrolisano izlaganje projektnog konteksta AI klijentu.'],
      ['EquipmentReservation.Guardrails', 'Determinističke politike za rizične pozive alata.'],
      ['EquipmentReservation.Tests', 'NUnit provere domena, use-case-a i guardrail-a.'],
    ]),
    callout('info', 'Zašto je ovo Clean Architecture', 'Promena baze, AI klijenta, MCP transporta ili hook konfiguracije ne zahteva promenu poslovnih pravila. Spoljni detalji zavise ka unutra, a ne obrnuto.'),
  ]),

  page('5.2. Poslovno pravilo ostaje u Domain sloju', [
    text('h2', '5.2. Poslovno pravilo ostaje u Domain sloju'),
    text('paragraph', 'Klasa <code>InventoryItem</code> ne zna za HTTP, bazu, MCP niti AI. Ona štiti invariant: količina mora biti pozitivna i ne može se rezervisati više jedinica nego što je raspoloživo.'),
    code('csharp', `public sealed class InventoryItem
{
    public Guid EquipmentId { get; }
    public int Available { get; private set; }

    public InventoryReservationResult Reserve(int quantity)
    {
        if (quantity <= 0)
            return InventoryReservationResult.Fail("InvalidQuantity");

        if (Available < quantity)
            return InventoryReservationResult.Fail("InsufficientStock");

        Available -= quantity;
        return InventoryReservationResult.Ok();
    }
}`, 'examples/ers-ai-workflow/src/EquipmentReservation.Domain/InventoryItem.cs'),
    list([
      'SRP: entitet štiti svoje stanje i poslovno pravilo; ne orkestrira ceo use-case.',
      'Kod neuspeha je deo poslovnog ishoda, a ne izuzetak infrastrukture.',
      'Isto pravilo koristiće API, testovi i budući adapteri bez dupliranja logike.',
    ]),
  ]),

  page('5.3. Ugovor između Reservations i Inventory dela sistema', [
    text('h2', '5.3. Ugovor između Reservations i Inventory dela sistema'),
    text('paragraph', 'Application sloj definiše ono što use-case za rezervaciju zaista treba. Ne prosleđuje ORM entitet niti omogućava pristup internom skladištu Inventory modula. Ovo je praktična primena ISP i DIP.'),
    code('csharp', `public sealed record ReserveInventoryRequest(
    Guid EquipmentId,
    int Quantity,
    Guid ReservationId);

public sealed record ReserveInventoryResult(
    bool Success,
    string? ErrorCode);

public interface IInventoryModule
{
    Task<ReserveInventoryResult> ReserveAsync(
        ReserveInventoryRequest request,
        CancellationToken cancellationToken);
}

public interface IReservationRepository
{
    Task<Reservation?> FindByRequestIdAsync(
        Guid requestId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Reservation reservation,
        CancellationToken cancellationToken);
}`, 'examples/ers-ai-workflow/src/EquipmentReservation.Application/Abstractions.cs'),
    callout('note', 'Dependency inversion', 'Use-case zavisi od ugovora koje poseduje Application sloj. Infrastructure bira kako će ti ugovori biti realizovani.'),
  ]),

  page('5.4. Use-case orkestrira, ali ne preuzima tuđe odgovornosti', [
    text('h2', '5.4. CreateReservationHandler kao Application use-case'),
    text('paragraph', 'Handler proverava idempotentnost, kreira domen objekat, poziva Inventory kroz port i čuva rezultat kroz repository port. Ne zna koja konkretna klasa čuva podatke i ne menja zalihu direktnim pristupom drugom modulu.'),
    code('csharp', `public sealed class CreateReservationHandler(
    IReservationRepository reservations,
    IInventoryModule inventory)
{
    public async Task<CreateReservationResult> HandleAsync(
        CreateReservationCommand command,
        CancellationToken cancellationToken)
    {
        var existing = await reservations.FindByRequestIdAsync(
            command.RequestId,
            cancellationToken);

        if (existing is not null)
            return Map(existing, replayed: true);

        var reservation = Reservation.Create(
            command.RequestId,
            command.EquipmentId,
            command.StudentId,
            command.Quantity);

        var inventoryResult = await inventory.ReserveAsync(
            new ReserveInventoryRequest(
                reservation.EquipmentId,
                reservation.Quantity,
                reservation.Id),
            cancellationToken);

        if (inventoryResult.Success)
            reservation.Confirm();
        else
            reservation.Reject(inventoryResult.ErrorCode ?? "InventoryRejected");

        await reservations.AddAsync(reservation, cancellationToken);
        return Map(reservation, replayed: false);
    }
}`, 'examples/ers-ai-workflow/src/EquipmentReservation.Application/CreateReservation.cs'),
  ]),

  page('5.5. Idempotentnost mora biti proverena testom', [
    text('h2', '5.5. Idempotentnost mora biti proverena testom'),
    text('paragraph', '<code>RequestId</code> predstavlja idempotency key. Ako isti zahtev stigne ponovo, postojeća rezervacija se vraća bez drugog umanjenja zalihe. To nije komentar niti pretpostavka; ponašanje je zaključano testom.'),
    code('csharp', `[Test]
public async Task CreateReservation_WhenRequestIsRepeated_IsIdempotent()
{
    var equipmentId = Guid.NewGuid();
    var inventory = new InMemoryInventoryModule();
    inventory.Seed(equipmentId, available: 5);

    var handler = new CreateReservationHandler(
        new InMemoryReservationRepository(),
        inventory);

    var command = new CreateReservationCommand(
        Guid.NewGuid(), equipmentId, Guid.NewGuid(), Quantity: 2);

    var first = await handler.HandleAsync(command, CancellationToken.None);
    var replay = await handler.HandleAsync(command, CancellationToken.None);

    Assert.Multiple(() =>
    {
        Assert.That(replay.ReservationId, Is.EqualTo(first.ReservationId));
        Assert.That(replay.Replayed, Is.True);
        Assert.That(inventory.GetAvailable(equipmentId), Is.EqualTo(3));
    });
}`, 'examples/ers-ai-workflow/tests/EquipmentReservation.Tests/ReservationTests.cs'),
    callout('success', 'Izvršiva specifikacija', 'Student treba da pokrene <code>dotnet test EquipmentReservation.sln</code> i tek zatim tvrdi da je integracija ispravna.'),
  ]),

  page('5.6. SOLID mapa na stvarnom primeru', [
    text('h2', '5.6. SOLID mapa na stvarnom primeru'),
    table(['Princip', 'Gde se vidi'], [
      ['SRP', 'InventoryItem čuva pravilo zalihe; handler orkestrira use-case; repository čuva podatke.'],
      ['OCP', 'Nova Infrastructure implementacija može se dodati bez menjanja handler-a.'],
      ['LSP', 'Svaka IInventoryModule implementacija mora poštovati isti ugovor uspeha/neuspeha.'],
      ['ISP', 'IInventoryModule izlaže samo ReserveAsync koji ovom use-case-u treba.'],
      ['DIP', 'Application zavisi od interfejsa; composition root bira konkretne adaptere.'],
    ]),
    callout('task', 'Rad na vežbi', 'Otvoriti <code>EquipmentReservation.sln</code>, pronaći smer svih ProjectReference zavisnosti i nacrtati ga. Zatim zameniti jedan in-memory adapter sopstvenim test-double-om bez promene Domain/Application koda i pokrenuti ceo solution test.'),
  ]),
]
