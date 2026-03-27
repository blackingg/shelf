export default function processDescription(descString: string) {
  const parser = new DOMParser();
  if (
    descString.includes("<b>") ||
    descString.includes("<br>") ||
    descString.includes("<p>")
  ) {
    const parsedDocument = parser.parseFromString(descString, "text/html");
    return parsedDocument.documentElement.textContent;
  } else {
    return descString;
  }
}
