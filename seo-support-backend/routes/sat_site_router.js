const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const passport = require('passport')
const { BASE_URL } = process.env

const satSiteApi = require('../api/sat_site_api')
const siteBlogger = require('../api/sat_site/site_with_api/site_blogger')

const checkLogin = require('../middleware/check_login')
const isAdmin = require('../middleware/is_admin')

//** Sat Site
router.get('/sat-sites', checkLogin, satSiteApi.get_sat_sites)

router.post('/sat-sites',
    body('url')
        .notEmpty().withMessage('Vui lòng nhập url cho site')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng url'),
    body('name')
        .isLength({ min: 1, max: 40 }).withMessage('Vui lòng nhập tên cho site'),
    body('level')
        .isNumeric().withMessage('Site level phải là số'),
    [checkLogin, isAdmin],
    satSiteApi.add_sat_site)

router.put('/sat-sites/edit/:sat_site_id',
    body('url')
        .notEmpty().withMessage('Vui lòng nhập url cho site')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng url'),
    body('name')
        .isLength({ min: 1, max: 40 }).withMessage('Vui lòng nhập tên cho site'),
    body('level')
        .isNumeric().withMessage('Site level phải là số'),
    [checkLogin, isAdmin],
    satSiteApi.edit_sat_site)

router.post('/sat-sites/post-to', checkLogin, satSiteApi.post_to_site_level)

//Blogger
router.get('/sat-sites/auth/google', passport.authenticate('google-blogger', {
    scope: ['email', 'https://www.googleapis.com/auth/blogger'],
    accessType: 'offline',
    prompt: 'consent'
}))
router.get('/sat-sites/auth/google/callback', passport.authenticate('google-blogger', {
    successRedirect: `${BASE_URL}/api/sat-sites/auth/success`,
    failureRedirect: `${BASE_URL}/api/sat-sites/auth/fail`,
}))
router.get('/sat-sites/auth/success', siteBlogger.auth_success)
router.get('/sat-sites/auth/blogger', siteBlogger.get_google_tokens)

//WordPress


//** Site Detail
router.get('/site-detail/:sat_site_id', checkLogin, satSiteApi.get_site_detail)

router.post('/site-detail/:sat_site_id',
    body('url')
        .notEmpty().withMessage('Vui lòng nhập url cho site vệ tinh')
        .matches('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').withMessage('Vui lòng nhập đúng định dạng url'),
    checkLogin,
    satSiteApi.add_site_detail)

//** Site Acc
router.post('/site-acc', checkLogin, satSiteApi.add_new_site_acc)

module.exports = router;
