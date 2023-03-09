import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(routes);
const server = app.listen(3001, () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log(`listening on port ${3000} 🚀`);
});

export { server };
