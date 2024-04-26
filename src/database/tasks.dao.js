export class TasksDao {
    #table = 'tasks';
    #database = {};

    constructor(database) {
        this.#database = database;
    }

    async createTask(taskInsert) {
        return this.#database.insert(this.#table, { ...taskInsert, completed_at: null });
    }

    async getTaskById(id) {
        const [task] = this.#database.select(this.#table, { id });

        return task?.id === undefined ? null : task;
    }

    async getTasks(search = {}) {
        return this.#database.select(this.#table, search);
    }

    async updateTask(id, taskUpdate) {
        return this.#database.update(this.#table, id, taskUpdate);
    }

    async completeTask(id) {
        return this.#database.update(this.#table, id, { completed_at: new Date() });
    }

    async deleteTask(id) {
        return this.#database.delete(this.#table, id);
    }
}