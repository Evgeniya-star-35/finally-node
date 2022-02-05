const { colors } = require("../helpers");
const app = require("../app");
const db = require("../config/db");

const PORT = process.env.PORT || 5050;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`.cyan);
  });
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`.red);
});
