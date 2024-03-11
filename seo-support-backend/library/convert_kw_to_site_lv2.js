module.exports = (keyword, siteLv2Url, postContent) => {
    let keywordRE = new RegExp(`(\\s|^)${keyword}[\\W]?(?=\\s|$)`, "gi")
    let tempPostContent = postContent.replace(/<|>/g, " ")
    let matches = [...tempPostContent.matchAll(keywordRE)]

    if (!matches[Math.floor(Math.random() * matches.length)]) {
        return `${postContent}. <a href=${siteLv2Url} target="_blank" rel="noreferrer">Link</a> ${siteLv2Url}`
    }

    let randMatchedIndex = matches[Math.floor(Math.random() * matches.length)].index

    return postContent.substring(0, randMatchedIndex + 1) +
        `<a href=${siteLv2Url} target="_blank" rel="noreferrer">${keyword}</a> (${siteLv2Url})` +
        postContent.substring(randMatchedIndex + 1 + keyword.length)
}