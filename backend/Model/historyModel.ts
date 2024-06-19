import sequelize from "../DB/config";
import Sequelize from "sequelize"

const history = sequelize.define('history', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  historyUUID: {
    type: Sequelize.UUID,
    allowNull: true
  },
  historyContext: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  historyType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  tableName: "history",
  updatedAt: true,
  createdAt: true
});
export default history;
