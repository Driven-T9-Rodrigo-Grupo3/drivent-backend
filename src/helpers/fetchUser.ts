import { invalidCredentialsError } from "@/services";
import axios from "axios";

export async function fetchUser(githubToken: string | string[]) {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${githubToken}`
    }
  });
  if (!response.data) throw invalidCredentialsError();
  return response.data;
}