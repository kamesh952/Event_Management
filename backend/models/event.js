export default (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
  });

  Event.associate = (models) => {
    Event.hasMany(models.Booking, { foreignKey: 'eventId' });
  };

  return Event;
};
