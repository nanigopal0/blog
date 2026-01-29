export default function FormatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-us", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
