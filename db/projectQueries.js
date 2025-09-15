import pool from "./pool.js";

export default {
    getAllProjects: async (offset) => {
        const { rows } = await pool.query(
            `SELECT * FROM projects ORDER BY id LIMIT 8 OFFSET $1`,
            [offset]
        )
        return rows
    },
    count: async () => {
        const { rows } = await pool.query(`SELECT COUNT(*) FROM projects`)
        return rows[0].count
    },
    getProjectById: async (id) => {
        const { rows } = await pool.query(
            `SELECT * FROM projects WHERE id = $1`,
            [id]
        )
        return rows[0]
    },
    createProject: async (project) => {
        const { name, description, github_repo } = project
        const { rows } = await pool.query(
            `INSERT INTO projects (name, description, github_repo) VALUES ($1, $2, $3) RETURNING *`,
            [name, description, github_repo]
        )
        return rows[0]
    },
    updateProject: async (id, project) => {
        const { name, description, github_repo } = project
        const { rows } = await pool.query(
            `UPDATE projects SET name = $1, description = $2, github_repo = $3 WHERE id = $4 RETURNING *`,
            [name, description, github_repo, id]
        )
        return rows[0]
    },
    deleteProject: async (id) => {
        const { rows } = await pool.query(`DELETE FROM projects WHERE id = $1 RETURNING *`, [id])
        return rows[0]
    }
}