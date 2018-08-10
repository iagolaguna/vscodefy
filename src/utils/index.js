export function getAuthContentFromData (data = {}) {
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
export function validCache (data) {
  return data && (!!data.tokenType && !!data.accessToken && !!data.refreshToken)
}

export function isLogged (data) {
  return validCache(data)
}
