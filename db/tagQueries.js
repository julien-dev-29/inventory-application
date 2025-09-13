import pool from "./pool.js";

export default {
    getAllTags: async () => {
        const { rows } = await pool.query(` SELECT * FROM tags;`)
        return rows
    }
}