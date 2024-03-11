const baseReturnJsonType = require('../library/base_return_json_type')
const path = require('path')

module.exports = (file) => {
    if (!file) {
        return baseReturnJsonType(2, 'Vui lòng chọn excel file để upload')
    }

    const extension = path.extname(file.originalname).toLowerCase()
    const whitelist = [
        '.xlsx',
        '.xls',
    ]
    if (!whitelist.includes(extension)) {
        return baseReturnJsonType(3, 'Chỉ chấp nhận file có đuôi .xlsx và .xls')
    }

    return baseReturnJsonType(200)
}