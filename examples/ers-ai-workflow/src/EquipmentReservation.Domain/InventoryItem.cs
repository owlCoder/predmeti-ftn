namespace EquipmentReservation.Domain;

public sealed class InventoryItem
{
    public InventoryItem(Guid equipmentId, int available)
    {
        if (equipmentId == Guid.Empty) throw new ArgumentException("Equipment id is required.", nameof(equipmentId));
        if (available < 0) throw new ArgumentOutOfRangeException(nameof(available));

        EquipmentId = equipmentId;
        Available = available;
    }

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
}

public sealed record InventoryReservationResult(bool Success, string? ErrorCode)
{
    public static InventoryReservationResult Ok() => new(true, null);
    public static InventoryReservationResult Fail(string errorCode) => new(false, errorCode);
}
