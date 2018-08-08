import { commands, window, Uri } from 'vscode'
import axios from 'axios'
import PubSub from 'pubsub-js'
const spotifyUrl = 'https://api.spotify.com/v1/me/player'

async function next () {
  try {
    await axios
      .post(`${spotifyUrl}/next`, {})
    getCurrentTrackAsync()
    PubSub.publish('next', null)
  } catch (err) {
    console.log(err)
  }
}

async function previous () {
  try {
    await axios
      .post(`${spotifyUrl}/previous`, {})
    getCurrentTrackAsync()
    PubSub.publish('previous', null)
  } catch (err) {
    console.log(err)
  }
}

async function play () {
  try {
    await axios
      .put(`${spotifyUrl}/play`, {})
    getCurrentTrackAsync()
    PubSub.publish('play', null)
  } catch (error) {
    const { response: { status } } = error
    if (status === 404) {
      await pickDevice()
      play()
    }
  }
}

async function pause () {
  try {
    await axios
      .put(`${spotifyUrl}/pause`, {})
    PubSub.publish('pause', null)
    getCurrentTrackAsync()
  } catch (err) {
    console.log(err)
  }
}

async function getAvailableDevices () {
  const { data: { devices } } = await axios.get(`${spotifyUrl}/devices`)
  return devices
}

function getCurrentTrackAsync () {
  setTimeout(() => getCurrentTrack(), 500)
}

async function getCurrentTrack () {
  const response = await axios.get(`${spotifyUrl}/currently-playing`, {})
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

async function signIn () {
  commands.executeCommand('vscode.open', Uri.parse('http://localhost:8080'))
}

async function getCode () {
  const code = await window.showInputBox()
  const { data: authorization } = await authorize(code)
  PubSub.publish('signIn', authorization)
}

async function authorize (code) {
  return axios.get(`http://localhost:8095/api/authorize?code=${code}`)
}

async function pickDevice () {
  const deviceNotFound = () => window.showInformationMessage('Not found any available device, please connect on spotify in someone device')
  const devices = await getAvailableDevices()

  if (!devices.length) {
    deviceNotFound()
    return
  }
  const deviceSelected = await window.showQuickPick(devices.map(({ name }) => name))
  const device = devices.find(({ name }) => name === deviceSelected)
  if (!device) {
    return
  }
  if (!device.id) {
    deviceNotFound()
    return
  }
  await axios.put(spotifyUrl, { 'device_ids': [device.id] })
}

async function refreshToken (refreshToken) {
  return axios.get(`http://localhost:8095/api/refreshToken?refreshToken=${refreshToken}`)
}

export {
  previous,
  next,
  pause,
  play,
  signIn,
  getCode,
  refreshToken,
  pickDevice,
  getCurrentTrackAsync
}
