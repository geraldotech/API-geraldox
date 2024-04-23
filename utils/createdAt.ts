export function createdAt2(): string {
  const options = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric', // Change '2-digit' to 'numeric' for 4-digit year
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const brazilianDate = new Date().toLocaleDateString('pt-BR', options);

  return brazilianDate  
}
