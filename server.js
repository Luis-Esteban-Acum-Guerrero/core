import express from "express";
import siiRoutes from "./routes/sii.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import auth from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use("/sii", auth, siiRoutes);
app.post("/test", (req, res) => res.send("API OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));

/**
 * ! DEBUG
 * hacer debug con el RUT 76252332-9, tiene un alert, posterior al login
 */
