import 'dotenv/config';
import axios from 'axios';
import qs from 'query-string';

export async function exchangeCodeForAccessToken(codeClient:string) {
  const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, GITHUB_ACESS_TOKEN_URL } = process.env;
  const params = {
    client_secret: CLIENT_SECRET,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code: codeClient,
    grant_type: 'authorization_code'
  };

  const { data } = await axios.post(GITHUB_ACESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const parsedData = qs.parse(data);
  return parsedData.access_token as string;
}
