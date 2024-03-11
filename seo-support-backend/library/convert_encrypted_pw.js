const crypto = require('crypto-js')

module.exports = (username, created_at, encryptedPwd) => {
    const key = username + "/" + created_at.toISOString()
    const decryptedPwd = crypto.AES.decrypt(encryptedPwd, key)
    return decryptedPwd.toString(crypto.enc.Utf8)
}