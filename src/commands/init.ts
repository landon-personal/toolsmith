import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join, relative } from "node:path";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import type { TaskFile, ToolFile } from "../types.js";
import { VERSION } from "../version.js";

export interface InitOptions {
  directory?: string;
  force?: boolean;
}

export async function runInit(
  options: InitOptions = {},
  io: CommandIO = defaultIO
): Promise<void> {
  const targetDirectory = resolve(options.directory ?? process.cwd());
  const scaffoldFiles = buildStarterFiles();
  const writtenFiles: string[] = [];
  const skippedFiles: string[] = [];

  await mkdir(targetDirectory, { recursive: true });

  for (const file of scaffoldFiles) {
    const filePath = join(targetDirectory, file.name);
    const displayPath = displayRelativePath(filePath);

    try {
      await writeFile(filePath, `${JSON.stringify(file.contents, null, 2)}\n`, {
        flag: options.force ? "w" : "wx"
      });
      writtenFiles.push(displayPath);
      io.stdout(`${options.force ? "Wrote" : "Created"} ${displayPath}`);
    } catch (error: unknown) {
      if (isNodeError(error) && error.code === "EEXIST") {
        skippedFiles.push(displayPath);
        io.stdout(`${displayPath} already exists; leaving it unchanged.`);
        continue;
      }

      throw error;
    }
  }

  if (writtenFiles.length > 0) {
    io.stdout("");
    io.stdout(`${options.force ? "Written" : "Created"} files: ${writtenFiles.join(", ")}`);
  } else if (skippedFiles.length > 0) {
    io.stdout("");
    io.stdout("No starter files were created.");
  }

  if (skippedFiles.length > 0) {
    io.stdout(`Existing files left unchanged: ${skippedFiles.join(", ")}`);
  }

  io.stdout("");
  io.stdout("Next steps:");
  io.stdout("  toolsmith lint .");
  io.stdout("  toolsmith eval .");
  io.stdout("  toolsmith report");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function displayRelativePath(path: string): string {
  return relative(process.cwd(), path) || path;
}

function buildStarterFiles(): Array<{ name: string; contents: unknown }> {
  return [
    {
      name: "toolsmith.config.json",
      contents: {
        version: VERSION,
        profile: "local-only",
        safety: {
          network: false,
          realEmail: false,
          realCalendar: false,
          realDatabase: false,
          printEnvironment: false
        }
      }
    },
    {
      name: "tools.json",
      contents: buildStarterTools()
    },
    {
      name: "tasks.json",
      contents: buildStarterTasks()
    }
  ];
}

function buildStarterTools(): ToolFile {
  return {
    name: "calendar-email-starter",
    version: VERSION,
    description: "Mock-only starter tools for testing calendar and email tool selection.",
    safety: {
      network: false,
      realSideEffects: false
    },
    tools: [
      {
        name: "create_calendar_event",
        description:
          "Use this mock-only tool when the user asks to schedule, create, or add a calendar meeting or appointment.",
        sideEffects: "mock-only; no real calendar service is contacted",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            startsAt: {
              type: "string",
              description: "ISO date-time string."
            },
            durationMinutes: {
              type: "number"
            }
          },
          required: ["title", "startsAt"],
          additionalProperties: false
        },
        outputSchema: {
          type: "object",
          properties: {
            eventId: {
              type: "string"
            },
            created: {
              type: "boolean",
              const: false
            }
          },
          required: ["eventId", "created"]
        },
        examples: ["Schedule a demo meeting with Alex for Tuesday morning."],
        requiresConfirmation: true
      },
      {
        name: "send_email",
        description:
          "Use this mock-only tool when the user asks to email, tell, or message someone with a written update.",
        sideEffects: "mock-only; no real email service is contacted",
        inputSchema: {
          type: "object",
          properties: {
            to: {
              type: "string"
            },
            subject: {
              type: "string"
            },
            body: {
              type: "string"
            }
          },
          required: ["to", "subject", "body"],
          additionalProperties: false
        },
        outputSchema: {
          type: "object",
          properties: {
            messageId: {
              type: "string"
            },
            sent: {
              type: "boolean",
              const: false
            }
          },
          required: ["messageId", "sent"]
        },
        examples: ["Email Jordan a short status update about the release."],
        requiresConfirmation: true
      }
    ]
  };
}

function buildStarterTasks(): TaskFile {
  return {
    name: "calendar-email-starter",
    version: VERSION,
    tasks: [
      {
        id: "calendar-schedule-demo",
        prompt: "Schedule a demo meeting with Alex for Tuesday morning.",
        expectedTool: "create_calendar_event",
        successCriteria: [
          "The mock agent chooses the local calendar event tool.",
          "No real calendar service is contacted."
        ]
      },
      {
        id: "email-status-update",
        prompt: "Email Jordan a short status update about the release.",
        expectedTool: "send_email",
        successCriteria: [
          "The mock agent chooses the local email tool.",
          "No real email is sent."
        ]
      },
      {
        id: "calendar-ambiguous-message-meeting",
        prompt: "Message Alex to set up a meeting next week.",
        expectedTool: "create_calendar_event",
        successCriteria: [
          "This intentionally ambiguous task should expose a calendar/email keyword conflict.",
          "No real email or calendar service is contacted."
        ]
      }
    ]
  };
}
