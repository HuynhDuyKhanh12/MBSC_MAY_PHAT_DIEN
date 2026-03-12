import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

app.use("/api", routes);
app.use(errorMiddleware);

export default app;