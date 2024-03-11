// Site with api
const { post_to_blogger } = require('./site_with_api/site_blogger')
const { post_to_wordpress } = require('./site_with_api/site_wordpress')

// Site w/o api
const { post_to_webtretho } = require('./site_without_api/site_webtretho')
const { post_to_raovat } = require('./site_without_api/site_raovat')
const { post_to_voz } = require('./site_without_api/site_voz')
const { post_to_vozforum } = require('./site_without_api/site_vozforum')
const { post_to_khogiare } = require('./site_without_api/site_khogiare')
const { post_to_otofun } = require('./site_without_api/site_otofun')

module.exports = {
    // Site with api
    post_to_blogger,
    post_to_wordpress,
    //Site w/o api
    post_to_webtretho,
    post_to_raovat,
    post_to_voz,
    post_to_vozforum,
    post_to_khogiare,
    post_to_otofun,
}