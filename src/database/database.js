import fs from 'node:fs/promises';
import { randomUUID as uuid } from 'node:crypto';
import path from 'node:path';

const databasePath = path.resolve(__dirname, '../../db.json');

export class LocalDatabase {
    #database = {};
	
    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            });
    }

    async #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    insert(table, data) {
		const insertData = {
			...data,
			id: uuid(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

        if(Array.isArray(this.#database[table])) {
			this.#database[table].push(insertData);
		} else {
			this.#database[table] = [insertData];
		}
	
		this.#persist()
		
		return insertData;  
    }

    select(table, search) {
		let data = this.#database[table] ?? [];

		if(search && Object.entries(search).length > 1 && data.length > 0) {
			data = data.filter(row => {
				return Object.entries(search).some(([key, value]) => {
					return row[key]
						.toLowerCase()
						.includes(value.toLowerCase() ?? '');
				});
			});
		}

		return data;
	}

	update(table, id, data) {
		const rowIndex = this.#database[table].findIndex(row => row.id == id);

		let updateData = null;

		if (rowIndex > -1) 
		{
			updateData = {
				...this.#database[table][rowIndex],
				...data,
				updatedAt: new Date(),
			};

			this.#database[table][rowIndex] = updateData;

			this.#persist();
		}

		return updateData;
	}

	delete(table, id) {
		const rowIndex = this.#database[table].findIndex(row => row.id == id);

		if (rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1);

			this.#persist();
		}
	}
}
