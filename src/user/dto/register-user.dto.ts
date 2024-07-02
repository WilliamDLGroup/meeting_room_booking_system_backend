import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;
  // @IsNotEmpty({
  //   message: '昵称不能为空',
  // })
  // @ApiProperty()
  // nickName: string;
  @IsNotEmpty({
    message: '密码不能为空',
  })

  //必须包含英文字母和数字
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      '密码必须至少包含一个大写字母、一个小写字母和一个数字,且长度不少于8个字符',
  })
  @ApiProperty()
  password: string;
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  @ApiProperty()
  email: string;
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
