# ERS AI vežbe 5–8 — Equipment Reservation

Jedan koherentan, izvršiv primer koji prati Vežbe 5–8 iz praktikuma za **Elemente razvoja softvera**.

## Zašto jedan primer kroz četiri vežbe?

Student na V5 prvo dobija normalan softverski sistem sa jasnim granicama. Na V6 uvodi AI razvojni tok bez menjanja poslovnog jezgra. Na V7 isti projekat izlaže kontrolisan kontekst kroz MCP. Na V8 uvodi determinističke guardrail-e i evaluacione scenarije.

## Arhitektura

```text
Domain
  ↑
Application (use-case + portovi)
  ↑                 ↑
Infrastructure      Api (composition root)

Development tooling, odvojeno od poslovnog jezgra:
Mcp   Guardrails   .ai/   evals/
```

Dependency Rule: unutrašnji slojevi ne poznaju spoljne. `Domain` nema zavisnosti; `Application` poznaje samo `Domain`; `Infrastructure` implementira portove koje definiše `Application`; `Api` sklapa sistem.

## Vežba 5 — integracija modula, ugovori i podaci

Fokus:
- `IInventoryModule` je ugovor između Reservations use-case-a i Inventory dela sistema;
- `CreateReservationHandler` orkestrira use-case, ali ne zna konkretnu infrastrukturu;
- `RequestId` je idempotency key;
- `InventoryItem` čuva poslovno pravilo da se ne može rezervisati više od raspoloživog;
- NUnit test potvrđuje da ponovljen zahtev ne umanjuje zalihu dva puta.

Pokretanje API-ja:

```bash
dotnet run --project src/EquipmentReservation.Api
```

Primer zahteva:

```json
{
  "requestId": "22222222-2222-2222-2222-222222222222",
  "equipmentId": "11111111-1111-1111-1111-111111111111",
  "studentId": "33333333-3333-3333-3333-333333333333",
  "quantity": 2
}
```

## Vežba 6 — kontrolisan AI workflow

Datoteke:
- `.ai/AI_INSTRUCTIONS.md` — stabilna projektna pravila;
- `.ai/AI_USAGE.md` — sažeta evidencija odluka;
- `.ai/skills/review-pull-request/SKILL.md` — ponovljiva procedura;
- `.ai/agents/architecture-reviewer.md` — read-only uloga;
- `.ai/agents/implementer.md` — implementaciona uloga.

Poenta: AI pravila ne ulaze u `Domain`/`Application`; razvojni alat može da se zameni bez menjanja poslovnog koda.

## Vežba 7 — MCP

`EquipmentReservation.Mcp` koristi zvanični C# MCP SDK i stdio transport. Izlaže:
- resource `project://instructions`;
- resource `project://readme`;
- tool `get_project_structure`;
- tool `get_git_diff`;
- tool `run_unit_tests`.

Server ne izlaže proizvoljnu shell komandu i blokira izlazak van project root-a. To je namerno uži interfejs u skladu sa ISP i principom najmanjih privilegija.

Pokretanje:

```bash
dotnet run --project src/EquipmentReservation.Mcp
```

## Vežba 8 — hooks, guardrails i evaluacije

`EquipmentReservation.Guardrails` prima JSON događaj preko stdin-a i primenjuje skup `IToolGuardrail` politika. Novi guardrail može da se doda bez menjanja postojećih politika (OCP), dok `GuardrailEvaluator` zavisi od apstrakcije (DIP).

Primeri koji se blokiraju:
- `.env` i tipične secret datoteke;
- `git push --force`;
- `rm -rf`;
- agresivne PowerShell/Windows destruktivne komande.

`.claude/settings.json` pokazuje kako guardrail može da se veže za `PreToolUse` hook. Ako se koristi drugi AI alat, ista guardrail aplikacija ostaje, menja se samo adapter/konfiguracija događaja.

`evals/` sadrži tri scenarija:
1. arhitektonska regresija;
2. prompt injection;
3. nedovoljan kontekst.

## Provera build-a i testova

```bash
dotnet build src/EquipmentReservation.Api/EquipmentReservation.Api.csproj
dotnet build src/EquipmentReservation.Mcp/EquipmentReservation.Mcp.csproj
dotnet test tests/EquipmentReservation.Tests/EquipmentReservation.Tests.csproj
```

Iste komande su dodate i u GitHub Actions workflow da primer ne ostane samo dokumentacioni snippet.

Testovi pokrivaju:
- domensko pravilo zalihe;
- idempotentnost use-case-a;
- blokiranje destruktivnih komandi;
- blokiranje pristupa `.env` datoteci.

## SOLID mapa

| Princip | Primer |
|---|---|
| SRP | `Reservation`, `CreateReservationHandler`, `InMemoryInventoryModule`, `DangerousCommandGuardrail` imaju odvojene odgovornosti. |
| OCP | Novi guardrail se dodaje kao nova `IToolGuardrail` implementacija. |
| LSP | Svaka `IInventoryModule` implementacija mora vratiti isti ugovor uspeha/neuspeha. |
| ISP | `IInventoryModule` izlaže samo operaciju koju Reservations use-case zaista treba. |
| DIP | `CreateReservationHandler` zavisi od `IInventoryModule` i `IReservationRepository`, ne od konkretnih adaptera. |

## Napomena za nastavu

In-memory adapteri su namerno mali da bi fokus ostao na granicama i ugovorima. Za projekat studenta mogu se zameniti EF Core/SQL implementacijama bez promene `Domain` i bez promene use-case ugovora.
