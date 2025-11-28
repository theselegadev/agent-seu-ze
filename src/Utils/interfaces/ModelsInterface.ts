export interface ModelsInterface<T> {
    create(entity: T): Promise<boolean | void>
    update?(entity:T): Promise<void>
    login?(name: string, password: string): Promise<boolean>
    findAll?<Type>(idBarber: number): Promise<Type[] | any>
}