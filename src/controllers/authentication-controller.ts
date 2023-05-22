import { Request, Response } from 'express';
import httpStatus from 'http-status';
import authenticationService, { SignInParams } from '@/services/authentication-service';
import { exchangeCodeForAccessToken } from '@/helpers/exchangeCode';
import { fetchUser } from '@/helpers/fetchUser';


export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function singInGithub(req: Request, res: Response) {

  try {
    const githubToken = await exchangeCodeForAccessToken(req.body.code);
    const user = await fetchUser(githubToken);
    await authenticationService.signInGithub(githubToken, user.id);

    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

