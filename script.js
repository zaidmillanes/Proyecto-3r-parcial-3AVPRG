const mysql = require('mysql2/promise');
const fs = require('fs');

const dbConfig = {
    host: 'localhost',
    user: 'peperlepe',
    password: 'peperlepe123',
    database: 'jugueteria'
};

async function migrarDatos() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conectado a la base de datos MySQL');

        const [rows] = await connection.execute('SELECT * FROM productos');
        console.log('Datos obtenidos de MySQL');

        const jsonData = JSON.stringify(rows, null, 2);
        fs.writeFileSync('data.json', jsonData);
        console.log('Datos guardados en data.json');

        await connection.end();
        console.log('Conexión cerrada');

    } catch (error) {
        console.error('Error durante la migración:', error);
    }
}

migrarDatos();