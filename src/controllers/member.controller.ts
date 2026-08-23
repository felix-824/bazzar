import { json, NextFunction, Request, Response } from 'express';
import { T } from '../libs/types/common';
import { ExtendedRequest, LoginInput, Member, MemberInput } from '../libs/types/member';
import MemberService from '../models/Member.service';
import Errors, { HttpCode, Message } from '../libs/Errors';
import AuthService from '../models/Auth.service';
import { AUTH_TIMER } from '../libs/config';

const memberService = new MemberService();
const authService = new AuthService();
const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log('signup:', req.body);

    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);
    const token = await authService.createToken(result);

    res.cookie('accessToken', token, {
      //"accessToken" → cookie nomi  //token → createToken() yaratgan JWT
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({
      member: result,
      accessToken: token,
    });
  } catch (err) {
    console.log('Error, signup:', err);

    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log('Login:', req.body);
    const input: LoginInput = req.body;
    const result: Member = await memberService.login(input);

    console.log('memberService.loginDAN', result);

    const token = await authService.createToken(result);

    console.log('createTokenDAN', token);

    res.cookie('accessToken', token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log('Error, login:', err);

    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

memberController.logout = async (req: Request, res: Response) => {
  try {
    console.log('logout');
    res.cookie('accessToken', null, {
      maxAge: 0,
      httpOnly: true,
    });
    res.status(HttpCode.OK).json({
      logout: true,
    });
  } catch (err) {
    console.log('Error, logout', err);

    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

  //getMemberDetail → "Shu userning HOZIRGI ma'lumotini olib ber."
memberController.getMemberDetail = async (req: ExtendedRequest, res: Response) => {
  try {
    const member: Member = req.member;
    const result = await memberService.getMemberDetail(member);
    console.log("getMemberDetail result:", result);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

  //verifyAuth   → "Bu requestni KIM yubordi?"
memberController.verifyAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }
    const result = await authService.checkAuth(token);
    
    req.member = result;  //Autentifikatsiyadan o‘tgan memberni request obyektiga biriktir.
    next();
  } catch (err) {
    console.log('Error, verifyAuth:', err);

    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default memberController;
