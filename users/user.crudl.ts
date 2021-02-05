import { getRepository } from 'typeorm';
import { User } from './user.model';
import { validate } from 'class-validator';

async function list() {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.findAndCount({
      select: ["id", "username", "role"]
    });
    return users;
  } catch (err) {
    throw err;
  }
}

async function read(id: number) {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "username", "role"]
    });

    return user;
  } catch (err) {
    throw err;
  }
}

async function create(body: any) {
  try {
    //Get parameters from the body
    let user = new User();
    Object.keys(body).forEach(key => {
      user[key] = body[key];
    });

    //Validade if the parameters are ok
    await validate(user);

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      // res.status(409).send("");
      throw 'username already in use';
    }

    //If all ok, send 201 response
    return 'User created';
  } catch (err) {
    throw err;
  }
}

async function update(id: number, body: any) {
  try {
    //Try to find user on database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      // res.status(404).send("User not found");
      throw 'User not found';
    }

    //Get values from the body
    Object.keys(body).forEach(key => {
      user[key] = body[key];
    });

    //Validate the new values on model
    await validate(user);

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      // res.status(409).send("username already in use");
      throw 'username already in use';
    }
    //After all send a 204 (no content, but accepted) response
    return;
  } catch (err) {
    throw err;
  }
}

async function destroy(id: number) {
  try {
    const userRepository = getRepository(User);
    try {
      await userRepository.findOneOrFail(id);
    } catch (err) {
      // res.status(404).send("User not found");
      throw err;
    }
    await userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return;
  } catch (err) {
    throw err;
  }
}

export {
  list,
  read,
  create,
  update,
  destroy,
};
