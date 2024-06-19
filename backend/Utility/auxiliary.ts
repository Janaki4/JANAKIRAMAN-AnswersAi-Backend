import bcrypt from 'bcrypt';
import validate from "uuid-validate";
import geoIp from "geoip2-api";
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { ArraySchema, ObjectSchema } from 'joi';
declare type successCallback = () => void;
// @ts-ignore
import Brevo from "@getbrevo/brevo"

import ejs from "ejs"
import { promisify } from "util"
const renderHTMLFile: any = promisify(ejs.renderFile);
import path from "path"

class Auxiliary {
  constructor() { }

  getSequelizeError(error: any) {
    // let errorArr = []
    let errorName = error?.errors?.[0]?.message || error?.name || "SequelizeError"
    // error?.errors?.forEach(el => {
    //     errorArr?.push(el?.message)
    // });
    // if (errorArr.length === 0) errorArr.push(error?.original?.error || error?.parent)
    return {
      errorName,
      // errorArr
    }
  }

  sendResponse(res: Response, status: number, message: string, data?: any, successCallback?: successCallback) {
    res?.status(status)?.json({
      status,
      message,
      data: data?.meta ? data.data : data,
      meta: data?.meta || {},
      filter: data?.filter || {},
    });
    if (successCallback) {
      try {
        successCallback();
      } catch (error) {
        console.log(error, "callback function caused error");
      }
    }
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [hashedPassword, salt];
  }

  joiValidator = (schema: ObjectSchema | ArraySchema, type = "BODY") => {

    return async (req: Request, res: Response, next: NextFunction) => {
      let error
      let value
      let result
      switch (type) {
        case "BODY":
          result = schema.validate(req?.body);
          break;
        case "PARAMS":
          result = schema.validate(req?.params);
          break;
        case "QUERY":
          result = schema.validate(req?.query);
          break;
        case "BODY-PARAMS":
          result = schema.validate({ ...req?.params, ...req?.body });
          break;
        case "ALL":
          result = schema.validate({ ...req?.query, ...req?.body, ...req?.params });
          break;
        default:
          result = schema.validate(req?.body);
          break;
      }

      error = result?.error
      value = result?.value

      if (error) {
        console.log(error);
        aux.sendResponse(res, 400, error?.message, null);
      } else {
        next();
      }
    };
  };


  deleteFile(path: string) {
    try {
      fs.unlinkSync(path)
    } catch (error) {
      console.log(error)
    }
  }


}

const aux = new Auxiliary()

export default aux;
