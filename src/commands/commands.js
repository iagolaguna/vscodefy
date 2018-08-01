import { commands, Uri } from 'vscode';
import axios from 'axios';
import PubSub from 'pubsub-js';
const token = 'BQCi7H5G_gWYBYP1-iJLtpaOWNeAWdXPqCTxtItro5YlEGytuP9Ywo3WOEpYP-R9rzdAmp4zd0Zi2Lpt1K9tp07SJvJT0yuHWHG4dRd1w0bSy_PJ_igcpKqEJF_QhymaE6p5W5h4TMU58OhOTH6oS-Z4inmDfPiNN-mM';
const prefix = 'Bearer';
const totalToken = `${prefix} ${token}`;
const spotifyUrl = 'https://api.spotify.com/v1/me/player';

async function next () {
  try {
    await axios
      .post(`${spotifyUrl}/next`, {}, {
        headers: {
          'Authorization': totalToken
        }
      });
    PubSub.publish('next', null);
  } catch (err) {
    console.log(err);
  }
}

async function previous () {
  try {
    await axios
      .post(`${spotifyUrl}/previous`, {}, {
        headers: {
          'Authorization': totalToken
        }
      })
    PubSub.publish('previous', null);
  } catch (err) {
    console.log(err);
  }
}

async function pause () {
  try {
    await axios
      .put(`${spotifyUrl}/pause`, {}, {
        headers: {
          'Authorization': totalToken
        }
      })
    PubSub.publish('pause', null)
  } catch (err) {
    console.log(err);
  }
}

async function play () {
  try {
    await axios
      .put(`${spotifyUrl}/play`, {}, {
        headers: {
          'Authorization': totalToken
        }
      })
    PubSub.publish('play', null)
  } catch (err) {
    console.log(err);
  }
}

async function signIn () {
  const data = await commands.executeCommand('vscode.open', Uri.parse('http://localhost:8080'))
  console.log(data);
  // TODO a view pode ser mudada só após de um login efetuado com sucesso
  // PubSub.publish('signIn', null)
}

async function handleUri (uri) {
  console.log(uri);
}

export {
  previous,
  next,
  pause,
  play,
  signIn,
  handleUri
};
