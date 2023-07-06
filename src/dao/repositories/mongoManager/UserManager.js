import { userModel } from "../../models/users.model.js";
import { cartModel } from "../../models/carts.model.js";
import { comparePasswords, hashPassword } from "../../../utils.js";
import { transporter } from "../../../controllers/user.controller.js";

class UserManager {
  async createUser(user) {
    try {
      const { email, password } = user;
      const userExists = await userModel.find({ email });

      if (userExists.length !== 0) {
        return null;
      } else {
        const hashNewPass = await hashPassword(password);
        const cart = await cartModel.create({
          products: [],
        });
        const newUser = await userModel.create({
          ...user,
          password: hashNewPass,
          role: "user",
          cart: cart._id,
        });
        return newUser;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async loginUser(user) {
    try {
      const { email, password } = user;
      const username = await userModel.find({ email });

      if (username.length !== 0) {
        const isPass = await comparePasswords(password, username[0].password);
        if (isPass) {
          return username;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkUser(id) {
    try {
      const user = await userModel.findById(id).lean();
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async checkByEmail(email) {
    try {
      const user = await userModel.find({ email });
      return user[0];
    } catch (err) {
      console.log(err);
    }
  }

  async changePassword(userId, newPassword) {
    try {
      // Obtener el usuario de la base de datos
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar la contraseña del usuario
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      return user;
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      throw error;
    }
  }

  async changeUserRole(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const newRole = user.role === "user" ? "premium" : "user";
      user.role = newRole;
      await user.save();

      return user;
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
      throw error;
    }
  }

  async getUserInfo() {
    try {
      const users = await userModel.find(
        {},
        { first_name: 1, email: 1, role: 1 }
      );
      return users;
    } catch (err) {
      console.error("Error al obtener informacion de los usuarios:", err);
      throw err;
    }
  }

  async deleteUsers() {
    try {
      const inactiveThreshold = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const inactiveUsers = await userModel.find({
        last_connection: { $lt: inactiveThreshold },
      });

      for (const user of inactiveUsers) {
        const mailOptions = {
          from: "noreply@example.com",
          to: user.email,
          subject: "Eliminación de cuenta por inactividad",
          text: "Su cuenta ha sido eliminada debido a la falta de actividad en los últimos días.",
        };

        await transporter.sendMail(mailOptions);
      }
      console.log(
        "Usuarios inactivos eliminados y correos enviados correctamente."
      );
    } catch (err) {
      console.error("Error al eliminar usuarios inactivos:", err);
      throw err;
    }
  }
}

export default UserManager;
