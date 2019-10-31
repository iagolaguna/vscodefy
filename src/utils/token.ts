
export function getAuthContentFromData(data:AuthDataSplited = {} ) {
    const {
        token_type: tokenType,
        access_token: accessToken,
        refresh_token: refreshToken
    } = data
    const authContent = { tokenType, accessToken, refreshToken }
    if (!authContent.refreshToken) {
        delete authContent.refreshToken
    }
    return authContent
}

export function validCache(data:AuthData) {
    return data && (!!data.tokenType && !!data.accessToken && !!data.refreshToken)
}

export function isLogged(data:AuthData) {
    return validCache(data)
}
