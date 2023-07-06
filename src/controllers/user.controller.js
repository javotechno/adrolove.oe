import UserManager from "../dao/repositories/mongoManager/UserManager.js";
import UserDTO from '../dao/dto/UserDTO.js';
import { logger } from "../utils/logger.js";
import { generateToken, hashPassword, comparePasswords } from "../utils.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import jwt from 'jsonwebtoken'

const userManager = new UserManager();

export const githubCallback = (req, res) => {
  try {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    res.redirect(`/products/${req.session.passport.user}`);
  } catch (error) {
    logger.error('Error en el callback de GitHub:', error);
    res.status(500).json({ error: 'Error en el callback de GitHub' });
  }
};

export const loginGet = (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    logger.error('Error al realizar GET en el login:', error);
    res.status(500).json({ error: 'Error al realizar GET en el login' });
  }
};

export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userManager.loginUser(req.body);

    if (user) {
      req.session.email = email;
      req.session.role = user[0].role
      res.redirect(`/products/${user[0].id}`);
    } else {
      res.redirect("/errorLogin");
    }
  } catch (error) {
    logger.error('Error al realizar POST en el login:', error);
    res.status(500).json({ error: 'Error al realizar POST en el login' });
  }
};

export const getCurrent = (req, res) => {
  try {
    const user = req.session;
    const userDTO = new UserDTO(user);
    res.json(userDTO);
  } catch (error) {
    logger.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ error: 'Error al obtener el usuario actual' });
  }
};

export let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.nodemailerMail, // generated ethereal user
    pass: config.nodemailerPass, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false, // Ignorar la verificación del certificado
  },
});
// Esto forma parte de la entrega de la Clase 37
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await userManager.checkByEmail(email);
  const resetToken = generateToken(user);

  try {
    if (user) {
      // Generar token único y aleatorio
      user.resetToken = resetToken;
      await user.save();
    } else {
      // Si el usuario no existe, mostrar un mensaje de error
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Enviar correo electrónico de restablecimiento de contraseña
    const mailOptions = {
      from: 'noreply@example.com',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic <a href="${config.rail}/reset-password/${resetToken}">aquí</a> para restablecer tu contraseña.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Correo electrónico de restablecimiento de contraseña enviado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al solicitar el restablecimiento de contraseña" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verificar la validez del token y su fecha de expiración
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, config.secretJwt);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).send(`El enlace de restablecimiento de contraseña ha expirado, click <a href="/reset-password"/>aqui</a> para volver a a pedir un token.`)
      } else {
        throw err;
      }
    }

    // Actualizar la contraseña del usuario
    const userId = decodedToken.id;
    const hashedPassword = await hashPassword(password);
    // Actualizar la contraseña del usuario
    const user = await userManager.checkUser(userId)
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la nueva contraseña es igual a la contraseña actual
    const isSamePassword = await comparePasswords(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'No puedes utilizar la misma contraseña anterior' });
    }

    // Cambiar la contraseña del usuario utilizando la función del manager
    await userManager.changePassword(userId, password);

    res.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Token inválido' });
  }
};

export const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Verificar si la contraseña antigua coincide con la contraseña actual del usuario
    const user = await userManager.checkUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isSamePassword = await comparePasswords(oldPassword, user.password);
    if (!isSamePassword) {
      return res.status(400).json({ message: 'La contraseña antigua no coincide' });
    }

    // Actualizar la contraseña del usuario
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};

export const changeRole = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await userManager.checkUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedUser = await userManager.changeUserRole(userId);

    res.json({ message: 'Rol de usuario actualizado exitosamente', user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al actualizar el rol de usuario' });
  }
};

export const getUsersInfo = async (req, res) => {
  const users = await userManager.getUserInfo()
  res.json(users)
}

export const deleteInactiveUsers = async (req, res) => {
  try {
    await userManager.deleteUsers();
    res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
  }
}