export function stopEvent(e) {
  e.stopPropagation();

  e.preventDefault();
}
