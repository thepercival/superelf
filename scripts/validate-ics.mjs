import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import ICAL from "ical.js";

const publicUrl = process.env.SUPERELF_PUBLIC_URL ?? "https://superelf-eredivisie.nl/";
const defaultFiles = [
  "src/2627ere-assemble.ics",
  "src/2627ere-transfer.ics",
];
const files = process.argv.slice(2);
if (files.length === 0) {
  files.push(...defaultFiles);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function validate(file) {
  const contents = await readFile(file, "utf8");
  const withoutCrLf = contents.replace(/\r\n/g, "");
  assert(!withoutCrLf.includes("\n") && !withoutCrLf.includes("\r"), "must use CRLF line endings");

  for (const line of contents.split("\r\n")) {
    assert(Buffer.byteLength(line) <= 75, "contains a line longer than 75 octets");
  }

  const calendar = new ICAL.Component(ICAL.parse(contents));
  assert(calendar.name === "vcalendar", "root component must be VCALENDAR");
  assert(calendar.getFirstPropertyValue("version") === "2.0", "VERSION must be 2.0");
  assert(calendar.hasProperty("prodid"), "PRODID is required");

  const events = calendar.getAllSubcomponents("vevent");
  assert(events.length === 1, `must contain exactly one VEVENT, found ${events.length}`);

  const eventComponent = events[0];
  const event = new ICAL.Event(eventComponent);
  assert(Boolean(event.uid), "VEVENT must have a UID");
  assert(Boolean(event.summary), "VEVENT must have a SUMMARY");
  assert(event.startDate !== null, "VEVENT must have a DTSTART");
  assert(event.endDate !== null, "VEVENT must have a DTEND");
  assert(event.duration.toSeconds() === 3600, "VEVENT must last exactly one hour");

  const alarms = eventComponent.getAllSubcomponents("valarm");
  assert(alarms.length === 2, `VEVENT must contain exactly two VALARMs, found ${alarms.length}`);
  const triggers = alarms.map((alarm) => {
    assert(alarm.getFirstPropertyValue("action") === "DISPLAY", "VALARM action must be DISPLAY");
    assert(alarm.hasProperty("description"), "DISPLAY VALARM must have a DESCRIPTION");
    return alarm.getFirstPropertyValue("trigger")?.toString();
  });
  assert(triggers.includes("-PT8H"), "VEVENT must have an alarm 8 hours before start");
  assert(triggers.includes("-P3D"), "VEVENT must have an alarm 3 days before start");

  console.log(`Valid iCalendar: ${file}`);
  console.log(`Public URL: ${new URL(basename(file), publicUrl)}`);
}

try {
  for (const file of files) {
    await validate(file);
  }
} catch (error) {
  console.error(`Invalid iCalendar: ${error.message}`);
  process.exitCode = 1;
}
