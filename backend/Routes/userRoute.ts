import express from 'express';
const router: any = express.Router();
import aux from '../Utility/auxiliary'
import userController from '../Controller/userController';
import { brandActiveCheck } from '../middleware/brandActiveCheck';
// import { authorizedUser } from '../middleware/auth';
import userJOI from '../JoiSchema/userJOI';
import { authorizedUser } from '../middleware/userAuth';

router.post('/login', aux.joiValidator(userJOI.login()), userController.login())
router.post('/feedback', aux.joiValidator(userJOI.feedback()), authorizedUser, userController.userFeedbackSubmit())
router.post('/credits', aux.joiValidator(userJOI.credits()), authorizedUser, userController.increaseCredit())

export default router;
