import pool from "./pool.js";

export default {
    insertUser: async (username, password, admin) => {
        await pool.query(
            `INSERT INTO users (username, password, admin) VALUES ($1, $2, $3)`,
            [username, password, admin]
        )
    }
}