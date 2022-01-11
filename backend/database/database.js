const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: 'localhost',
    define: {
        timestamps: false,
        "createdAt": "createdat",
        "updatedAt": "updatedat",
        freezeTableName: true
    }
});

module.exports = sequelize;