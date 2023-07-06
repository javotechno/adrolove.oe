import CartManager from "../dao/repositories/mongoManager/CartManager.js";
import { logger } from "../utils/logger.js";

const cart = new CartManager();

export const createCart = async (req, res) => {
  try {
    const result = await cart.createCart();
    res.json(result);
  } catch (error) {
    logger.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

export const getCart = async (req, res) => {
  try {
    const id = req.params.cid;
    const myCart = await cart.getCart(id);
    res.json(myCart);
  } catch (error) {
    logger.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const replaceCart = async (req, res) => {
  try {
    const params = req.params;
    const result = await cart.replaceCart(params.cid, req.body);
    res.json(result);
  } catch (error) {
    logger.error("Error al reemplazar el carrito:", error);
    res.status(500).json({ error: "Error al reemplazar el carrito" });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const params = req.params;
    const result = await cart.emptyCart(params.cid);
    res.json(result);
  } catch (error) {
    logger.error("Error al vaciar el carrito:", error);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

export const addToCart = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado
    const { cid, pid } = req.params;
    const uid = req.user.id;

    // Verificar si el usuario ya ha creado el producto
    const existingProduct = await prod.getProductByUserId(uid)
    if (existingProduct) {
      return res.status(400).json({ message: "El usuario ya ha creado este producto" });
    }

    const result = await cart.addToCart(cid, pid);
    res.json(result);
  } catch (error) {
    logger.error("Error al agregar al carrito:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const params = req.params;
    const result = await cart.removeFromCart(params.cid, params.pid);
    res.json(result);
  } catch (error) {
    logger.error("Error al eliminar del carrito:", error);
    res.status(500).json({ error: "Error al eliminar del carrito" });
  }
};

export const sumQuantity = async (req, res) => {
  try {
    const params = req.params;
    const { quantity } = req.body;
    const result = await cart.sumQuantity(params.cid, params.pid, quantity);
    res.json(result);
  } catch (error) {
    logger.error("Error al sumar la cantidad:", error);
    res.status(500).json({ error: "Error al sumar la cantidad" });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const ticket = await cart.purchase(cid);
    res.render('done', { ticket: ticket })
  } catch (error) {
    logger.error("Error al realizar la compra:", error);
    res.status(500).json({ error: "Error al realizar la compra" });
  }
};
