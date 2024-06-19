import Joi from "joi";

class JOIValidator {
  login() {
    return Joi.object({
      "phoneNumber": Joi.string().required(),
    })
  }
  feedback() {
    return Joi.object({
      "feedback": Joi.string().required(),
    })
  }
  credits() {
    return Joi.object({
      "feedback": Joi.number().required(),
    })
  }
  askQuestion() {
    return Joi.object({
      "question": Joi.string().required(),
      "historyId": Joi.string().optional(),
    })
  }
}

const joiValidator = new JOIValidator();
export default joiValidator;
