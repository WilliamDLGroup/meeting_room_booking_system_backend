import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';

import { generateParseIntPipe } from 'src/utils';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UserInfo } from 'src/common/decorators/custom-decorators';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('meetingRoomName') meetingRoomName: string,
    @Query('meetingRoomPosition') meetingRoomPosition: string,
    @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
    @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number,
  ) {
    return this.bookingService.find(
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @Post('apply')
  async apply(
    @Body() booking: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.bookingService.add(booking, userId);
    return 'success';
  }

  //预定状态 修改
  @Get('accept/:id')
  async accept(@Param('id') id: number) {
    return this.bookingService.accept(id);
  }

  @Get('reject/:id')
  async reject(@Param('id') id: number) {
    return this.bookingService.reject(id);
  }

  @Get('cancel/:id')
  async unbind(@Param('id') id: number) {
    return this.bookingService.unbind(id);
  }
}
