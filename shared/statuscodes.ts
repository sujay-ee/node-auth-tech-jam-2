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
    API_KEY_EMPTY = -2002,

    // Basic Auth errors

    // Jwt error codes
    TOKEN_BAD = -4001,
    TOKEN_EMPTY = -4002

}

export function isValid(status: StatusCodes) {
    return status == StatusCodes.SUCCESS
}
