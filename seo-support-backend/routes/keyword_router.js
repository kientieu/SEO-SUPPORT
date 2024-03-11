const express = require('express');
const router = express.Router();
const { body } = require('express-validator')

const keywordApi = require('../api/keyword_api')

const checkLogin = require('../middleware/check_login')

const multerForExcel = require('../library/multer_for_excel')

const upload = multerForExcel()

router.get('/detail-lp/:lp_id', checkLogin, keywordApi.get_keyword_of_lp)

router.post('/detail-lp/:lp_id',
    body('kwName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập từ khoá')
        .isLength({ max: 50 }).withMessage('Từ khoá chỉ được tối đa 50 kí tự'),
    checkLogin,
    keywordApi.add_keyword_of_lp)

router.post('/detail-lp/:lp_id/excel', checkLogin, upload.single('file'), keywordApi.add_keyword_of_lp_by_excel)

router.delete('/detail-lp/:lp_id', checkLogin, keywordApi.del_keyword_of_lp)

router.get('/keywords', checkLogin, keywordApi.get_all_keywords)

router.get('/keywords/top-ten', checkLogin, keywordApi.get_top_ten_keywords)

router.post('/keywords',
    body('keywordName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập từ khoá')
        .isLength({ max: 50 }).withMessage('Từ khoá chỉ được tối đa 50 kí tự'),
    checkLogin,
    keywordApi.add_new_keyword)

router.post('/keywords/excel', checkLogin, upload.single('file'), keywordApi.add_keyword_by_excel)

router.get('/edit-keyword/:keyword_id', checkLogin, keywordApi.get_keyword_details)

router.put('/edit-keyword/:keyword_id', checkLogin, keywordApi.edit_keyword_details)

router.delete('/edit-keyword/:keyword_id', checkLogin, keywordApi.del_lp_of_keyword)

module.exports = router;
