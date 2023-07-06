import { Router } from "express";
import { addProd, deleteProd, getById, getProds, updateProd } from '../controllers/products.controller.js'
import { checkOwner, isAdmin, isPremium } from "../middlewares/role.middleware.js";

// api/products
const prodRouter = new Router();

//  listar todos los prods
prodRouter.get("/", getProds);

// traer el prod seleccionado
prodRouter.get("/:pid", getById);

// agregar prod
prodRouter.post("/", isPremium, addProd);

// actualizar prod seleccionado
prodRouter.put("/:pid", checkOwner, updateProd);

// borrar prod seleccionado
prodRouter.delete("/:pid", checkOwner, deleteProd);

export default prodRouter;
