import MemberModel from '../schema/Member.model';
import { Member, MemberInput } from '../libs/types/member';
import Errors, { HttpCode, Message } from '../libs/Error';
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
    } catch (err) {
        console.error("Error, model:signup", err);
        throw new Errors(
            HttpCode.BAD_REQUEST,
            Message.USED_NICK_PHONE
        );
    }
  }
}

export default MemberService;
