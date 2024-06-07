/**
 * @desc This is a function created in order send failure messages.
 *
 * @param {Response} res
 * @param {Object} error
 * @param {String} message
 * @param {Number} setStatus
 */
export const sendErrorResponse = (
    res,
    message,
    error={},
    setStatus = 400
) => {
    return res.status(setStatus).json({
        success: false,
        message: message,
        error: error
    })
}

/**
 * @desc This is a function created in order send success messages.
 *
 * @param {Response} res
 * @param {String} message
 * @param {Object} data
 * @param {Number} setStatus
 * @return {Response}
 */
export const sendSuccessResponse = (
    res,
    message,
    data={},
    setStatus=200
) => {
    return res.status(setStatus).json({
        success: true,
        message: message,
        data: data
    })
}
