const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const baseReturnSiteData = require('../../../library/base_return_site_data')

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

async function post_to_raovat(params) {
    let browser = null
    try {
        const siteInfo = params.siteInfo
        const post = params.post

        browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto(`https://raovat.net/dang-nhap`)
        // login
        await page.type('[name="useremail"]', siteInfo.username)
        await page.type('[name="password"]', siteInfo.password)
        await page.click('#buttonLogin')
        await page.waitForTimeout(1000)
        // go to page "đăng tin"
        await page.goto(`https://raovat.net/dang-tin`)
        await page.waitForTimeout(1000)
        // close notify
        await page.click('#btnCancelNotification')
        await page.waitForTimeout(1000)
        // choose  "Ẩm thực và dịch vụ khác" => go to step 2
        await page.click('#category1')
        await page.click('#loadSub > div > div:nth-child(4)')
        await page.waitForTimeout(1000)
        await page.click('#btnNextStep > button')

        // choose "city - loại quảng cáo - title - content"
        await page.waitForSelector("select#cityid")
        await page.select("select#cityid","11")
        await page.select("select#notify","Q")
        await page.type('[name="sitetitle"]', post.title)
        await page.type('[name="sitedescription"]', post.content)

        // post
        await page.click('[name="submit_post"]')
        await page.waitForSelector("#modalTextResp")
        await page.click('#send-resp > div > div > div.modal-footer > a')
        await page.select("select#subcity","760")
        await page.waitForTimeout(3000)
        // submit
        await page.click('[name="submit_post"]')
        await page.waitForSelector('div.options > div:nth-child(2) > a')
        await page.click('div.options > div:nth-child(2) > a')
        await page.waitForTimeout(3000)
        let postAtSiteUrl = page.url()
        await browser.close()

        let data = baseReturnSiteData(siteInfo.username, null, postAtSiteUrl, new Date())
        return {
            code: 200,
            message: 'Đăng bài viết lên site Rao vặt thành công',
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
    post_to_raovat
}
