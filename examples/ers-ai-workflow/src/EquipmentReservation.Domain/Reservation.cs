namespace EquipmentReservation.Domain;

public enum ReservationStatus
{
    Pending,
    Confirmed,
    Rejected
}

public sealed class Reservation
{
    private Reservation(Guid id, Guid requestId, Guid equipmentId, Guid studentId, int quantity)
    {
        Id = id;
        RequestId = requestId;
        EquipmentId = equipmentId;
        StudentId = studentId;
        Quantity = quantity;
        Status = ReservationStatus.Pending;
    }

    public Guid Id { get; }
    public Guid RequestId { get; }
    public Guid EquipmentId { get; }
    public Guid StudentId { get; }
    public int Quantity { get; }
    public ReservationStatus Status { get; private set; }
    public string? RejectionReason { get; private set; }

    public static Reservation Create(Guid requestId, Guid equipmentId, Guid studentId, int quantity)
    {
        if (requestId == Guid.Empty) throw new ArgumentException("Request id is required.", nameof(requestId));
        if (equipmentId == Guid.Empty) throw new ArgumentException("Equipment id is required.", nameof(equipmentId));
        if (studentId == Guid.Empty) throw new ArgumentException("Student id is required.", nameof(studentId));
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");

        return new Reservation(Guid.NewGuid(), requestId, equipmentId, studentId, quantity);
    }

    public void Confirm()
    {
        EnsurePending();
        Status = ReservationStatus.Confirmed;
    }

    public void Reject(string reason)
    {
        EnsurePending();
        if (string.IsNullOrWhiteSpace(reason)) throw new ArgumentException("Rejection reason is required.", nameof(reason));

        RejectionReason = reason.Trim();
        Status = ReservationStatus.Rejected;
    }

    private void EnsurePending()
    {
        if (Status != ReservationStatus.Pending)
            throw new InvalidOperationException("Only a pending reservation can change state.");
    }
}
