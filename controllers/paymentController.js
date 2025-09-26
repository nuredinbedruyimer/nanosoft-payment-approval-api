import { payment_status } from "../constant/payment.js";
import pool from "../database/database.js";

const createPayment = async (req, res) => {
  //  Get The Amount we gonna pay

  const { amount } = req.body;

  try {
    // Insert User and the amout payed
    const result = await pool.query(
      "INSERT INTO payment_requests (amount, user_id) VALUES ($1,$2) RETURNING *",
      [amount, req.user.id]
    );

    res.status(201).send({
      status: "success",
      message: `${amount} Payed Succcessfully But It needs Confirmation`,
      data: result.rows[0],
    });
  } catch (error) {
    console.log("Error @CreatePayment : ", error);
    res.status(500).json({
      status: "failure",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const adminAction =  async(req, res) => {
  const { id } = req.params;
  const { decision, comment } = req.body;

  try {
    const payment = await pool.query(
      "SELECT * FROM payment_requests WHERE id=$1",
      [id]
    );
    if (!payment.rows.length)
      return res.status(404).json({ message: "Not found" });
    if (payment.rows[0].status !== payment_status.PENDING)
      return res.status(400).send({
        status: "success",
        message: "Already processed",
      });

    const to_status =
      decision === payment_status.APPROVE
        ? payment_status.ADMIN_APPROVED
        : payment_status.ADMIN_REJECTED;

    await pool.query("UPDATE payment_requests SET status=$1 WHERE id=$2", [
      to_status,
      id,
    ]);

    await pool.query(
      "INSERT INTO approval_audits (payment_request_id, actor_user_id, actor_role, action, from_status, to_status, comment) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        id,
        req.user.id,
        req.user.role,
        `admin_${decision}`,
        payment_status.PENDING,
        to_status,
        comment,
      ]
    );

    res.status(200).sendj({
      status: "success",
      message: "Payment COnfirmed by Admin",
      id,
      status: to_status,
    });
  } catch (error) {
    console.log("Error @AdminAction : ", error);
    res.status(500).send({
      status: "failure",
      message: "Something went wrong",
      error: error.message,
    });
  }
}

const  superConfirm = async(req, res) => {
  const { id } = req.params;
  const { decision, comment } = req.body;

  try {
    const payment = await pool.query(
      "SELECT * FROM payment_requests WHERE id=$1",
      [id]
    );
    if (!payment.rows.length)
      return res.status(404).json({ message: "Not found" });

    const current = payment.rows[0].status;
    let to_status;

    if (
      current === payment_status.ADMIN_APPROVED &&
      decision === payment_status.CONFIRM
    )
      to_status = payment_status.APPROVED;
    else if (
      current === payment_status.ADMIN_REJECTED &&
      decision === payment_status.CONFIRM
    )
      to_status = payment_status.REJECTED;
    else if (decision === "force_approve") to_status = payment_status.APPROVED;
    else if (decision === "force_reject") to_status = payment_status.REJECTED;
    else
      return res.status(400).json({
        message: "Invalid decision",
      });

    await pool.query("UPDATE payment_requests SET status=$1 WHERE id=$2", [
      to_status,
      id,
    ]);

    await pool.query(
      "INSERT INTO approval_audits (payment_request_id, actor_user_id, actor_role, action, from_status, to_status, comment) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        id,
        req.user.id,
        req.user.role,
        `super_${decision}`,
        current,
        to_status,
        comment,
      ]
    );

    res.status(200).send({
      status: "success",
      message: "Payment Confiremed",
      id,
      status: to_status,
    });
  } catch (err) {
    console.log("Error @SuperConfirm : ", err);
    res.status(500).send({
      status: "failure",
      message: "Somethign went wrong",
      error: err.message,
    });
  }
}

export { createPayment, adminAction, superConfirm };
