import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { log } from 'console';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.repository.insert([room1, room2, room3]);
  }

  async find(pageNo: number, pageSize: number) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    const skipCount = (pageNo - 1) * pageSize;

    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
    });

    return {
      meetingRooms,
      totalCount,
    };
  }
  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }
    return await this.repository.save(meetingRoomDto);

    //在数据库层面添加唯一性约束后 可以使用 try catch 来捕获数据库的报错 也可以在应用层面处理数据重复的问题
    // try {
    //   return await this.repository.save(meetingRoomDto);
    // } catch (error) {
    //   console.log(error);
    //   throw new BadRequestException(error?.message);
    // }
  }
  async update(id: number, meetingRoomDto: CreateMeetingRoomDto) {
    return await this.repository.update(id, meetingRoomDto);
  }
  async delete(id: number) {
    return await this.repository.delete(id);
  }
}
