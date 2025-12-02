import { Session } from "./Types"

export class SessionManager {
    private sessions = new Map<string, Session>();
    private timeExpirate = 10 * 60 * 1000

    get(telefone: string): Session | undefined{
        const session = this.sessions.get(telefone)

        if(!session) return undefined

        if(Date.now() > session.expireAt){
            this.sessions.delete(telefone)
            return undefined
        }

        return session
    }

    set(telefone: string, data: Partial<Session>){
        const old = this.get(telefone) || {}
        
        const newSession: Session = {
            idBarber: data.idBarber ?? (old as Session).idBarber ?? 0,
            idClient: data.idClient ?? (old as Session).idClient ?? 0,
            nameClient: data.nameClient ?? (old as Session).nameClient ?? "",
            step: data.step ?? (old as Session).step ?? "começo",
            expireAt: Date.now() + this.timeExpirate
        }

        this.sessions.set(telefone,newSession)

        return newSession
    }

    delete(telefone: string){
        this.sessions.delete(telefone)
    }
}