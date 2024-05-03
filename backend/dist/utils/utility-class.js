class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // superclass mein jo message hai usme set kardo
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;
