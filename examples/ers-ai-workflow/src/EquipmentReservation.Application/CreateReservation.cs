using EquipmentReservation.Domain;

namespace EquipmentReservation.Application;

public sealed record CreateReservationCommand(
    Guid RequestId,
    Guid EquipmentId,
    Guid StudentId,
    int Quantity);

public sealed record CreateReservationResult(
    Guid ReservationId,
    ReservationStatus Status,
    string? ErrorCode,
    bool Replayed);

public sealed class CreateReservationHandler(
    IReservationRepository reservations,
    IInventoryModule inventory)
{
    public async Task<CreateReservationResult> HandleAsync(
        CreateReservationCommand command,
        CancellationToken cancellationToken)
    {
        var existing = await reservations.FindByRequestIdAsync(command.RequestId, cancellationToken);
        if (existing is not null)
        {
            return Map(existing, replayed: true);
        }

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

    private static CreateReservationResult Map(Reservation reservation, bool replayed) =>
        new(
            reservation.Id,
            reservation.Status,
            reservation.RejectionReason,
            replayed);
}
