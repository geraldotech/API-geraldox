/* 
if client send: 100% formated: minha-titra-ser-enviada agora
or not 'if client que enviar assim o server vai tratar'
*/

export function getSlugFromStringCustom(input: any) {
  return input
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\s+/g, '-')
  .slice(0, 75)
}