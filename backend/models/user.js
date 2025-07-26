export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Define Associations
  User.associate = (models) => {
    if (models.Booking) {
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  };

  return User;
};
