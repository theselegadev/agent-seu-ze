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