import { StatusCodes, StatusMessage } from './statuscodes';

/**
 * Parse the output data and status code and package it as a JSON object
 * 
 * @param data, The data to be returned
 * @param statusCode, The status code returned
 * @returns data and StatusCode packaged as a JSON object
 */
export function getResponse(data: Object, statusCode?: StatusCodes) {
    // Set status code to success by default
    statusCode = statusCode || StatusCodes.SUCCESS

    return {
        data,
        status: statusCode,
        message: StatusMessage[StatusCodes[statusCode]]
    }
}
