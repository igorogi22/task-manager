import { TasksDao } from '../../src/database/tasks.dao.js';
import { LocalDatabase } from '../../src/database/database';
import fs from 'node:fs';

let tasksDao = {};

describe('Task DAO', () => {
    beforeEach(() => {
        tasksDao = new TasksDao(new LocalDatabase());
    });
    
    afterEach(() => {
        if(fs.existsSync('./db.json')) {
            fs.unlinkSync('./db.json');
        }
    });
    
    it('should create a task', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };

        const task = await tasksDao.createTask(taskInsert);
      
        expect(task.title).toBe(taskInsert.title);
        expect(task.describe).toBe(taskInsert.describe);
        expect(task.completed_at).toBeNull();
        expect(task.id).not.toBeNull();
    });

    it('should get a task by id', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };
        const taskInserted = await tasksDao.createTask(taskInsert);

        const task = await tasksDao.getTaskById(taskInserted.id);

        expect(task.id).toBe(taskInserted.id);
        expect(task.title).toBe('Task 01');
        expect(task.description).toBe('Task 01 description');
    });

    it('should return null when task not found', async () => {
        const task = await tasksDao.getTaskById('1');

        expect(task).toBeNull();
    });

    it('should get tasks', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };
        await tasksDao.createTask(taskInsert);

        const tasks = await tasksDao.getTasks();

        expect(tasks).toHaveLength(1);
    });

    it('should update a task', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };
        const taskInserted = await tasksDao.createTask(taskInsert);

        const taskUpdate = {
            title: 'Task 02',
            description: 'Task 02 description',
        };
        const task = await tasksDao.updateTask(taskInserted.id, taskUpdate);

        expect(task.id).toBe(taskInserted.id);
        expect(task.title).toBe('Task 02');
        expect(task.description).toBe('Task 02 description');
    });

    it('should complete a task', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };
        const taskInserted = await tasksDao.createTask(taskInsert);

        const task = await tasksDao.completeTask(taskInserted.id);

        expect(task.id).toBe(taskInserted.id);
        expect(task.completed_at).not.toBeNull();
    });

    it('should delete a task', async () => {
        const taskInsert = {
            title: 'Task 01',
            description: 'Task 01 description',
        };
        const taskInserted = await tasksDao.createTask(taskInsert);

        await tasksDao.deleteTask(taskInserted.id);

       expect(await tasksDao.getTaskById(taskInserted.id)).toBeNull();
    });
});