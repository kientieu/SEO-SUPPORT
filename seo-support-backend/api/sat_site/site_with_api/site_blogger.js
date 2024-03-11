const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const googleOAuth2 = require('@googleapis/oauth2')
const googleBlogger = require('@googleapis/blogger')

const satSiteAccModel = require('../../../models/sat_site_acc_model')

const returnJson = require('../../../library/json_type')
const baseReturnSiteData = require('../../../library/base_return_site_data')

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

const pathToGoogleTokens = './credentials/google'

passport.use('google-blogger', new googleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/sat-sites/auth/google/callback`
    },
    (accessToken, refreshToken, otherTokenDetails, profile, done) => {
        let tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            scope: otherTokenDetails.scope,
            token_type: otherTokenDetails.token_type,
            expiry_date:otherTokenDetails.expires_in
        }

        let email = profile.emails[0].value
        satSiteAccModel.findOne({ username: email })
            .then(account => {
                if (account) {
                    let fileName = account._id
                    let data = JSON.stringify(tokens)
                    fs.writeFileSync(`./credentials/google/${fileName}.json`, data)
                    return done(null, account)
                }
                done('Email hoặc mật khẩu không đúng', null)
            })
            .catch(err => {
                if(err) {
                    return done(err, null)
                }
            })
    }
))

async function get_google_tokens({ username, password }) {
    let browser = null
    let page = null
    try {
        browser = await puppeteer.launch({ headless: false })
        page = await browser.newPage()
        await page.goto(`${BASE_URL}/api/sat-sites/auth/google`)
        await page.waitForSelector('input[type="email"]')
        await page.type('input[type="email"]', username)
        await page.click('#identifierNext')
        await page.waitForNavigation()
        await page.waitForSelector('input[type="password"]', { visible: true })
        await page.type('input[type="password"]', password)
        await page.click('#passwordNext')
        await page.waitForNavigation()
        await page.waitForSelector('#submit_approve_access > div > button', { visible: true })
        await page.click('#submit_approve_access > div > button')
        await page.waitForResponse(
            (response) =>
                response.url() === `${BASE_URL}/api/sat-sites/auth/success` && response.status() === 200
        )
        await page.waitForTimeout(3000)
        await page.close()

        return {
            code: 200
        }
    } catch (err) {
        let code = 1
        let errMsg = err
        if (page) {
            if (await page.$('#ca')) {
                code = 2
                errMsg = 'Vui lòng kiểm tra lại email hoặc mật khẩu'
            }
        }
        if (browser) {
            await browser.close()
        }
        return {
            code,
            error: errMsg
        }
    }
}

async function auth_success(req, res) {
    returnJson(res, 200, 'Xác thực thành công vào Blogger')
}

async function post_to_blogger(params) {
    const siteInfo = params.siteInfo

    let filePath = `${pathToGoogleTokens}/${siteInfo._id}.json`
    if (!fs.existsSync(filePath)) {
        const result = await get_google_tokens(siteInfo)
        if (result.code !== 200) {
            return {
                code: result.code,
                message: 'Lấy google token thất bại',
                error: result.error
            }
        }
    }
    const tokens = JSON.parse(fs.readFileSync(filePath))

    //make OAuth2 object
    const oAuth2Client = new googleOAuth2.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${BASE_URL}/api/sat-sites/auth/google/callback`)
    // set token details to OAuth2 object
    oAuth2Client.setCredentials(tokens)

    //create blogger object to call APIs
    const blogger = googleBlogger.blogger({ version: 'v3', auth: oAuth2Client })

    const reqParams = JSON.parse(siteInfo.site_detail.params)
    const bloggerParams = {
        blogId: reqParams.blogId,
        requestBody: {
            "kind": "blogger#post",
            "title": params.post.title,
            "content": params.post.content
        }
    }

    //call blogger APIs
    try {
        const response = await blogger.posts.insert(bloggerParams)
        let result = response.data
        let data = baseReturnSiteData(result.author.displayName, result.author.url, result.url, result.published)
        return {
            code: 200,
            message: 'Đăng bài viết lên Blogger thành công',
            data
        }
    } catch (err) {
        return {
            message: err.message,
            error: err
        }
    }
}

module.exports = {
    get_google_tokens,
    auth_success,
    post_to_blogger
}
