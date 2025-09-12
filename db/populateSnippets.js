import { Client } from 'pg'
import 'dotenv/config'

const SQL = `
CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    name VARCHAR (50)
);

INSERT INTO snippets (name) VALUES 
('code1'),
('code2'),
('code3');
`

async function main() {
    console.log("seeding...");
    const client = new Client({
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    })
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log('done!');
}

main()