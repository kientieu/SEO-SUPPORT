const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator')

const campaignApi = require('../api/campaign_api')

const checkLogin = require('../middleware/check_login')

const multerForExcel = require('../library/multer_for_excel')

const upload = multerForExcel()

router.get('/campaigns', checkLogin, campaignApi.get_campaigns)

router.post('/campaigns',
    checkLogin,
    body('campaignName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập tên chiến dịch')
        .isLength({ max: 50 }).withMessage('Tên chiến dịch chỉ được tối đa 50 kí tự'),
    body('campaignUrl')
        .notEmpty().withMessage('Vui lòng nhập website cho chiến dịch')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng website'),
    campaignApi.add_campaign)

router.post('/campaigns/excel', checkLogin, upload.single('file'), campaignApi.add_campaign_by_excel)

router.put('/campaigns/modify/:campaign_id',
    checkLogin,
    body('campaignName')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập tên chiến dịch')
        .isLength({ max: 50 }).withMessage('Tên chiến dịch chỉ được tối đa 50 kí tự'),
    body('campaignUrl')
        .notEmpty().withMessage('Vui lòng nhập website cho chiến dịch')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng website'),
    campaignApi.edit_campaign)

router.post('/campaigns/modify/:campaign_id', checkLogin, campaignApi.lock_unlock_campaign)

router.get('/campaigns/closed', checkLogin, campaignApi.get_closed_campaign)

module.exports = router;
