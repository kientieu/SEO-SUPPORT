const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const baseReturnSiteData = require('../../../library/base_return_site_data')

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

async function post_to_khogiare(params) {
    let browser = null
    try {
        const siteInfo = params.siteInfo
        const post = params.post

        browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto(`https://khogiare.com/`)
        await page.waitForSelector('#top > div.p-body > div > div.p-body-header > div > div > a')
        await page.click('#top > div.p-navSticky.p-navSticky--primary > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--guest > a.p-navgroup-link.p-navgroup-link--textual.p-navgroup-link--logIn')
        await page.waitForTimeout(1000)

        // login
        await page.waitForSelector('[name="login"]')
        await page.type('[name="login"]', siteInfo.username)
        await page.waitForSelector('[name="password"]')
        await page.type('[name="password"]', siteInfo.password)
        await page.waitForTimeout(1000)
        await page.click('.formSubmitRow-controls > button')
        await page.waitForTimeout(1000)
        await page.goto(`https://khogiare.com/forums/th%E1%BB%B1c-ph%E1%BA%A9m-d%C6%B0%E1%BB%A3c-ph%E1%BA%A9m-y-t%E1%BA%BF.27/post-thread`)

        // title
        await page.waitForSelector('[name="title"]')
        await page.type('[name="title"]', post.title)

        // content
        let content = post.content
        await page.waitForSelector('[contenteditable="true"]')
        await page.$eval('[contenteditable="true"]', (e, content) => {
            e.textContent = content
        }, content)
        await page.waitForSelector('#top > div.p-body > div > div.p-body-main > div > div > form > div > div:nth-child(1) > dl > dd > div > div > div > div > a')

        // choose local (before title input)
        await page.click('#top > div.p-body > div > div.p-body-main > div > div > form > div > div:nth-child(1) > dl > dd > div > div > div > div > a')
        await page.click('div:nth-child(5) > a')

        // submit
        await page.waitForSelector('.button--icon--write')
        await page.click('.button--icon--write')
        await page.waitForTimeout(1000)
        let postAtSiteUrl = page.url()
        await browser.close()

        let data = baseReturnSiteData(siteInfo.username, null, postAtSiteUrl, new Date())
        return {
            code: 200,
            message: 'Đăng bài viết lên site Kho giá rẻ thành công',
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
    post_to_khogiare
}
