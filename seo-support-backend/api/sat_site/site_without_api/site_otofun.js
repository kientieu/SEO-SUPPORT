const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const baseReturnSiteData = require('../../../library/base_return_site_data')

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

async function post_to_otofun(params) {
    let browser = null
    try {
        const siteInfo = params.siteInfo
        const post = params.post

        browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto(`https://www.otofun.net/forums/goc-ky-thuat-cua-sinh-vien.193/post-thread`)
        await page.waitForTimeout(1000)
        // login
        await page.waitForSelector('[name="login"]')
        await page.type('[name="login"]', siteInfo.username)
        await page.waitForSelector('[name="password"]')
        await page.type('[name="password"]', siteInfo.password)
        await page.waitForTimeout(1000)
        await page.click('.formSubmitRow-controls > button')
        await page.waitForTimeout(1000)
        // title
        await page.waitForSelector('[name="title"]')
        await page.type('[name="title"]', post.title)
        // content
        let content = post.content
        await page.waitForSelector('[contenteditable="true"]')
        await page.$eval('[contenteditable="true"]', (e, content) => {
            e.textContent = content
        }, content)
        // submit
        await page.waitForSelector('.button--icon--write')
        await page.click('.button--icon--write')
        let postAtSiteUrl = page.url()
        await browser.close()

        let data = baseReturnSiteData(siteInfo.username, null, postAtSiteUrl, new Date())
        return {
            code: 200,
            message: 'Đăng bài viết lên site Ô tô fun thành công',
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
    post_to_otofun
}
