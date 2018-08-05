import { commands, window, Uri } from 'vscode'
import axios from 'axios'
import PubSub from 'pubsub-js'
const spotifyUrl = 'https://api.spotify.com/v1/me/player'

async function next () {
  try {
    await axios
      .post(`${spotifyUrl}/next`, {})
    PubSub.publish('next', null)
  } catch (err) {
    console.log(err)
  }
}

async function previous () {
  try {
    await axios
      .post(`${spotifyUrl}/previous`, {})
    PubSub.publish('previous', null)
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

async function play () {
  try {
    await axios
      .put(`${spotifyUrl}/play`, {})
    PubSub.publish('play', null)
  } catch (err) {
    console.log(err)
  }
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
