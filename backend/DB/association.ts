import userModel from '../Model/userModel'
import feedback from '../Model/feedbackModel'
import history from '../Model/historyModel'


userModel.hasMany(history, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})
history.belongsTo(userModel, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})


userModel.hasMany(feedback, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})
feedback.belongsTo(userModel, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})
