export class UserInfoVo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;
  roles: string[];

  phoneNumber: string;
  isFrozen: boolean;
  createTime: Date;
  updateTime: Date;
}
