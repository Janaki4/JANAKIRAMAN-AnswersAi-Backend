import { validateToken } from '../Utility/token';
import userQueries = require('../DB/queries/UserQueries')
import _ from 'lodash';
import { NextFunction, Response } from 'express';
import userModel from '../Model/userModel';
import { FindOptions } from 'sequelize';

async function authorizedUser(req: any, res: Response, next: NextFunction) {
  const authHeaderValue = req.headers.authorization
  if (!authHeaderValue) {
    return res.status(403).send('Unauthorized!')
  }

  const token = authHeaderValue.replace("Bearer ", "");

  if (validateToken(req, token)) {
    const whereClause: FindOptions = {
      where: {
        phoneNumber: req?.userDetails?.user?.phoneNumber,
        isActive: true
      }
    }
    try {
      const user = (await userModel.findOne(whereClause))?.dataValues
      req.userDetails = {
        ...req?.userDetails?.user,
        id: user?.id
      }
      // console.log(req?.userDetails, 999);
      next()
    } catch (error) {
      return res.status(403).send('Unauthorized!')
    }
  }
  else {
    return res.status(403).send('Unauthorized!')
  }
}


export { authorizedUser }
