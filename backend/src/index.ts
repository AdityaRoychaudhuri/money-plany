import app from "./server.js";
import initDB from "./config/initDB.js";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.SERVER_PORT;


initDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
});
