const knex = require('knex')({
    client: 'mssql',
    connection: {
        user: process.env.DB2_USER,
        password: DB2_PASS,
        server: process.env.DB2_HOST,
        database: process.env.DB2_DATABASE,
        options: {
            trustedConnection: true,
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: true,
        },
    }
});

module.exports = knex;