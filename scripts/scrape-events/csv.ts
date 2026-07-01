import { writeFileSync } from 'fs'
import type { EventRow } from './types.js'
import { CSV_HEADERS } from './types.js'

/** Escapes a single CSV cell value per RFC 4180. */
function escapeCell(value: string): string {
  // Wrap in quotes if the value contains a comma, double-quote, or newline
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/** Serialises an array of EventRow objects to a CSV string. */
export function toCsv(events: EventRow[]): string {
  const header = CSV_HEADERS.join(',')
  const rows = events.map((event) =>
    CSV_HEADERS.map((col) => escapeCell(event[col])).join(','),
  )
  return [header, ...rows].join('\n') + '\n'
}

/** Writes the CSV to disk and returns the number of rows written. */
export function writeCsv(events: EventRow[], outputPath: string): void {
  const csv = toCsv(events)
  writeFileSync(outputPath, csv, 'utf-8')
}
