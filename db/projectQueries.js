import pool from "./pool.js";

export default {
    getAllProjects: async () => {
        const { rows } = await pool.query(`SELECT * FROM projects`)
        return rows
    }
}