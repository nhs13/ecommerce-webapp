class ErrorHandler extends Error{
    constructor(public message: string, public statusCode: number){
        super(message)   // superclass mein jo message hai usme set kardo
        this.statusCode = statusCode
    }
}

export default ErrorHandler