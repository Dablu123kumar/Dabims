import app from "./src/app.js";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/db/db.js";

connectDB()

  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
