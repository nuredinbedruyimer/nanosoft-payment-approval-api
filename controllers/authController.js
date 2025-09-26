import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";
import pool from "../database/database.js";

const registerController = async (req, res) => {
  //  Get Infos
  const { email, password, role, name } = req.body;

  // Try-Catch

  try {
    //  Hash Password Before Store to database
    const hashedPassword = hashPassword(password);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, role, name) VALUES ($1,$2,$3,$4) RETURNING id,email,role,name",
      [email, hashed, role || "user", name]
    );

    res.status(201).send({
      status: "success",
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log("Error @RegisterController : ", error);

    //  Server Error -> Response

    res.status(500).send({
      status: "failure",
      message: "Something went wrong",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  //  Get Credential
  const { email, password } = req.body;
  try {
    // Get User By Him/Her Email

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];

    // User Does Not Exist

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //  Compare Entered Password and Existing Passwprd on Database

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Get Token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({
      token,
    });
  } catch (error) {
    console.log("Error @LoginController : ", error);

    //  Server Error -> Response

    res.status(500).json({
      status: "failure",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {registerController, loginController}
