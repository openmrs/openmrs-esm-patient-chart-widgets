import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
/// This function is STRICT on checking whether a date string is the openmrs format.
/// The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ
export function isOmrsDateStrict(omrsPayloadString: string): boolean {
  // omrs format 2018-03-19T00:00:00.000+0300
  if (
    omrsPayloadString === null ||
    omrsPayloadString === undefined ||
    omrsPayloadString.trim().length !== 28
  ) {
    return false;
  }
  omrsPayloadString = omrsPayloadString.trim();

  // 11th character will always be T
  if (omrsPayloadString[10] !== "T") {
    return false;
  }

  // checking time format
  if (
    omrsPayloadString[13] !== ":" ||
    omrsPayloadString[16] !== ":" ||
    omrsPayloadString[19] !== "."
  ) {
    return false;
  }

  // checking UTC offset format
  if (!(omrsPayloadString[23] === "+" && omrsPayloadString[26] !== ":")) {
    return false;
  }

  return dayjs(omrsPayloadString, "YYYY-MM-DDTHH:mm:ss.SSSZZ").isValid();
}

export function toDateObjectStrict(omrsDateString: string): Date {
  if (!isOmrsDateStrict(omrsDateString)) return null;
  return dayjs(omrsDateString, "YYYY-MM-DDTHH:mm:ss.SSSZZ").toDate();
}

export function toOmrsDateString(date: Date, toUTC = false): string {
  let d = dayjs(date);
  if (toUTC) {
    d = d.utc();
  }
  return d.format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
}

export function formatDate(date: Date, format?: string) {
  return dayjs(date).format(format || "DD-MMM-YYYY");
}
