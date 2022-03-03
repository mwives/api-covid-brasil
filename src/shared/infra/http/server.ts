import express from "express";
import { router } from "./routes";

const app = express();

const PORT = process.env.PORT || 3333;

app.use(router);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
