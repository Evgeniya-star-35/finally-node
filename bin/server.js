import { mkdir } from "fs/promises";
import app from "../app";
import db from "../config/db";

const PORT = process.env.PORT || 5050;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`);
});
