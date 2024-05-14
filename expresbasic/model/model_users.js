const connection = require('../config/database');

class Model_Users {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users ORDER BY id DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO users SET ?', Data, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async Login(nama) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE nama = ?', [nama], function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE id = ?', id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE users SET ? WHERE id = ?', [Data, id], function(err, result) {
                if (err) {
                    reject(err);
                    console.log('database');
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM users WHERE id = ?', id, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Users;
