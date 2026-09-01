import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

export async function getSheetData(range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });

  return response.data.values || [];
}

/**
 * Fetches a range using the FORMULA render option instead of the default
 * FORMATTED_VALUE. For plain text/number cells this returns the same raw
 * value as normal. For cells containing an `=IMAGE("url")` formula, this
 * is the ONLY render option that exposes the underlying URL — the default
 * FORMATTED_VALUE option returns the rendered image with no way to recover
 * the source URL.
 *
 * Note: this does NOT work for images inserted via Google Sheets'
 * "Insert image in cell" feature (pasting/uploading a picture directly).
 * That feature stores the image as a special cell object that Google's
 * Sheets API does not expose through values.get in any render mode. If a
 * column is meant to hold a photo, the cell must contain either a plain
 * image URL or an `=IMAGE("url")` formula for the API to be able to read it.
 */
export async function getSheetDataAsFormulas(range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueRenderOption: "FORMULA",
  });

  return response.data.values || [];
}