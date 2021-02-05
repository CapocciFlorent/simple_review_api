import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../user.model';

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = 'admin';
    user.firstName = 'admin';
    user.lastName = 'admin';
    user.password = 'admin';
    user.email = 'capocciflorent@gmail.com';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }
}
