import aux from '../Utility/auxiliary'
import userQueries from '../DB/queries/UserQueries'
import userModel from '../Model/userModel'
import { createToken } from '../Utility/token'
import { NextFunction, Request, Response } from 'express';
import { FindOptions } from 'sequelize'
import feedbackModel from '../Model/feedbackModel';

class UserController {

  login() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { phoneNumber } = req?.body
        const whereClause: FindOptions = {
          where: {
            phoneNumber,
            isActive: true
          }
        }
        // const isUserExists = (await userModel.findOne(whereClause))?.dataValues
        const isUserExists = await userQueries.getSingleDataByCondition(userModel, {
          phoneNumber,
          isActive: true
        })

        if (!isUserExists?.id) {
          let credits = 5
          const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = createToken({ phoneNumber, credits })
          const userDetails = {
            phoneNumber,
            credits,
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt
          }
          const createdUser = (await userModel.create(userDetails))?.dataValues
          return aux.sendResponse(res, 201, "Newly created and Login successfully", {
            accessToken,
            phoneNumber,
            credits,
            isActive: createdUser?.isActive,
            token: createdUser?.accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt
          })
        }
        else {
          return aux.sendResponse(res, 201, "existing user and Login successfully", {
            accessToken: isUserExists?.accessToken,
            phoneNumber,
            credits: isUserExists?.credits,
            isActive: isUserExists?.isActive,
            refreshToken: isUserExists?.refreshToken,
            accessTokenExpiresAt: isUserExists?.accessTokenExpiresAt,
            refreshTokenExpiresAt: isUserExists?.refreshTokenExpiresAt
          })
        }

      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

  userFeedbackSubmit() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        const { feedback } = req?.body
        const createFeedBack: any = (await feedbackModel.create({ feedback, userId: id }))
        if (createFeedBack?.id) return aux.sendResponse(res, 201, "Created feedback form", null)
        return aux.sendResponse(res, 400, 'Creation failed', null)
      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

  increaseCredit() {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const userDetails = (req as any)['userDetails']
        const id = userDetails?.id
        const { creds } = req?.body
        const whereClause: FindOptions = {
          where: {
            id
          }
        }
        const creditScoreDetails: any = await userModel.increment("credits", {
          by: creds,
          where: { id }
        })
        console.log(creditScoreDetails);
        if (creditScoreDetails?.[0]?.[1]) return aux.sendResponse(res, 200, 'Credits imcreased', null)
        return aux.sendResponse(res, 400, 'Failed', null)

      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

}

const controller = new UserController();
export default controller;
