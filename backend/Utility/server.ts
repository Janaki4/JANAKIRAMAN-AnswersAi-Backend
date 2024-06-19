import express, { Request, Response } from 'express';
import cors from 'cors';
import { queryParser } from 'express-query-parser';
import userRouter from '../Routes/userRoute';
import askQuestionRouter from '../Routes/askQuestionRoute'
import morgan from 'morgan';
import compression from 'compression';

function createServer() {
  const app = express()
  app.use(compression())
  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json({
    limit: "1000mb"
  }));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    queryParser({
      parseNull: true,
      parseUndefined: true,
      parseBoolean: true,
      parseNumber: true
    })
  )

  app.use('/user', userRouter)
  app.use('/ask', askQuestionRouter)
  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('Up')
  })
  return app
}

export default createServer;
