using System.Collections.Concurrent;
using EquipmentReservation.Application;
using EquipmentReservation.Domain;

namespace EquipmentReservation.Infrastructure;

public sealed class InMemoryReservationRepository : IReservationRepository
{
    private readonly ConcurrentDictionary<Guid, Reservation> _byRequestId = new();

    public Task<Reservation?> FindByRequestIdAsync(Guid requestId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _byRequestId.TryGetValue(requestId, out var reservation);
        return Task.FromResult(reservation);
    }

    public Task AddAsync(Reservation reservation, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (!_byRequestId.TryAdd(reservation.RequestId, reservation))
            throw new InvalidOperationException("A reservation with the same request id already exists.");

        return Task.CompletedTask;
    }
}

public sealed class InMemoryInventoryModule : IInventoryModule, IInventoryReadModel
{
    private readonly ConcurrentDictionary<Guid, InventorySlot> _slots = new();

    public void Seed(Guid equipmentId, int available) =>
        _slots[equipmentId] = new InventorySlot(new InventoryItem(equipmentId, available));

    public Task<ReserveInventoryResult> ReserveAsync(
        ReserveInventoryRequest request,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!_slots.TryGetValue(request.EquipmentId, out var slot))
            return Task.FromResult(new ReserveInventoryResult(false, "EquipmentNotFound"));

        lock (slot.SyncRoot)
        {
            var result = slot.Item.Reserve(request.Quantity);
            return Task.FromResult(new ReserveInventoryResult(result.Success, result.ErrorCode));
        }
    }

    public Task<int?> GetAvailableAsync(Guid equipmentId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!_slots.TryGetValue(equipmentId, out var slot))
            return Task.FromResult<int?>(null);

        lock (slot.SyncRoot)
        {
            return Task.FromResult<int?>(slot.Item.Available);
        }
    }

    public int GetAvailable(Guid equipmentId) =>
        _slots.TryGetValue(equipmentId, out var slot)
            ? slot.Item.Available
            : throw new KeyNotFoundException("Equipment does not exist.");

    private sealed record InventorySlot(InventoryItem Item)
    {
        public object SyncRoot { get; } = new();
    }
}
