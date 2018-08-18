import { commands, window, Uri } from 'vscode'
import axios from 'axios'
import PubSub from 'pubsub-js'
import { isLogged } from '../utils'
import { SPOTIFY_PLAYER_URL, OAUTH_SERVER_URL, OAUTH_SITE_URL, VSCODEFY_CACHE } from '../constant'

async function next () {
  try {
    await axios
      .post(`${SPOTIFY_PLAYER_URL}/next`, {})
  } catch (error) {
    console.error(error)
    handler(error, previous)
  }
}

async function previous () {
  try {
    await axios
      .post(`${SPOTIFY_PLAYER_URL}/previous`, {})
  } catch (error) {
    console.error(error)
    handler(error, previous)
  }
}

async function play () {
  try {
    await axios
      .put(`${SPOTIFY_PLAYER_URL}/play`, {})
  } catch (error) {
    console.error(error)
    handler(error, play)
  }
}

async function pause () {
  try {
    await axios
      .put(`${SPOTIFY_PLAYER_URL}/pause`, {})
  } catch (error) {
    console.error(error)
    handler(error, pause)
  }
}

async function getAvailableDevices () {
  const { data: { devices } } = await axios.get(`${SPOTIFY_PLAYER_URL}/devices`)
  return devices
}

function getCurrentTrackAsync () {
  setTimeout(async () => {
    await getCurrentTrack()
  }, 500)
}

async function getCurrentTrack () {
  const response = await axios.get(`${SPOTIFY_PLAYER_URL}/currently-playing`, {})
  if (response.status === 204) {
    PubSub.publish('current-track', {})
    return
  }

  const {
    data: {
      progress_ms: progressMs,
      is_playing: isPlaying,
      item: {
        duration_ms: durationMs,
        name
      }
    }
  } = response
  PubSub.publish('current-track', { progressMs, durationMs, name, isPlaying })
}

async function login () {
  commands.executeCommand('vscode.open', Uri.parse(OAUTH_SITE_URL))
}

async function getCode () {
  const code = await window.showInputBox()
  if (!code || isLogged(this.globalState.get(VSCODEFY_CACHE))) {
    return
  }
  const { data: authorization } = await authorize(code)
  if (authorization.statusCode) {
    window.showErrorMessage('Spotify OAuth Code is wrong')
    return
  }
  PubSub.publish('signIn', authorization)
}

async function authorize (code) {
  return axios.get(`${OAUTH_SERVER_URL}/authorize?code=${code}`)
}

async function pickDevice () {
  const deviceNotFound = async () => { await window.showInformationMessage('Not found any available device, please connect on spotify in someone device') }
  const devices = await getAvailableDevices()

  if (!devices.length) {
    await deviceNotFound()
    return false
  }
  const deviceNames = devices.map(({ name }) => name)
  const deviceSelected = await window.showQuickPick(deviceNames)
  const device = devices.find(({ name }) => name === deviceSelected)
  if (!device) {
    return false
  }
  if (!device.id) {
    await deviceNotFound()
    return false
  }
  await axios.put(SPOTIFY_PLAYER_URL, { 'device_ids': [device.id] })
  return true
}

async function refreshToken (refreshToken) {
  return axios.get(`${OAUTH_SERVER_URL}/refreshToken?refreshToken=${refreshToken}`)
}

async function handler (error, callback = () => Promise.resolve()) {
  if (error && error.response && error.response.status === 404) {
    const success = await handlerNotFoundDevice()
    if (success) {
      setTimeout(() => callback(), 300)
    }
  }
}

async function handlerNotFoundDevice () {
  return pickDevice()
}

export {
  previous,
  next,
  pause,
  play,
  login,
  getCode,
  refreshToken,
  pickDevice,
  getCurrentTrackAsync
}
