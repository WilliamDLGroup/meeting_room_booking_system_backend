import { createConnection } from 'typeorm';

async function testConnection() {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3307,
      username: 'root',
      password: '964237',
      database: 'meeting_room_booking_system',
    });
    console.log('Database connected successfully');
    await connection.close();
  } catch (error) {
    console.error('Database connection failed', error);
  }
}

testConnection();
