import { NextFunction, Request, Response } from 'express';
import { T } from '../libs/types/common';
import { LoginInput, Member, MemberInput } from '../libs/types/member';
import MemberService from '../models/Member.service';
import Errors from '../libs/Errors';

const memberService = new MemberService();
const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log('signup:', req.body);

    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);

    res.json({ member: result });
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
    console.log("login:", req.body);

    const input: LoginInput = req.body;
    const result: Member = await memberService.login(input);
    
    res.json({member: result });
  }catch (err) {
     console.log('Error, login:', err);

     if(err instanceof Errors) {
        res.status(err.code).json(err);
     }else {
        res.status(Errors.standard.code).json(Errors.standard);
     }
  }
};



export default memberController;
