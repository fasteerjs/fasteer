export const compareObjects = (
  found: Record<string, any>,
  expect: Record<string, any>
) => {
  for (const key in expect) {
    if (!found[key]) return false
  }
  return true
}
