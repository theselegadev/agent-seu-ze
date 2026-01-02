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
    idBarber: number
}

export type Agenda = {
    id?: number,
    client_id: number,
    idBarber: number,
    datetime: string,
}

export type AgendaWithClientInfo = {
    nome: string,
    telefone: string,
    data: string
}

export type Hours = {
    id?: number,
    idBarber: number,
    date: string,
    hour: string,
    available?: boolean 
}

export type Session = {
    idBarber: number,
    idClient: number
    nameClient: string,
    nameBarber: string,
    date: string,
    time: string,
    expireAt: number,
    step: string
}