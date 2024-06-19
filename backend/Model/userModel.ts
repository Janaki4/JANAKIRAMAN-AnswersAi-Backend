import sequelize from "../DB/config";
import Sequelize from "sequelize"

const user = sequelize.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  credits: {
    type: Sequelize.BIGINT,
    defaultValue: 5,
  },
  accessToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  accessTokenExpiresAt: {
    type: Sequelize.DATE,
  },
  refreshTokenExpiresAt: {
    type: Sequelize.DATE,
  },
}, {
  tableName: "user",
  updatedAt: true,
  createdAt: true
});
export default user;
