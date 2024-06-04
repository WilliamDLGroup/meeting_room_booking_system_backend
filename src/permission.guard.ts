import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions) {
      return true;
    }

    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}

('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiemhhbmdzYW4iLCJyb2xlcyI6WyLnrqHnkIblkZgiXSwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2RlIjoiY2NjIiwiZGVzY3JpcHRpb24iOiLorr_pl64gY2NjIOaOpeWPoyJ9LHsiaWQiOjIsImNvZGUiOiJkZGQiLCJkZXNjcmlwdGlvbiI6Iuiuv - mXriBkZGQg5o6l5Y - jIn1dLCJpYXQiOjE3MTYxNzM2MTYsImV4cCI6MTcxNjE3NTQxNn0.N - jVDBfo1bReHZJvGiIMumj3E - l_0_ylsOqW2YKx2V4');

('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiemhhbmdzYW4iLCJyb2xlcyI6WyLnrqHnkIblkZgiXSwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2RlIjoiY2NjIiwiZGVzY3JpcHRpb24iOiLorr_pl64gY2NjIOaOpeWPoyJ9LHsiaWQiOjIsImNvZGUiOiJkZGQiLCJkZXNjcmlwdGlvbiI6Iuiuv-mXriBkZGQg5o6l5Y-jIn1dLCJpYXQiOjE3MTYxNzE3MTcsImV4cCI6MTcxNjE3MzUxN30.z0nHVuFiGAiOopdNjw-d0hSt3UBanooHWciXyOq_wSA ');

('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiemhhbmdzYW4iLCJyb2xlcyI6WyLnrqHnkIblkZgiXSwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2RlIjoiY2NjIiwiZGVzY3JpcHRpb24iOiLorr_pl64gY2NjIOaOpeWPoyJ9LHsiaWQiOjIsImNvZGUiOiJkZGQiLCJkZXNjcmlwdGlvbiI6Iuiuv-mXriBkZGQg5o6l5Y-jIn1dLCJpYXQiOjE3MTYxNzM5NDksImV4cCI6MTcxNjE3NTc0OX0.F6ypHO2e4cynZve248v_QtCz3wiD4SKupmfCUSfTTbM');

('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiemhhbmdzYW4iLCJyb2xlcyI6WyLnrqHnkIblkZgiXSwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2RlIjoiY2NjIiwiZGVzY3JpcHRpb24iOiLorr_pl64gY2NjIOaOpeWPoyJ9LHsiaWQiOjIsImNvZGUiOiJkZGQiLCJkZXNjcmlwdGlvbiI6Iuiuv-mXriBkZGQg5o6l5Y-jIn1dLCJpYXQiOjE3MTYyNTc0MzQsImV4cCI6MTcxNjI1OTIzNH0.NB6ejzAZU7CUFZiuljmR_o8Hg_EkLM0V3gL0ElmNVOg');
