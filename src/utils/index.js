export function getAuthContentFromData (data) {
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
export function validCache ({ tokenType, accessToken, refreshToken }) {
  return !!tokenType && !!accessToken && !!refreshToken
}
