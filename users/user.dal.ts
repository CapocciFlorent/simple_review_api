import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './user.model';
import { validate } from 'class-validator';

async function login(body: any) {
  try {
    //Check if username and password are set
    let { username, password } = body;
    if (!(username && password))
      throw { error: 'login_invalid_params', details: 'useranme or password is empty' };


    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (err) {
      throw { code: 401, details: err };
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password))
      throw { code: 401,  error: 'password_invalid', details: 'invalid password in login funtion' };

    //Sing JWT, valid for 72 hour
    return jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "72h"}
    );
  } catch (err) {
    throw err;
  }
}

async function changePassword(id: number, body: any) {
  const { oldPassword, newPassword } = body;

  try {
    if (!(oldPassword && newPassword))
      throw { code: 400,  error: 'change_password_invalid_params', details: 'oldPassword or newPassword is empty' };

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (err) {
      throw { code: 401, err };
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword))
      throw { code: 401, error: 'password_invalid', details: 'invalid password in login funtion' };

    //Validate de model (password lenght)
    user.password = newPassword;
    await validate(user);

    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

  } catch (err) {
    throw err;
  }
}

export {
  login,
  changePassword,
};
