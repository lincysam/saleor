import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizePhone(phone: string) {
  try {
    const parsed = parsePhoneNumberFromString(phone, "IN");
    return parsed ? parsed.number : phone;
  } catch {
    return phone;
  }
}
