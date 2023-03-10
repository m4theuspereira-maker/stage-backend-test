import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { PORT } from "./config/environment-consts";

const app = express();
app.use(cors());
app.use(routes);
const server = app.listen(PORT, () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log(`listening on port ${PORT} 🚀`);
});

export { server };
