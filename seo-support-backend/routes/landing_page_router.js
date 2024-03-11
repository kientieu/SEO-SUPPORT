const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const multer = require('multer')
const path = require('path')

const landingPageApi = require('../api/landing_page_api')

const checkLogin = require('../middleware/check_login')

const multerForExcel = require('../library/multer_for_excel')

const upload = multerForExcel()

router.get('/landing-pages/:campaign_id', checkLogin, landingPageApi.get_landing_pages)

router.post('/landing-pages/:campaign_id',
    body('kwName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập từ khoá chính cho landing page')
        .isLength({ max: 50 }).withMessage('Từ khoá chính chỉ được tối đa 50 kí tự'),
    body('lpURL')
        .notEmpty().withMessage('Vui lòng nhập landing page')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng landing page'),
    checkLogin,
    landingPageApi.add_landing_pages)

router.post('/landing-pages/:campaign_id/excel', checkLogin, upload.single('file'), landingPageApi.add_lp_by_excel)

router.put('/landing-pages/modify/:lp_id',
    body('kwName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập từ khoá chính cho landing page')
        .isLength({ max: 50 }).withMessage('Từ khoá chính chỉ được tối đa 50 kí tự'),
    body('lpURL')
        .notEmpty().withMessage('Vui lòng nhập landing page')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng landing page'),
    checkLogin,
    landingPageApi.update_landing_pages)

router.post('/landing-pages/modify/:lp_id', checkLogin, landingPageApi.lock_unlock_landing_pages)

router.get('/landing-pages', checkLogin, landingPageApi.get_lp_by_query_string)

module.exports = router;
