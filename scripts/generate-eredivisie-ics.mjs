import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = process.env.SUPERELF_API_URL ?? "https://api.superelf-eredivisie.nl";
const API_VERSION = process.env.SUPERELF_API_VERSION ?? "25";
const LEAGUE = "Eredivisie";
const SEASON = "2026/2027";
const SOURCE_DIRECTORY = resolve(dirname(fileURLToPath(import.meta.url)), "../src");

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "X-Api-Version": API_VERSION },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${path}`);
  }
  return response.json();
}

function formatUtc(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeText(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line) {
  const chunks = [];
  let current = "";
  let currentLength = 0;

  for (const character of line) {
    const characterLength = Buffer.byteLength(character);
    if (currentLength + characterLength > 75) {
      chunks.push(current);
      current = ` ${character}`;
      currentLength = 1 + characterLength;
    } else {
      current += character;
      currentLength += characterLength;
    }
  }
  chunks.push(current);
  return chunks.join("\r\n");
}

async function writeCalendar(fileName, period, generatedAt) {
  const endsAt = new Date(period.end);
  const startsAt = new Date(endsAt.getTime() - 60 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SuperElf//Eredivisie 2026-2027//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${period.name}`,
    "X-WR-TIMEZONE:Europe/Amsterdam",
    "BEGIN:VEVENT",
    `UID:superelf-${SEASON.replace("/", "-")}-${period.id}@superelf-eredivisie.nl`,
    `DTSTAMP:${generatedAt}`,
    `DTSTART:${formatUtc(startsAt)}`,
    `DTEND:${formatUtc(endsAt)}`,
    `SUMMARY:${escapeText(period.name)}`,
    `DESCRIPTION:${escapeText(`${period.name} voor SuperElf ${SEASON}`)}`,
    "URL:https://superelf-eredivisie.nl/",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT8H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`${period.name} over 8 uur`)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`${period.name} over 3 dagen`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const outputFile = resolve(SOURCE_DIRECTORY, fileName);
  const temporaryFile = `${outputFile}.tmp`;
  const contents = `${lines.map(foldLine).join("\r\n")}\r\n`;
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(temporaryFile, contents, "utf8");
  await rename(temporaryFile, outputFile);
  console.log(`Created ${outputFile} with 1 period deadline.`);
}

async function main() {
  const configs = await fetchJson("/public/competitionconfigs/active");
  const config = configs.find(
    (candidate) =>
      candidate.sourceCompetition?.league?.name === LEAGUE &&
      candidate.sourceCompetition?.season?.name === SEASON,
  );
  if (!config) {
    throw new Error(`No active ${LEAGUE} competition found for ${SEASON}`);
  }

  const calendars = [
    {
      fileName: "2627ere-assemble.ics",
      period: {
        id: `assemble-${config.assemblePeriod.id}`,
        name: "Einde opstellingsperiode",
        end: config.assemblePeriod.end,
      },
    },
    {
      fileName: "2627ere-transfer.ics",
      period: {
        id: `transfer-${config.transferPeriod.id}`,
        name: "Einde transferperiode",
        end: config.transferPeriod.end,
      },
    },
  ];

  const generatedAt = formatUtc(new Date());
  await Promise.all(
    calendars.map(({ fileName, period }) =>
      writeCalendar(fileName, period, generatedAt),
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
