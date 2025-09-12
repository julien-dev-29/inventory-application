import pool from "./pool.js";

export default {
    /**
     * Retourne tous les snippets
     * 
     * @returns 
     */
    getAllSnippets: async () => {
        const { rows } = await pool.query("SELECT * FROM snippets;")
        return rows
    },
    /**
     * Retourne un snippet par son id
     * 
     * @param {*} id 
     * @returns 
     */
    getSnippetById: async (id) => {
        const { rows } = await pool.query("SELECT * FROM snippets WHERE id = $1;", [id])
        return rows[0]
    },
    updateSnippetById: async (id, name) => {
        return pool.query('UPDATE snippets SET name = $1 WHERE id = $2', [name, id])
    }
}
