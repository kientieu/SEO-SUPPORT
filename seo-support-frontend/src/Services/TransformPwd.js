import CryptoJS from "crypto-js";

const TransformPwd = {
  decrypted: function (username, created_at, encryptedPwd) {
    const key = username + "/" + created_at.toString();
    const decryptedPwd = CryptoJS.AES.decrypt(encryptedPwd, key);
    return decryptedPwd.toString(CryptoJS.enc.Utf8);
  },
};

export default TransformPwd;
