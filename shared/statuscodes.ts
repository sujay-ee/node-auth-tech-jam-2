export enum StatusCodes {

    SUCCESS = 0,

    // Input errors
    INVALID_DATA_FORMAT = -1001,
    RESOURCE_ACCESS_DENIED = -1002,
    EMAIL_ALREADY_EXISTS = -1003,
    REQUEST_PARSE_ERROR = -1004,
    USER_NOT_REGISTERED = -1005,

    // Api key errors
    API_LIMIT_EXCEEDED = -2001,

    // Basic Auth errors

    // Jwt error codes
    INVALID_SESSION_TOKEN = -4001

}

export function isValid(status: StatusCodes) {
    return status == StatusCodes.SUCCESS
}
