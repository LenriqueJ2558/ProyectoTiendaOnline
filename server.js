const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
const PORT = process.env.PORT || 8080;
const productRoutes = require('./app/routes/producto.routes');
const categoryRouters=require ('./app/routes/category.routes')
const discountRouters = require ('./app/routes/discount.routes')
const CheckoutRouters = require ('./app/routes/checkout.routes')
const pay = require('./app/routes/paymen.routes')
require('dotenv').config();

const corsOptions = {
  origin: '*', // Reemplaza esto con la URL de tu frontend
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: "auth-session",
        keys: ["COOKIE_SECRET"], // should use as secret environment variable
        httpOnly: true,
    })
);

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");

const Role = db.role;

db.mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
    res.send("Hola desde Render");
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
app.use('/api', productRoutes,categoryRouters,discountRouters,CheckoutRouters,pay);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }