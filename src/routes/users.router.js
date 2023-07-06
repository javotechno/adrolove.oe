import { Router } from "express";
import { deleteInactiveUsers, getUsersInfo } from "../controllers/user.controller.js";

const router = Router()

// Obtiene a los usuarios de la siguiente manera { first_name, email, role } = user
router.get('/', getUsersInfo)

// Borra usuarios con una ultima conexion mayor a 2 dias
router.delete('/', deleteInactiveUsers)

export default router