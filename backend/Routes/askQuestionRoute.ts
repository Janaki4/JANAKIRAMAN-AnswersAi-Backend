import express from 'express';
const router: any = express.Router();
import askQuestionController from '../Controller/askQuestionController';
import { authorizedUser } from '../middleware/userAuth';
import { pdfUpload } from '../middleware/multer';
import aux from '../Utility/auxiliary';
import userJOI from '../JoiSchema/userJOI';

router.post('/plain/question', aux.joiValidator(userJOI.askQuestion()), authorizedUser, askQuestionController.askQuestion())
router.get('/history', authorizedUser, askQuestionController.getAllHistories())
router.get('/history/single/:uuid', authorizedUser, askQuestionController.getSingleHistories())
router.post('/pdf/question/:question/history/:historyId', authorizedUser, pdfUpload.single('file'), askQuestionController.askQuestionFromPdf())
export default router;
