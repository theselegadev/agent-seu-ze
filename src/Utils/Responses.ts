export class Responses{
    static success(message: string,data: any[] = []){
        return {
            status: "success",
            message,
            data
        }
    }
    static error(message: string){
        return {
            status: "error",
            message,
            data: []
        }
    }
}