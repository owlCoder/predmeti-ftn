using NUnit.Framework;
using EquipmentReservation.Application;
using EquipmentReservation.Domain;
using EquipmentReservation.Guardrails;
using EquipmentReservation.Infrastructure;

namespace EquipmentReservation.Tests;

public sealed class ReservationTests
{
    [Test]
    public void InventoryItem_Reserve_WhenQuantityExceedsAvailable_DoesNotChangeState()
    {
        var equipmentId = Guid.NewGuid();
        var item = new InventoryItem(equipmentId, available: 2);

        var result = item.Reserve(3);

        Assert.Multiple(() =>
        {
            Assert.That(result.Success, Is.False);
            Assert.That(result.ErrorCode, Is.EqualTo("InsufficientStock"));
            Assert.That(item.Available, Is.EqualTo(2));
        });
    }

    [Test]
    public async Task CreateReservation_WhenRequestIsRepeated_IsIdempotent()
    {
        var equipmentId = Guid.NewGuid();
        var inventory = new InMemoryInventoryModule();
        inventory.Seed(equipmentId, available: 5);

        var handler = new CreateReservationHandler(
            new InMemoryReservationRepository(),
            inventory);

        var command = new CreateReservationCommand(
            Guid.NewGuid(),
            equipmentId,
            Guid.NewGuid(),
            Quantity: 2);

        var first = await handler.HandleAsync(command, CancellationToken.None);
        var replay = await handler.HandleAsync(command, CancellationToken.None);

        Assert.Multiple(() =>
        {
            Assert.That(first.Status, Is.EqualTo(ReservationStatus.Confirmed));
            Assert.That(replay.ReservationId, Is.EqualTo(first.ReservationId));
            Assert.That(replay.Replayed, Is.True);
            Assert.That(inventory.GetAvailable(equipmentId), Is.EqualTo(3));
        });
    }

    [TestCase("git push --force origin main")]
    [TestCase("rm -rf ./src")]
    public void DangerousCommandGuardrail_BlocksDestructiveCommands(string command)
    {
        var guardrail = new DangerousCommandGuardrail();

        var result = guardrail.Evaluate(new ToolInvocation("Bash", command, null));

        Assert.That(result.Allowed, Is.False);
    }

    [Test]
    public void SensitiveFileGuardrail_BlocksEnvFile()
    {
        var guardrail = new SensitiveFileGuardrail();

        var result = guardrail.Evaluate(new ToolInvocation("Read", null, "/repo/.env"));

        Assert.That(result.Allowed, Is.False);
    }
}
