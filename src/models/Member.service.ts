import MemberModel from '../schema/Member.model';
import { Member, MemberInput, LoginInput } from '../libs/types/member';
import { MemberStatus } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from '../libs/Errors';
import bcrypt from 'bcryptjs';

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      const member = result.toObject() as Member;

      delete member.memberPassword;

      return member;
    } catch (err: any) {
      console.error('Error, model:signup', err);
     
      if(err.code === 11000) {
        throw new Errors(
          HttpCode.BAD_REQUEST,
          Message.USED_NICK_PHONE
        );
      }

        throw new Errors(
          HttpCode.INTERNAL_SERVER_ERROR,
          Message.SOMETHING_WENT_WRONG
        );
    }
  }

  public async login(input: LoginInput): Promise<Member> {

     const member = await this.memberModel.findOne({
       memberNick: input.memberNick,
       memberStatus: {$ne: MemberStatus.DELETE}
     },
     {
      memberNick: 1,
      memberPassword: 1,
      memberStatus: 1
    } 
    )
    .exec();
     if(!member) {
      throw new Errors(
         HttpCode.NOT_FOUND,
         Message.NO_MEMBER_NICK,
      );
     } else if ( member.memberStatus === MemberStatus.BLOCK) {
       throw new Errors(
         HttpCode.FORBIDDEN,
         Message.BLOCKED_USER,
       );
     }

     const isMatch = await bcrypt.compare(
      input.memberPassword,   
      member.memberPassword,
     );

     if(!isMatch){
      throw new Errors(
        HttpCode.UNAUTHORIZED,
        Message.WRONG_PASSWORD);
     }
     const result = await this.memberModel
       .findById(member._id, {
         memberPassword:0
       })
       .lean()
       .exec();

       if(!result) {
        throw new Errors(
          HttpCode.NOT_FOUND,
          Message.NO_MEMBER_NICK
        );
       }

       return result;
  }
   

}

export default MemberService;
