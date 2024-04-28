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
            if(!req.body.title || typeof req.body.title !== 'string' || req.body.title.length < 3) {
                throw new Error('Title is required');
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

            if(task) {
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

            if(task) {
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

            if(task) {
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

            if(task) {
                await tasksDao.deleteTask(req.params.id);

                return res.writeHead(204).end();
            } else {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
        }
    }
];
