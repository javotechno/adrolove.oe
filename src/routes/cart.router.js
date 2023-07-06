import { Router } from "express";
import { isUser } from '../middlewares/role.middleware.js'
import {
  addToCart,
  createCart,
  emptyCart,
  getCart,
  purchaseCart,
  removeFromCart,
  replaceCart,
  sumQuantity,
} from "../controllers/cart.controller.js";

const router = new Router();

// Nuevo carrito
router.post("/", isUser, createCart);

// Listar prods
router.get("/:cid", getCart);

// Actuliza el carrito por el array del body
router.put("/:cid", isUser, replaceCart);

// Elimina todo el array
router.delete("/:cid", isUser, emptyCart);

router.post("/:cid/purchase", purchaseCart);

// Agregar prod al arr de prods dentro del carrito seleccionado
router.post("/:cid/product/:pid", isUser, addToCart);

// Actualiza la quantity
router.put("/:cid/product/:pid", isUser, sumQuantity);

// Eliminar prods del array del carrito
router.delete("/:cid/product/:pid", isUser, removeFromCart);

export default router;
