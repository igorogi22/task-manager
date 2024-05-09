import { parse } from 'csv-parse';

import { buildRoutePath } from './utils/build-route-path.js';
import { TasksDao } from './database/tasks.dao.js';
import { LocalDatabase } from './database/database.js';

const localDatabase = new LocalDatabase();

const tasksDao = new TasksDao(localDatabase);

export default [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handle: async (req, res) => {
            if ((!req.body?.title || typeof req.body?.title !== 'string' || req.body.title.length < 3) && !req.csvData) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Invalid params' }));
            }

            if (req.csvData) {
                const [, ...tasks] = req.csvData.map(line => { 
                    const [title, description] =  line.split(',') ;

                    return { title, description };
                });

                for await (const task of tasks) {
                    tasksDao.createTask(task)
                }

                return res
                    .writeHead(200)
                    .end(JSON.stringify({ message: 'Tasks imported with success' }));
            }

            await tasksDao.createTask(req.body);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handle: async (req, res) => {
            const task = await tasksDao.getTaskById(req.params.id);

            if (task) {
                return res.end(JSON.stringify(task));
            } else {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handle: async (req, res) => {
            const tasks = await tasksDao.getTasks(req.query);

            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handle: async (req, res) => {
            const task = await tasksDao.getTaskById(req.params.id);

            if (task) {
                const updatedTask = await tasksDao.updateTask(req.params.id, req.body);

                return res.end(JSON.stringify(updatedTask));
            } else {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handle: async (req, res) => {
            const task = await tasksDao.getTaskById(req.params.id);

            if (task) {
                await tasksDao.completeTask(req.params.id);

                return res.writeHead(204).end();
            } else {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handle: async (req, res) => {
            const task = await tasksDao.getTaskById(req.params.id);

            if (task) {
                await tasksDao.deleteTask(req.params.id);

                return res.writeHead(204).end();
            } else {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
        }
    }
];
