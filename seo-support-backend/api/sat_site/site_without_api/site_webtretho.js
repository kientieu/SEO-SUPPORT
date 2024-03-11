const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const baseReturnSiteData = require('../../../library/base_return_site_data')

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

async function post_to_webtretho(params) {
    let browser = null
    try {
        const siteInfo = params.siteInfo
        const post = params.post

        browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        await page.goto(`https://www.webtretho.com/dang-nhap`)
        // login
        await page.type('[name="login"]', siteInfo.username)
        await page.type('[name="password"]', siteInfo.password)
        await page.click('#__next > div > div.jsx-1581525988 > div > div > div > div > div > div:nth-child(4) > div > button')
        await page.waitForTimeout(1000)
        // navigate to create post page
        await page.click('.btn-create-post.ml__15 > svg')
        await page.waitForTimeout(1000)

        await page.click('#input-choose-community')
        await page.waitForTimeout(1000)

        await page.click('#dropdown-content-community > div:nth-child(1) > div:nth-child(2)')
        await page.waitForTimeout(1000)

        await page.type('[name="title"]', post.title)
        await page.waitForTimeout(1000)

        // handle iframe
        const frameHandle = await page.$("iframe[src='']")
        const frame = await frameHandle.contentFrame()

        // filling in iframe
        await frame.waitForSelector('body[contenteditable="true"]')
        await frame.type('body[contenteditable="true"]',post.content)

        // submit
        await page.waitForTimeout(1000)
        await page.click('.btn-default.btn-default-md.btn-primary')

        await page.waitForSelector('div.am-flexbox.mr__auto.am-flexbox-align-center > div.avatar-info > div')
        let postAtSiteUrl = page.url()
        await browser.close()

        let data = baseReturnSiteData(siteInfo.username, null, postAtSiteUrl, new Date())
        return {
            code: 200,
            message: 'Đăng bài viết lên site Web trẻ thơ thành công',
            data
        }
    } catch (err) {
        if (browser) {
            await browser.close()
        }
        return {
            message: err.message,
            error: err
        }
    }
}

module.exports = {
    post_to_webtretho
}
