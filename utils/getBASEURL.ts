export function getBASEURL() {
  const BASEURL = process.env.BASEURL || `http://localhost:4444`
  return BASEURL
}
