export const randomColorGenerator = () => {
  const pastelColors = [
    "#FFB3BA",
    "#BAFFC9",
    "#BAE1FF",
    "#FFFFBA",
    "#FFB3FF",
    "#FFE4B5",
    "#B0E0E6",
    "#DDA0DD",
    "#98FB98",
    "#87CEEB",
  ];
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};
