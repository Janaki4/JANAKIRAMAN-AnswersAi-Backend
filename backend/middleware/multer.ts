import multer from 'multer'

const pdfUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + (req?.params?.brandId || "") + "_" + file.originalname);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 1000 // Limits to 1000 MB
  },
})


export { pdfUpload }
