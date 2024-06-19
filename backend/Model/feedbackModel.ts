import sequelize from "../DB/config";
import Sequelize from "sequelize"

const feedback = sequelize.define('feedback', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  feedback: {
    type: Sequelize.STRING,
  }
}, {
  tableName: "feedback",
  updatedAt: true,
  createdAt: true
});
export default feedback;
