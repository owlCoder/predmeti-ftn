using EquipmentReservation.Application;
using EquipmentReservation.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var inventory = new InMemoryInventoryModule();
var defaultEquipmentId = Guid.Parse("11111111-1111-1111-1111-111111111111");
inventory.Seed(defaultEquipmentId, available: 10);

builder.Services.AddSingleton<IInventoryModule>(inventory);
builder.Services.AddSingleton<IReservationRepository, InMemoryReservationRepository>();
builder.Services.AddScoped<CreateReservationHandler>();

var app = builder.Build();

app.MapGet("/", () => Results.Ok(new
{
    service = "Equipment Reservation teaching example",
    equipmentId = defaultEquipmentId,
    available = inventory.GetAvailable(defaultEquipmentId)
}));

app.MapPost("/reservations", async (
    CreateReservationRequest request,
    CreateReservationHandler handler,
    CancellationToken cancellationToken) =>
{
    var command = new CreateReservationCommand(
        request.RequestId,
        request.EquipmentId,
        request.StudentId,
        request.Quantity);

    var result = await handler.HandleAsync(command, cancellationToken);

    return result.Status switch
    {
        EquipmentReservation.Domain.ReservationStatus.Confirmed => Results.Ok(result),
        EquipmentReservation.Domain.ReservationStatus.Rejected => Results.Conflict(result),
        _ => Results.Accepted(value: result)
    };
});

app.Run();

public sealed record CreateReservationRequest(
    Guid RequestId,
    Guid EquipmentId,
    Guid StudentId,
    int Quantity);
