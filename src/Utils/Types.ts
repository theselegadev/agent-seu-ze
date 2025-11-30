export type Barber = {
    id?: number,
    name: string,
    telefone: string,
    address: string,
    password: string
}

export type Client = {
    id?: number,
    name: string,
    telefone: string, 
}

export type Agenda = {
    id?: number,
    client_id: number,
    barber_id: number,
    datetime: string,
}

export type AgendaWithClientInfo = {
    nome: string,
    telefone: string,
    data: string
}

export type Hours = {
    id?: number,
    barberId: number,
    date: string,
    hour: string,
    available?: boolean 
}