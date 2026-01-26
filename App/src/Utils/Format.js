export const FormatDate = (dateString) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'UTC'
    }).format(new Date(dateString));
}

export const FormatHour = (hourString) => {
    return hourString.slice(0,5);
}

export function FormatIsoInDateAndTime(isoString) {
  const date = new Date(isoString);

  const yyyyMmDd = date.toLocaleDateString("sv-SE", {
    timeZone: "America/Sao_Paulo"
  });

  const hhMm = date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return { date: yyyyMmDd, time: hhMm };
}
