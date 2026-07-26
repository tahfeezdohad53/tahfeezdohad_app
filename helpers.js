export function formatName(name) {
  if(!name) return '';
  const firstChar = name
    .split(" ")[1]
    .slice(0, 1)
    .toUpperCase()
    .concat(name.split(" ")[1].slice(1));
  const formattedName = firstChar.concat(
    " " + name.split(" ").slice(2).join(" "),
  );
  return formattedName;
}
