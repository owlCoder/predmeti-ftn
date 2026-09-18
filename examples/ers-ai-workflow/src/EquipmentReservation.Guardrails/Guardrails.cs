using System.Text.Json;

namespace EquipmentReservation.Guardrails;

public sealed record ToolInvocation(string? ToolName, string? Command, string? FilePath);
public sealed record GuardrailDecision(bool Allowed, string? Reason)
{
    public static GuardrailDecision Allow() => new(true, null);
    public static GuardrailDecision Block(string reason) => new(false, reason);
}

public interface IToolGuardrail
{
    GuardrailDecision Evaluate(ToolInvocation invocation);
}

public sealed class SensitiveFileGuardrail : IToolGuardrail
{
    private static readonly string[] ForbiddenNames = [".env", "secrets.json", "appsettings.secrets.json"];

    public GuardrailDecision Evaluate(ToolInvocation invocation)
    {
        if (string.IsNullOrWhiteSpace(invocation.FilePath)) return GuardrailDecision.Allow();

        var normalized = invocation.FilePath.Replace('\\', '/');
        return ForbiddenNames.Any(name => normalized.EndsWith(name, StringComparison.OrdinalIgnoreCase))
            ? GuardrailDecision.Block($"Reading or writing '{invocation.FilePath}' is blocked by project policy.")
            : GuardrailDecision.Allow();
    }
}

public sealed class DangerousCommandGuardrail : IToolGuardrail
{
    private static readonly string[] ForbiddenFragments = [
        "git push --force",
        "git push -f",
        "rm -rf",
        "Remove-Item -Recurse -Force",
        "format c:"
    ];

    public GuardrailDecision Evaluate(ToolInvocation invocation)
    {
        if (string.IsNullOrWhiteSpace(invocation.Command)) return GuardrailDecision.Allow();

        return ForbiddenFragments.Any(fragment =>
                invocation.Command.Contains(fragment, StringComparison.OrdinalIgnoreCase))
            ? GuardrailDecision.Block("Destructive or forceful command blocked by project policy.")
            : GuardrailDecision.Allow();
    }
}

public sealed class GuardrailEvaluator(IEnumerable<IToolGuardrail> guardrails)
{
    private readonly IReadOnlyList<IToolGuardrail> _guardrails = guardrails.ToArray();

    public GuardrailDecision Evaluate(ToolInvocation invocation)
    {
        foreach (var guardrail in _guardrails)
        {
            var decision = guardrail.Evaluate(invocation);
            if (!decision.Allowed) return decision;
        }

        return GuardrailDecision.Allow();
    }
}

public static class HookInputParser
{
    public static ToolInvocation Parse(string json)
    {
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;

        var toolName = TryRead(root, "tool_name");
        var command = TryReadNested(root, "tool_input", "command");
        var filePath = TryReadNested(root, "tool_input", "file_path");

        return new ToolInvocation(toolName, command, filePath);
    }

    private static string? TryRead(JsonElement element, string property) =>
        element.TryGetProperty(property, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static string? TryReadNested(JsonElement element, string parent, string property) =>
        element.TryGetProperty(parent, out var parentValue) && parentValue.ValueKind == JsonValueKind.Object
            ? TryRead(parentValue, property)
            : null;
}
