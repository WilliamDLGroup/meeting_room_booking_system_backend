import { MeetingRoomService } from './meeting-room.service';
import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  Post,
  Body,
} from '@nestjs/common';
import { generateParseIntPipe } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
  ) {
    return await this.meetingRoomService.find(pageNo, pageSize);
  }

  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }
}
