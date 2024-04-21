export function createdAt2(): string {
  const options = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  const brazilianDate = new Date().toLocaleDateString('pt-BR', options);

  return brazilianDate
  
}
