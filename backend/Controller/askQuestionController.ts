import aux from '../Utility/auxiliary'
import userQueries from '../DB/queries/UserQueries'
import userModel from '../Model/userModel'
import { NextFunction, Request, Response } from 'express';
import { FindOptions } from 'sequelize'
import historyModel from '../Model/historyModel';
import { GoogleGenerativeAI } from "@google/generative-ai"
const genAI = new GoogleGenerativeAI(process.env.AI_KEY!);
import uuid from 'uuid-random';
import sequelize from '../DB/config'
import pdf from 'pdf-parse'
import fs from 'fs'

class askQuestionController {

  async getAnswerFromAi(question: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = question

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text
    } catch (error) {
      throw error
    }

  }

  askQuestion() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        let { question, historyId } = req?.body

        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        if (!historyId) historyId = uuid()
        const details = {
          historyUUID: historyId,
          historyContext: question,
          historyType: "question",
          userId: id
        }

        const saveQuestion = await historyModel.create(details)
        const answer = await this.getAnswerFromAi(question)
        console.log(details, answer);
        const saveAnswers = await historyModel.create({
          historyUUID: historyId,
          historyContext: answer,
          historyType: "answer",
          userId: id
        })

        return aux.sendResponse(res, 200, "Got response successfully", {
          answer,
          uuid: historyId
        })
      }
      catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

  getAllHistories() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        const response = (await sequelize.query(`
          SELECT *
          FROM(
            SELECT
              id, h."historyUUID", h."historyContext",
                ROW_NUMBER() OVER(PARTITION BY h."historyUUID" ORDER BY id) as row_num
              FROM history h
              WHERE "userId" = :userId
              ) as ranked
          WHERE row_num = 1;`
          , {
            replacements: { userId: id }
          }))?.[0]
        if (response.length) return aux.sendResponse(res, 200, "Data is served", response)
        return aux.sendResponse(res, 400, "no data found", [])
      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

  getSingleHistories() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        const uuid = req?.params?.uuid
        const whereClause: FindOptions = {
          where: {
            historyUUID: uuid
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'userId']
          }
        }
        const result = await historyModel.findAll(whereClause)
        if (result.length) return aux.sendResponse(res, 200, "Data is served", result)
        return aux.sendResponse(res, 400, "no data found", [])
      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

  askQuestionFromPdf() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        const file = req?.file
        const path = file?.path
        const question = req?.params?.question
        let historyId = req?.param?.historyId
        let dataBuffer = fs.readFileSync(path);

        const result = await pdf(dataBuffer)
        // console.log(result?.text);
        if (!historyId) historyId = uuid()
        const details = {
          historyUUID: historyId,
          historyContext: question,
          historyType: "question",
          userId: id
        }
        const saveQuestion = await historyModel.create(details)
        const answer = await this.getAnswerFromAi(`This is the book, ${result?.text}. Here is my question  ${question} , please give me the answer from the book`)
        console.log(answer);
        const saveAnswers = await historyModel.create({
          historyUUID: historyId,
          historyContext: answer,
          historyType: "answer",
          userId: id
        })
        aux.deleteFile(path)
        return aux.sendResponse(res, 200, "Got response successfully", {
          answer,
          uuid: historyId
        })
      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }
}

const controller = new askQuestionController();
export default controller;
