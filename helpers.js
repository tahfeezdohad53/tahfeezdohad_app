export function formatName(name) {
  if (!name) return "";
  // const firstChar = name
  //   .split(" ")[1]
  //   .slice(0, 1)
  //   .toUpperCase()
  //   .concat(name.split(" ")[1].slice(1));
  // const formattedName = firstChar.concat(
  //   " " + name.split(" ").slice(2).join(" "),
  // );

  const formattedName = name.split(' ').slice(1).map(el => el.slice(0,1).toUpperCase() + el.slice(1)).join(' ')

  return formattedName;
}

export function isIOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPadOS 13+ detection (reports as MacIntel but supports multi-touch)
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1)
  );
}