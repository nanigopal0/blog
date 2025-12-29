export default function FormatDate(date) {
  return new Date(date).toLocaleDateString("en-us", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
