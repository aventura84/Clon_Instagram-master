const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
const Joi = require('joi');
const keys = require('../keys');

const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(4).max(10).required(),
    });
    const validation = schema.validate({ email, password });

    if (validation.error) {
      throw generateError('Son necesarios un email y un password', 400);
    }

    const id = await createUser(email, password);

    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const schema = Joi.number().positive().integer().required();
    const validation = schema.validate(id);

    if (validation.error) {
      throw generateError('El usuario debe ser un numero', 401);
    }

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4).max(10).required(),
    });
    const validation = schema.validate({ email, password });

    if (validation.error) {
      throw generateError('Los datos introducidos son incorrectos', 400);
    }

    // Recojo los datos de la base de datos del usuario con ese mail
    const user = await getUserByEmail(email);

    // Compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('El nombre o la contraseña no son validos', 401);
    }

    // Creo el payload del token
    const payload = { id: user.id };

    // Firmo el token
    const token = jwt.sign(payload, keys.jwtSecret, {
      expiresIn: '7d',
    });

    // Envío el token
    res.send({
      status: 'ok',
      data: {
        id: user.id,
        email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
};
