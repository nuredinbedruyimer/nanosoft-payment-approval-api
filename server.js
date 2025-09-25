
import app from "./app.js";
import pool from "./database/database.js";

const PORT = process.env.PORT || 8000;

(async () => {

  try {

    await pool.connect(); 
    //  Verify the database connection
    console.log('Database Connected Successfully!!!');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Database connection failed and its error:', err);
    process.exit(1);
  }
})();