const database = require('./postgres');

module.exports = {
    async getUsers() {
        const query = 'select * from users';
        return await 
            database
                .query(query)
                .rows;
    },
    async createUser(user) {
        let query = `INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.password})`;
        pool
            .query(query)
            .then(() => console.log('User created successfully'))
            .catch(error => console.error('Error creating user', error))
    }
}