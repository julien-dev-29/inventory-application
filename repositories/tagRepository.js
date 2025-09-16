import pool from "./pool.js";

export default {
    /**
     * Retrieves all tags from the database with pagination
     * @param {Number} offset
     * @returns 
     */
    getAllTags: async (offset) => {
        const { rows } = await pool.query(
            ` SELECT * FROM tags ORDER BY id ASC LIMIT 8 OFFSET $1;`,
            [offset]
        )
        return rows
    },

    /**
     * Retrieves a tag by its ID
     * @param {Number} id 
     * @returns 
     */
    getTagById: async (id) => {
        const { rows } = await pool.query(
            `SELECT * FROM tags WHERE id = $1`,
            [id]
        )
        return rows[0]
    },

    /**
     * Updates an existing tag in the database
     * @param {Number} id 
     * @param {Object} tag 
     */
    updateTagById: async (id, tag) => {
        const { name } = tag
        await pool.query(
            `UPDATE tags SET name = $1 WHERE id = $2`,
            [name, id]
        )
    },

    /**
     * Inserts a new tag into the database
     * @param {*} tag 
     */
    insertTag: async (tag) => {
        const { name } = tag
        await pool.query(`INSERT INTO tags (name) VALUES ($1)`, [name])
    },

    /**
     * Deletes a tag from the database
     * @param {Number} id 
     */
    deleteTagById: async (id) => {
        await pool.query(
            `DELETE FROM tags WHERE id = $1`,
            [id]
        )
    },

    /**
     * Counts the total number of tags in the database
     * @returns 
     */
    count: async () => {
        const { rows } = await pool.query(`SELECT COUNT(*) FROM tags`)
        return rows[0].count
    }
}