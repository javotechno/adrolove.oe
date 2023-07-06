import ProductManager from "../dao/repositories/mongoManager/ProductManager.js";
import { faker } from "@faker-js/faker";
import { logger } from "../utils/logger.js";
import { errors } from "../utils/errors.js";
import { transporter } from "./user.controller.js";
import config from "../config/config.js";

const prod = new ProductManager();

export const getProds = async (req, res) => {
  try {
    const { title, page, limit, sort } = req.query;
    const result = await prod.getPagination(title, limit, page, sort);
    const next = result.hasNextPage
      ? `${config.rail}/api/products?page=${result.nextPage}`
      : null;
    const prev = result.hasPrevPage
      ? `${config.rail}/api/products?page=${result.prevPage}`
      : null;
    res.status(200).json({
      status: "sucess",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: prev,
      nextLink: next,
    });
  } catch (error) {
    logger.error("Error al obtener los productos:", error);
    res.status(500).json({ error: errors.unknownError });
  }
};

export const getById = async (req, res) => {
  try {
    const params = req.params;
    const prods = await prod.getProductById(params.pid);
    res.status(200).json(prods);
  } catch (error) {
    logger.error("Error al obtener el producto por ID:", error);
    res.status(500).json({ error: errors.unknownError });
  }
};

export const addProd = async (req, res) => {
  try {
    // Si el usuario no es admin guardar el mail del usuario premium
    const owner = req.user.role === 'admin' ? req.user.role : req.user.email

    const productData = { ...req.body, owner: owner };

    const response = await prod.addProduct(productData);
    if (response) {
      res.status(200).json({ message: "producto agregado", prod: productData });
    } else {
      res.json({ message: "error" });
    }
  } catch (error) {
    logger.error("Error al agregar el producto:", error);
    res.status(500).json({ error: errors.unknownError });
  }
};

export const updateProd = async (req, res) => {
  try {
    const id = req.params;
    const field = Object.keys(req.body).toString();
    const elem = Object.values(req.body).toString();
    const result = await prod.updateProduct(id.pid, field, elem);
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: errors.unknownError });
  }
};

export const deleteProd = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await MongoManager.deleteProduct(pid);

    // si el dueño del prod no es el admin mandar un mail registrado
    if (deletedProduct.owner !== "admin") {

      const mailOptions = {
        from: 'noreply@example.com',
        to: deletedProduct.owner,
        subject: 'Eliminación de producto',
        text: 'El producto que has publicado ha sido eliminado.'
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: 'Error desconocido' });
  }
};

export const mocking = (req, res) => {
  try {
    const mocks = [];
    while (mocks.length !== 100) {
      const { price, product, productDescription, department } = faker.commerce;
      const obj = {
        title: product(),
        description: productDescription(),
        price: price(),
        status: true,
        thumbnails: [],
        category: department(),
      };
      mocks.push(obj);
    }
    res.status(200).json(mocks);
  } catch (error) {
    logger.error("Error al generar datos falsos:", error);
    res.status(500).json({ error: errors.unknownError });
  }
};
