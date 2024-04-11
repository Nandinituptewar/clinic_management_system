export default class CustomResponse {
    statusCode: number;
    message: String;
    public result: any;
    constructor( statusCodes: number, message: String, result?: any ) {
        this.statusCode = statusCodes;
        this.message = message;
        this.result = result;
    }
}
