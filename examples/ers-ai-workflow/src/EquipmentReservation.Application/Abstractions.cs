using EquipmentReservation.Domain;

namespace EquipmentReservation.Application;

public sealed record ReserveInventoryRequest(Guid EquipmentId, int Quantity, Guid ReservationId);
public sealed record ReserveInventoryResult(bool Success, string? ErrorCode);

public interface IInventoryModule
{
    Task<ReserveInventoryResult> ReserveAsync(
        ReserveInventoryRequest request,
        CancellationToken cancellationToken);
}

public interface IInventoryReadModel
{
    Task<int?> GetAvailableAsync(Guid equipmentId, CancellationToken cancellationToken);
}

public interface IReservationRepository
{
    Task<Reservation?> FindByRequestIdAsync(Guid requestId, CancellationToken cancellationToken);
    Task AddAsync(Reservation reservation, CancellationToken cancellationToken);
}
