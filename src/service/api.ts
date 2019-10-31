import axios from 'axios';
import { OAUTH_SERVER_URL } from "../utils/constant";

export async function authorize(code: string) {
	return axios.get(`${OAUTH_SERVER_URL}/authorize?code=${code}`);
}
