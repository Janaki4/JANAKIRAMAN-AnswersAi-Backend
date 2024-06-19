import sequelize from './DB/config'
import createServer from './Utility/server';
import dotenv, { config } from "dotenv";
import history from './Model/historyModel';
import feedback from './Model/feedbackModel';

config()
const app = createServer()

// sequelize.sync()
// This will wipe the data, take permission before uncommenting it
sequelize.sync({ alter: true })
  .then((msg) => {
    console.log("DB connection established.");
    app.listen(process.env.SERVER_PORT || 4800, async () => {
      console.log(`App running on port ${process.env.SERVER_PORT}`);
    });
  })
  .catch((error: Error) => console.error('Unable to connect to the database:', error));



export default app;
