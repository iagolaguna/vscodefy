import axios from 'axios';
import { OAUTH_SERVER_URL, SPOTIFY_PLAYER_URL } from "../utils/constant";

export async function authorize(code: string) {
	return axios.get(`${OAUTH_SERVER_URL}/authorize?code=${code}`);
}

export async function getAvailableDevices() {
	const { data: { devices } } = await axios.get(`${SPOTIFY_PLAYER_URL}/devices`)
	return devices
}
