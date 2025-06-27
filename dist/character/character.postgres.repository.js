import { Client } from "pg";
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'characters',
    password: 'postgres',
    port: 5432,
});
export class CharacterPostgresRepository {
    constructor() {
        client.connect();
    }
    async findAll() {
        const res = await client.query('SELECT * FROM characters');
        return res.rows || undefined;
    }
    async findOne(id) {
        const res = await client.query('SELECT * FROM characters WHERE id = $1', [id]);
        return res.rows[0] || undefined;
    }
    async add(character) {
        try {
            const res = await client.query('INSERT INTO characters (name, characterClass, items, attack, mana, hp, level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [character.name, character.characterClass, character.items, character.attack, character.mana, character.hp, character.level]);
            return res.rows[0];
        }
        catch (error) {
            console.error('Error adding character:', error);
            return undefined;
        }
    }
    async update(id, character) {
        try {
            const res = await client.query('UPDATE characters SET name = $1, characterClass = $2, items = $3, attack = $4, mana = $5, hp = $6, level = $7 WHERE id = $8 RETURNING *', [character.name, character.characterClass, character.items, character.attack, character.mana, character.hp, character.level, id]);
            return res.rows[0];
        }
        catch (error) {
            console.error('Error updating character:', error);
            return undefined;
        }
    }
    async partialUpdate(id, updates) {
        try {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE characters SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
            const res = await client.query(query, [...values, id]);
            return res.rows[0];
        }
        catch (error) {
            console.error('Error partially updating character:', error);
            return undefined;
        }
    }
    async delete(id) {
        try {
            const res = await client.query('DELETE FROM characters WHERE id = $1 RETURNING *', [id]);
            return res.rows[0];
        }
        catch (error) {
            console.error('Error deleting character:', error);
            return undefined;
        }
    }
}
//# sourceMappingURL=character.postgres.repository.js.map