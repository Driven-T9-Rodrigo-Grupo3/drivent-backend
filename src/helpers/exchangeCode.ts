import 'dotenv/config';
import axios from 'axios';
import { invalidCredentialsError } from '@/services';

export async function exchangeCodeForAccessToken(clientCode: string) {
  const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, GITHUB_ACCESS_TOKEN_URL } = process.env;
  const body = {
    client_secret: CLIENT_SECRET,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code: clientCode,
    grant_type: 'authorization_code'
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const accessToken = new URLSearchParams(data).get('access_token');
  if (!accessToken) throw invalidCredentialsError();
  return accessToken;
}