export default function processDescription(descString: string) {
  if (!descString) return "";
  
  // Check for any HTML tag
  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(descString);
  
  if (hasHTML) {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(descString, "text/html");
    return parsedDocument.body.textContent || "";
  }
  
  return descString;
}
