module.exports = (keyword, lPUrl, postContent) => {
    let keywordRE = new RegExp(`(\\s|^)${keyword}[\\W]?(?=\\s|$)`, "gi")
    let rmHTMLTagContent = postContent.replace(/&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, " ")
    let matches = Array.from(rmHTMLTagContent.matchAll(keywordRE))

    if (!matches.length) {
        return postContent
    }
    let randMatchedIndex = matches[Math.floor(Math.random() * matches.length)].index

    return postContent.substring(0, randMatchedIndex + 1) +
        `<a href=${lPUrl} target="_blank" rel="noreferrer">${keyword}</a>` +
        postContent.substring(randMatchedIndex + 1 + keyword.length)
}