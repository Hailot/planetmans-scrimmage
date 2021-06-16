const knex = require('knex')({
    client: 'mssql',
    connection: {
        user: process.env.DB1_USER,
        password: process.env.DB1_PASS,
        server: process.env.DB1_HOST,
        database: process.env.DB1_DATABASE,
        options: {
            trustedConnection: true,
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: true,
        },
    }
});

module.exports = knex;