import { getSheetData } from "./google-sheets";

export async function testSheet() {
  const data = await getSheetData("Profile!A:B");

  console.log(data);

  return data;
}