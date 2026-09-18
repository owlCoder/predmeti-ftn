using System.ComponentModel;
using ModelContextProtocol.Server;

namespace EquipmentReservation.Mcp;

[McpServerResourceType]
public sealed class ProjectResources(ProjectWorkspace workspace)
{
    [McpServerResource(
        UriTemplate = "project://instructions",
        Name = "project_instructions",
        MimeType = "text/markdown")]
    [Description("Stable project rules for AI-assisted development.")]
    public string Instructions() =>
        workspace.ReadProjectFile(".ai/AI_INSTRUCTIONS.md");

    [McpServerResource(
        UriTemplate = "project://readme",
        Name = "project_readme",
        MimeType = "text/markdown")]
    [Description("Teaching example README.")]
    public string Readme() =>
        workspace.ReadProjectFile("README.md");
}

[McpServerToolType]
public sealed class ProjectTools(ProjectWorkspace workspace)
{
    [McpServerTool(Name = "get_project_structure", ReadOnly = true, Idempotent = true, OpenWorld = false)]
    [Description("Returns a safe, read-only list of project files.")]
    public string GetProjectStructure() => workspace.GetStructure();

    [McpServerTool(Name = "get_git_diff", ReadOnly = true, Idempotent = true, OpenWorld = false)]
    [Description("Returns git diff for the current working tree. No files are modified.")]
    public async Task<string> GetGitDiff(CancellationToken cancellationToken)
    {
        var result = await workspace.RunFixedCommandAsync(
            "git",
            ["diff", "--", "."],
            cancellationToken);

        return workspace.ToJson(new
        {
            success = result.ExitCode == 0,
            result.ExitCode,
            diff = result.StandardOutput,
            error = result.StandardError
        });
    }

    [McpServerTool(Name = "run_unit_tests", Destructive = false, Idempotent = true, OpenWorld = false)]
    [Description("Runs the whole EquipmentReservation solution and returns a structured summary.")]
    public async Task<string> RunUnitTests(CancellationToken cancellationToken)
    {
        var result = await workspace.RunFixedCommandAsync(
            "dotnet",
            ["test", "EquipmentReservation.sln", "--nologo", "--verbosity", "minimal"],
            cancellationToken);

        return workspace.ToJson(new
        {
            success = result.ExitCode == 0,
            result.ExitCode,
            stdout = result.StandardOutput,
            stderr = result.StandardError
        });
    }
}
