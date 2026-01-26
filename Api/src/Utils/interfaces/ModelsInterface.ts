export interface ModelsInterface<T> {
    create(entity: T): Promise<boolean | void | T | number>
    update?(entity:T): Promise<void | boolean>
    login?(name: string, password: string): Promise<number | boolean>
    findAll?<Type>(idBarber: number): Promise<Type[] | any>
}