function getInitials(name) {
  if (!name) return "";
  const words = name.split(" ").filter((word) => word);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
  return initials;
}

export { getInitials };
