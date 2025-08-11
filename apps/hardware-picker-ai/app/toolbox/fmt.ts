/**
 * Responsible for capitalizing the first letter of a given string
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const NON_ALPHANUM_RX = /[^a-zA-Z0-9_]/g;
const TO_UNDERSCORE_RX = /[-./ ]/g;
export const toScreamingSnakeCase = (str: string) =>
  str.replaceAll(TO_UNDERSCORE_RX, "_").replaceAll(NON_ALPHANUM_RX, "").toUpperCase();
