import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Query,
  UnauthorizedException,
  UseGuards,
  SetMetadata,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import { PermissionGuard } from 'src/permission.guard';
import { UserInfoVo } from 'src/vo/user-info.vo';

import { UpdatePasswordDto } from './dto/update-password.dto';

import { UserInfo } from 'src/common/decorators/custom-decorators';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly userService: UserService) {}

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );

    return vo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('info')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ccc'])
  @UseGuards(PermissionGuard)
  async info(id: number = 5): Promise<UserInfoVo> {
    const user = await this.userService.findUserById(id);
    const vo = new UserInfoVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    // vo.nickName = user.nickName;
    vo.isFrozen = user.isFrozen;
    vo.roles = user.roles;
    vo.createTime = user.createTime;
    vo.updateTime = user.updateTime;

    return vo;
  }

  //修改用户密码
  @Post(['update_password', 'admin/update_password'])
  @SetMetadata('require-login', true)
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const res = await this.userService.updatePassword(
      userId,
      updatePasswordDto,
    );

    return res;
  }

  //忘记密码,找回密码

  //冻结用户 管理员权限
  @Get('freeze')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ccc'])
  @UseGuards(PermissionGuard)
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  //获取用户列表
  @Get('list')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ccc'])
  @UseGuards(PermissionGuard)
  async getUserList(
    @Query('pageNo', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) size: number,
  ) {
    const res = await this.userService.findUsersByPage(page, size);
    return res;
  }
}
