import pool from "./pool.js";

export default {
    /**
     * Retourne tous les snippets
     * @returns 
     */
    getAllSnippets: async () => {
        const { rows } = await pool.query("SELECT * FROM snippets;")
        return rows
    },
    getPaginateSnippets: async (offset) => {
        const { rows } = await pool.query(
            "SELECT * FROM snippets ORDER BY id LIMIT 8 OFFSET $1;",
            [offset]
        )
        return rows
    },
    /**
     * Retourne les snippets paginés avec le langage, la catégorie et les tags associés
     * @param {*} offset 
     * @returns 
     */
    getPaginateSnippetsWithLanguageAndCategoryAndTags: async (offset) => {
        const { rows } = await pool.query(`
            SELECT
            s.*,
            l.name AS language_name,
            json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name)) AS tags,
            json_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.name, 'description', p.description, 'github_repo', p.github_repo)) AS projects
            FROM snippets s
            LEFT JOIN languages l ON s.language_id = l.id
            LEFT JOIN snippet_tags st ON s.id = st.snippet_id
            LEFT JOIN tags t ON st.tag_id = t.id
            LEFT JOIN snippet_projects sp ON s.id = sp.snippet_id
            LEFT JOIN projects p ON sp.project_id = p.id
            GROUP BY s.id, l.name
            ORDER BY s.id
            LIMIT 8 OFFSET $1;
            `,
            [offset]
        )
        return rows
    },
    /**
     * Retourne un snippet par son id
     * @param {*} id 
     * @returns 
     */
    getSnippetById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM snippets WHERE id = $1;",
            [id]
        )
        return rows[0]
    },
    /**
     * Retourne un snippet par son id avec le langage, la catégorie et les tags associés
     * @param {*} id 
     * @returns 
     */
    getSnippetByIdWithLanguageAndCategoryAndTags: async (id) => {
        const { rows } = await pool.query(`
            SELECT
            s.*,
            l.name AS language_name,
            json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name)) AS tags,
            json_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.name, 'description', p.description, 'github_repo', p.github_repo)) AS projects
            FROM snippets s
            LEFT JOIN languages l ON s.language_id = l.id
            LEFT JOIN snippet_tags st ON s.id = st.snippet_id
            LEFT JOIN tags t ON st.tag_id = t.id
            LEFT JOIN snippet_projects sp ON s.id = sp.snippet_id
            LEFT JOIN projects p ON sp.project_id = p.id
            WHERE s.id=$1
            GROUP BY s.id, l.name;
            `,
            [id]
        )
        return rows[0]
    },
    /**
     * Met à jour un snippet par son id
     * @param {*} id 
     * @param {String} name 
     * @returns 
     */
    updateSnippetById: async (id, snippet) => {
        const { title, code, description, is_public, tags, projects, language_id } = snippet
        await pool.query(
            `UPDATE snippets SET title = $1, code = $2, description = $3, is_public = $4, language_id = $5 WHERE id = $6;`,
            [title, code, description, is_public, Number(language_id), id]
        )
        await pool.query(`DELETE from snippet_tags WHERE snippet_id = $1;`, [id])
        await pool.query(`DELETE from snippet_projects WHERE snippet_id = $1;`, [id])
        const tagIds = Array.isArray(tags) ? tags : [tags];
        if (tagIds.length > 0) {
            await Promise.all(tagIds.map(t =>
                pool.query(`INSERT INTO snippet_tags VALUES ($1, $2)`, [id, t])
            ));
        }
        const projectIds = Array.isArray(projects) ? projects : [projects]
        if (projectIds.length > 0) {
            await Promise.all(projectIds.map(p => {
                pool.query(`INSERT INTO snippet_projects VALUES ($1, $2)`, [id, p])
            }))
        }
        return true
    },
    /**
     * Supprime un snippet par son id
     * @param {*} id 
     * @returns 
     */
    deleteSnippetById: async (id) => {
        return pool.query(
            'DELETE FROM snippets WHERE id = $1',
            [id]
        )
    },
    /**
     * Insert un snippet en base de données
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    insertSnippet: async (snippet) => {
        const { title, code, description, language_id, projects, tags, complexity } = snippet
        const { rows } = await pool.query(
            "INSERT INTO snippets (title, code, description, complexity, language_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
            [title, code, description, complexity, language_id]
        )
        const id = rows[0].id
        const projectIds = Array.isArray(projects) ? projects : [projects]
        if (projectIds.length > 0) {
            await Promise.all(projectIds.map(projectId => {
                pool.query(`INSERT INTO snippet_projects VALUES ($1, $2)`, [id, projectId])
            }))
        }
        const tagsIds = Array.isArray(tags) ? tags : [tags]
        if (tagsIds.length > 0) {
            await Promise.all(tagsIds.map(tagId => {
                pool.query(`INSERT INTO snippet_tags VALUES ($1, $2)`, [id, tagId])
            }))
        }
        return true
    },
    /**
     * Compte le nombre de snippets
     * @returns 
     */
    count: async () => {
        const { rows } = await pool.query('SELECT count(*) FROM snippets')
        return rows[0]
    }
}
