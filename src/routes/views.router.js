import { Router } from "express"
import CartManager from "../dao/repositories/mongoManager/CartManager.js"
import UserManager from "../dao/repositories/mongoManager/UserManager.js"
import session from 'express-session'
import { mocking } from "../controllers/products.controller.js"
import { isPremium } from "../middlewares/role.middleware.js"

const views = Router()
const cartManager = new CartManager()
const userManager = new UserManager()

views.get("/", (req, res) => {
    res.render("home");
  });

views.get("/realtimeproducts", isPremium, async (req, res) => {
  res.render("realTimeProducts", { user: req.session  });
});

views.get("/chat", (req, res) => {
  res.render("chat");
});

views.get("/products", (req, res) => {
  const { user } = req.session
  res.render("products", user);
});

views.get("/cart/:id", async (req, res) => {
  res.render("cart", { cart: await cartManager.getCart(req.params.id), user: req.session.id });
});

views.delete('/cart/:id', async (req, res) => {
  const { id } = req.params
  await cartManager.emptyCart(id)
  res.send(`<a href="/">Volver</a>`)
})

views.get("/products/:id", async (req, res) => {
  res.render("products", { user: await userManager.checkUser(req.params.id) });
});

// render desde session.router.js para borrar la cookie
// views.get("/login", (req, res) => {
//   res.render("login");
// });

views.get("/signup", (req, res) => {
  res.render("signup");
});

views.get("/errorLogin", (req, res) => {
  res.render("errorLogin");
});

views.get("/errorSignUp", (req, res) => {
  res.render("errorSignup");
});

views.get("/perfil", (req, res) => {
  res.render("perfil");
});

views.get('/reset-password', (req, res) => {
  res.render('requestReset')
})

views.get('/reset-password/:token', (req, res) => {
  res.render('reset', { token: req.params.token })
})

views.get('/update-password', (req, res) => {
  res.render('update')
})

views.get("/mockingproducts", mocking);

export default views