import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { userModel } from "../dao/models/users.model.js";
import { cartModel } from "../dao/models/carts.model.js";
import { hashPassword } from "../utils.js";
import config from "../config/config.js";
import "dotenv/config";

passport.use(
  "singup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await userModel.findOne({ email });
      if (user) {
        return done(null, false);
      } else {
        const hashNewPass = await hashPassword(password);
        const cart = await cartModel.create({
          products: [],
        });
        const newUser = await userModel.create({
          ...req.body,
          password: hashNewPass,
          role: "user",
          cart: cart._id,
        });
        done(null, newUser);
      }
    }
  )
);

passport.use(
  'github',
  new GithubStrategy(
    {
      scope: [ 'user:email' ],
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${config.rail}/login/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // uso profile.emails[0].value porque el profile._json.email no funciona
      const user = await userModel.findOne({ email: profile.emails[0].value });
      if (!user) {
        
        const cart = await cartModel.create({
            products: [],
          });
        const newUser = userModel.create({
            first_name: profile._json.name ? profile._json.name.split(' ')[0] : profile._json.login ,
            last_name: profile._json.name ?  profile._json.name.split(' ')[1] === null ? ' ' : ' ' : ' ' ,
            email: profile.emails[0].value || ' ',
            password: ' ',
            photo: profile._json.avatar_url,
            cart: cart,
            isGithub: true
          })
          done(null, newUser)
      } else {
        done(null, user)
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);

});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});