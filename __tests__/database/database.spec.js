import fs from 'node:fs';

import { LocalDatabase } from '../../src/database/database';

describe('Database', () => {
    afterAll(() => {
        if(fs.existsSync('./db.json')) {
            fs.unlinkSync('./db.json');
        }
    });

    it('should create a database file', () => {
        new LocalDatabase();
        
        expect(fs.existsSync('./db.json')).toBe(true);
    });

    it('should insert data', () => {
        const database = new LocalDatabase();
        const data = database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        database.insert('users', {
            name: 'Jane Doe',
            email: 'jane.doe@email.com',
        });

        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('createdAt');
        expect(data).toHaveProperty('updatedAt');
        expect(data.name).toBe('John Doe');
        expect(data.email).toBe('john.doe@email.com');
    });

    it('should select data', () => {
        const database = new LocalDatabase();

        database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        const data = database.select('users');

        expect(data).toHaveLength(1);
    });

    it('should select data with two params', () => {
        const database = new LocalDatabase();

        database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        const data = database.select('users', { name: 'John Doe', email: 'john.doe@email.com' });

        expect(data).toHaveLength(1);
    });

    it('should select data with id', () => {
        const database = new LocalDatabase();

        const user = database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });
        
        const [data] = database.select('users', { id: user.id });

        expect(data).toBe(user);
    });

    it('should update data', () => {
        const database = new LocalDatabase();

        const user = database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        const updatedUser = database.update('users', user.id, {
            name: 'Jane Doe',
        });

        expect(updatedUser.name).toEqual('Jane Doe');
        expect(updatedUser.id).toEqual(user.id);
    });

    it('should return null if data is not found', () => {
        const database = new LocalDatabase();

        const user = database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        const updatedData = database.update('users', '1', {
            name: 'Jane Doe',
        });

        expect(updatedData).toBeNull();
    });

    it('should delete data', () => {
        const database = new LocalDatabase();

        const user = database.insert('users', {
            name: 'John Doe',
            email: 'john.doe@email.com',
        });

        database.delete('users', user.id);

        const search = database.select('users', { id: user.id });

        expect(search).toHaveLength(0);
    });
});