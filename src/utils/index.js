export function getAuthContentFromData (data) {
  const {
    token_type: tokenType,
    access_token: accessToken,
    refresh_token: refreshToken
  } = data
  const authContent = { tokenType, accessToken, refreshToken }
  !authContent.refreshToken && delete authContent.refreshToken
  return authContent
}
