export function createdAt(): string {
  // Create a new Date object with the current date and time
  const today = new Date();

  // Set options for formatting the date and time in Brazilian time zone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  // Format the date and time using toLocaleString method
  const formattedDateTime = today.toLocaleString('pt-BR', options);

  // Extract day, month, and year components
  const [day, month, year] = formattedDateTime.split(/[\/,\s,:]/);

  // Return the date in dd/mm/yyyy format
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}
