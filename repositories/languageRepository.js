import pool from "./pool.js";

export default {
    /**
     * Retourne tous les langages
     * @returns 
     */
    getAllLanguages: async () => {
        const { rows } = await pool.query("SELECT * FROM languages;")
        return rows
    }
}