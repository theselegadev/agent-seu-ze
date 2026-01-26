export class DateValidator {
    static getDateTimeNow(): string{
        return new Date().toLocaleString("sv-SE",{
            timeZone: "America/Sao_Paulo",
            hour12: false
        }).slice(0,16)
    }

    static isAfterNow(dateTime: string): boolean {
        const dateTimeNow = this.getDateTimeNow()

        return dateTimeNow < dateTime
    }
}