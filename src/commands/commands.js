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
  } catch (err) {
    console.log(err)
  }
}

async function pause () {
  try {
    await axios
      .put(`${spotifyUrl}/pause`, {})
    PubSub.publish('pause', null)
  } catch (err) {
    console.log(err)
  }
}

function getCurrentTrackAsync () {
  setTimeout(() => getCurrentTrack(), 1000)
}

async function getCurrentTrack () {
  const { data: { progress_ms: progressMs, item: { duration_ms: durationMs, name } } } = await axios
    .get(`${spotifyUrl}/currently-playing`, {})
  PubSub.publish('current-track', { progressMs, durationMs, name })
}

async function signIn () {
  commands.executeCommand('vscode.open', Uri.parse('https://vscodefy.netlify.com/'))
}

async function getCode () {
  const code = await window.showInputBox()
  const { data: authorization } = await authorize(code)
  PubSub.publish('signIn', authorization)
}

async function authorize (code) {
  return axios.get(`http://localhost:8095/api/authorize?code=${code}`)
}

async function getDevice () {
  const deviceSelected = await window.showQuickPick(['Mobile', 'Desktop', 'Web'])
  return deviceSelected
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
  getDevice
}
