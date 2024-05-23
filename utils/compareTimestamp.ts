export function compareTimestampsDescending(a, b) {
  const timestampA = new Date(a.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))
  const timestampB = new Date(b.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))

  return timestampB - timestampA // Reversed order
}
