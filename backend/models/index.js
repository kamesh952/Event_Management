import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';
import EventModel from './event.js';
import BookingModel from './booking.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // needed for Render's managed Postgres
    },
  },
  logging: false,
});

const db = {};

db.User = UserModel(sequelize, DataTypes);
db.Event = EventModel(sequelize, DataTypes);
db.Booking = BookingModel(sequelize, DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
