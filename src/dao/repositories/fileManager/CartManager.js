import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    try {

      const read = await fs.readFile(this.path, "utf-8");
      const cart = JSON.parse(read);
      const id = cart.length === 0 ? 0 : Number(cart[cart.length - 1].id) + 1;
      cart.push({ id, products: [] });
      await fs.writeFile(this.path, JSON.stringify(cart, null, 2), "utf-8");

      return { message: `carrito creado con el id ${id}` }

    } catch (err) {
      console.log(err);
    }
  }

  async deleteCart(id) {
    try {

      const read = await fs.readFile(this.path, "utf-8")
      const cart = JSON.parse(read)
      const deleted = cart.filter(e => e.id !== id)
      return deleted
      
    } catch (err) {
      console.log(err);
    }
  }

  async getCart(id) {
    try {

      const read = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(read);
      const search = carts.find((e) => e.id === id);
      if (!!search) {
        return search.products;
      } else {
        return { error: 'carrito inexistente' }
      }


    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(cid, pid) {
    try {
      const read = await fs.readFile(this.path, "utf-8");
      const cart = JSON.parse(read);
      const search = cart.find((e) => e.id === Number(cid)); // buscar el carrito
      if (!!search) {
        const isHere = search.products.find((e) => e.product === Number(pid)); // buscar producto
        if (!!isHere) {
          isHere.quantity++;
          await fs.writeFile(this.path, JSON.stringify(cart, null, 2), "utf-8"); 
          return { message: 'Se han agregado más unidades al produco existente' }
        } else {
          search.products.push({ product: Number(pid), quantity: 1 });
          await fs.writeFile(this.path, JSON.stringify(cart, null, 2), "utf-8");
          return { message: 'Se ha sumado el producto al carrito' }
        }
      } else {
        return { error: 'No se encuentra el carrito en la base de datos' }
      }

    } catch (err) {
      console.log(err);
    }
  }

  async removeFromCart(cid, pid) {
    try {
      const read = await fs.readFile(this.path, "utf-8");
      const cart = JSON.parse(read);
      let search = cart.find((e) => e.id === Number(cid)); // buscar el carrito
      if (!!search) {
        const isHere = search.products.find((e) => e.product === Number(pid)); // buscar producto
        if (!!isHere) {
          search.products.filter((e) => e.product !== pid);
          await fs.writeFile(this.path, JSON.stringify(cart, null, 2), "utf-8");
          return { message: 'Se ha eliminado el producto seleccionado' }
        } else {
          return { error: 'No se encuentra el producto en la base de datos' }
        }
      } else {
        return { error: 'No se encuentra el carrito en la base de datos' }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default CartManager;
