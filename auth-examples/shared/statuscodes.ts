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

    // Jwt error codes
    TOKEN_BAD = -4001,
    TOKEN_EMPTY = -4002,
}

export enum StatusMessage {
    SUCCESS = "Successful",

    INVALID_DATA_FORMAT = "Invalid data format",
    RESOURCE_ACCESS_DENIED = "Access to this resouce is denied",
    EMAIL_ALREADY_EXISTS = "This email is already taken",
    REQUEST_PARSE_ERROR = "The server was unable to parse your request",
    USER_NOT_REGISTERED = "You are not a registered user",

    API_LIMIT_EXCEEDED = "You have reaced the max number of times you can query this API",
    API_KEY_EMPTY = "Api Key is empty",

    TOKEN_BAD = "The token you've passed is malformed",
    TOKEN_EMPTY = "The token you've passed is empty",
}

export function isStatusValid(status: StatusCodes) {
    return status == StatusCodes.SUCCESS
}
