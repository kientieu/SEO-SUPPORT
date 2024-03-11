const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')
const spinFactory = require('@bob6664569/content-spinner').factory
const vntk = require('vntk')
const { parse } = require('node-html-parser')
const PythonShell = require('python-shell').PythonShell

const postModel = require('../models/post_model')
const scheduleModel = require('../models/schedule_model')

const processVal = require('../library/process_validation_result')
const jsonType = require('../library/json_type')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')

const dataSpinPath = './AI/data_spin'
const aiPath = './AI'
const inputForScorePath = './AI/input_for_score'

async function get_posts(req, res) {
    try {
        let filter = getFilterModelWithRole(res, {})
        const posts = await postModel.find(filter)
            .populate('topic')
            .populate('author')

        return jsonType(res, 200, 'Lấy danh sách bài viết thành công', posts)
    } catch (err) {
        return jsonType(res, 1, 'Lấy danh sách bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function get_origin_posts(req, res) {
    try {
        let filter = getFilterModelWithRole(res, { origin_post: { $exists: false } })
        const spinPosts = await postModel.find(filter)
            .populate('topic')
            .populate('author')

        return jsonType(res, 200, 'Lấy danh sách bài viết gốc thành công', spinPosts)
    } catch (err) {
        return jsonType(res, 1, 'Lấy danh sách bài viết gốc thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function get_spin_posts(req, res) {
    let { origin } = req.query
    try {
        let baseFilter = (origin) ? { origin_post: origin } : { origin_post: { $ne: null } }
        let filter = getFilterModelWithRole(res, baseFilter)
        const spinPosts = await postModel.find(filter)
            .populate('topic')
            .populate('author')

        return jsonType(res, 200, 'Lấy danh sách bài viết spin thành công', spinPosts)
    } catch (err) {
        return jsonType(res, 1, 'Lấy danh sách bài viết spin thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function add_new_post(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return jsonType(res, 1, processVal(errors))
    }

    let { postTitle, postContent, postTopic, keyword, landingPage } = req.body
    let author = res.locals.user.user_id

    const checkExistPost = await postModel.findOne({ title: postTitle, author })
        .catch(err => {
            return jsonType(res, 2, 'Xảy ra lỗi trong quá trình xử lí. Vui lòng thử lại sau', null, err)
        })
    if (checkExistPost) {
        return jsonType(res, 3, 'Trùng tiêu đề bài viết. Vui lòng kiểm tra lại')
    }

    const newPost = new postModel({
        title: postTitle,
        content: postContent,
        topic: postTopic,
        keyword: keyword,
        landing_page: landingPage,
        author,
        created_at: new Date(),
        last_updated_at: new Date()
    })
    try {
        const addPostResult = await newPost.save()
        let newPostId = null
        if (addPostResult) {
            newPostId = addPostResult._id
        }
        return jsonType(res, 200, 'Thêm bài viết mới thành công', newPostId)
    } catch (err) {
        return jsonType(res, 4, 'Xảy ra lỗi trong quá trình thêm bài viết. Vui lòng thử lại sau')
    }
}

async function get_post_details(req, res) {
    let { post_id } = req.params
    try {
        let filter = getFilterModelWithRole(res, { _id: post_id })
        const postDetails = await postModel.findOne(filter)
            .populate('topic')
            .populate('keyword')
            .populate({
                path: 'landing_page',
                populate: {
                    path: 'campaign'
                }
            })

        return jsonType(res, 200, 'Lấy chi tiết bài viết thành công', postDetails)
    } catch (err) {
        return jsonType(res, 1, 'Lấy chi tiết bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function edit_post(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return jsonType(res, 1, processVal(errors))
    }

    let { post_id } = req.params
    let { postTitle, postContent, postTopic, keyword, landingPage } = req.body
    let author = res.locals.user.user_id

    const editedPost = {
        title: postTitle,
        content: postContent,
        topic: postTopic,
        keyword: keyword,
        landing_page: landingPage,
        author,
        last_updated_at: new Date()
    }

    const isPostExistSchedule = await scheduleModel.findOne({ post_info: post_id })
    if (isPostExistSchedule) {
        try {
            const newPost = new postModel(editedPost)
            const addPostResult = await newPost.save()
            let newPostId = null
            if (addPostResult) {
                newPostId = addPostResult._id
            }
            return jsonType(res, 200, 'Thêm bài viết thành công', newPostId)
        } catch (err) {
            return jsonType(res, 2, 'Thêm bài viết thất bại. Vui lòng thử lại sau', null, err)
        }
    }

    try {
        let filter = getFilterModelWithRole(res, { _id: post_id })
        await postModel.findOneAndUpdate(filter, { $set: editedPost })
        return jsonType(res, 200, 'Chỉnh sửa bài viết thành công')
    } catch (err) {
        return jsonType(res, 3, 'Chỉnh sửa bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function check_post_exist_schedule(req, res) {
    let { post_id } = req.params
    try {
        let filter = getFilterModelWithRole(res, { post_info: post_id })
        const isPostExistSchedule = await scheduleModel.findOne(filter)
        return jsonType(res, 200, 'Kiểm tra lập lịch có chứa bài viết thành công', isPostExistSchedule)
    } catch (err) {
        return jsonType(res, 1, 'Kiểm tra lập lịch có chứa bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function delete_post(req, res) {
    let { post_id } = req.params

    const result = await postModel.deleteOne({ _id: post_id })
        .catch(err => {
            return jsonType(res, 1, 'Xoá bài viết thất bại. Vui lòng thử lại sau', null, err)
        })
    if (result.deletedCount !== 1) {
        return jsonType(res, 2, 'Xoá bài viết thất bại. Vui lòng thử lại sau')
    }

    return jsonType(res, 200, 'Xoá bài viết thành công')
}

async function spin_posts(req, res) {
    try {
        let spinNum = req.query.spin
        if (!spinNum) {
            return jsonType(res, 2, 'Vui lòng cung cấp số lượng bài viết cần spin')
        }

        const dataSpinFile = fs.readFileSync(`${dataSpinPath}/data_spin.txt`, 'utf8')
        let dataSpin = dataSpinFile.replace(/\r/g, '').split('\n')

        // Generate new spin function with custom section markers and delimiter
        const spin = spinFactory('{', '}', '|')

        const tokenizer = vntk.wordTokenizer()
        let { post_id } = req.params

        const postDetails = await postModel.findById(post_id)
            .populate('keyword')

        let result = []
        let { htmlPostContentParse, spinWords } = spin_post(dataSpin, tokenizer, postDetails)
        for (let i = 1; i <= spinNum; i++) {
            // let now = new Date().toLocaleString('en-GB')
            let spinTitle = postDetails.title
            let spinContent = spin(htmlPostContentParse.toString())
            result.push({
                spinTitle,
                spinContent,
                spinWords
            })
        }

        return jsonType(res, 200, 'Spin bài viết thành công', result)
    } catch (err) {
        return jsonType(res, 1, 'Spin bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

function spin_post(dataSpin, tokenizer, postDetails) {
    let spinWords = {}
    let htmlPostContent = postDetails.content
    let htmlPostContentParse = parse(htmlPostContent)
    for (let i = 0; i <= htmlPostContentParse.childNodes.length - 1; i++) {
        let childNode = htmlPostContentParse.childNodes[i]
        let childNodeText = childNode.textContent.trim()
        let textTokenizer = tokenizer.tag(childNodeText)

        if (!textTokenizer.length) continue
        for (let j = 0; j <= dataSpin.length - 1; j++) {
            let dataSpinWords = dataSpin[j]
                .replace(/{/g, '')
                .replace(/}/g, '')
                .split('|')

            dataSpinWords.every((word, index) => {
                if (word.toLowerCase() === postDetails.keyword.name.toLowerCase()) {
                    return false
                }
                let textIncludesIndex = textTokenizer.findIndex((element) => element.toLowerCase() === word.toLowerCase())
                if (textIncludesIndex !== -1) {
                    let strSpin = removeFoundWord(dataSpin[j], word)
                    spinWords[`${textTokenizer[textIncludesIndex]}`] = strSpin.toLowerCase()
                    textTokenizer[textIncludesIndex] = `<mark class="marker-yellow">${dataSpin[j]}</mark>`
                    return false
                }
            })
        }

        const newChildNodeText = textTokenizer.join(' ')
            .replace(/ ,/g, ',')
            .replace(/ \./g, '.')
            .replace(/ :/g, ':')
            .replace(/ %/g, '%')
            .replace(/\( /g, '(')
            .replace(/ \)/g, ')')
            .replace(/" /g || /' /g, '"')
            .replace(/ "/g || / '/g, '"')
        childNode.innerHTML = childNode.innerHTML.replace(childNodeText, newChildNodeText)
    }

    return { htmlPostContentParse, spinWords }
}

function removeFoundWord(str, word) {
    let regex = new RegExp(`\\{${word}|${word}\\}`, 'i')
    if (str.match(regex)) {
        regex = new RegExp(`\\|${word}|${word}\\|`, 'i')
        return str.replace(regex, '')
    }
    regex = new RegExp(`\\|${word}\\|`, 'i')
    return str.replace(regex, '|')
}

async function add_spin_post(req, res) {
    let { chosenPosts } = req.body
    let { post_id } = req.params
    try {
        let filter = getFilterModelWithRole(res, { _id: post_id })
        let originPost = await postModel.findOne(filter)
        if (!originPost) {
            return jsonType(res, 2, 'Bài viết gốc không tồn tại. Vui lòng thử lại sau', null)
        }

        let newPostsId = []
        for (const chosenPost of chosenPosts) {
            // Remove yellow highlight (<mark> tag) from post content
            let newPostContent = chosenPost.spinContent.replace(/<mark class="marker-yellow">|<\/mark>/g, '')
            let newPost = new postModel({
                title: chosenPost.spinTitle,
                content: newPostContent,
                topic: originPost.topic,
                keyword: originPost.keyword,
                landing_page: originPost.landing_page,
                author: originPost.author,
                origin_post: originPost._id,
                created_at: new Date(),
                last_updated_at: new Date(),
            })
            let result = await newPost.save()
            if (result) {
                newPostsId.push(result._id)
            }
        }

        return jsonType(res, 200, 'Thêm bài viết spin thành công', newPostsId)
    } catch (err) {
        return jsonType(res, 1, 'Thêm bài viết spin thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function score_post_by_ai(req, res) {
    try {
        let { postContentList } = req.body

        let userId = res.locals.user.user_id
        if (!fs.existsSync(inputForScorePath)) {
            fs.mkdirSync(inputForScorePath, { recursive: true })
        }
        let userPathForData = `${inputForScorePath}/${userId}`
        if (!fs.existsSync(userPathForData)) {
            fs.mkdirSync(userPathForData, { recursive: true })
        }

        let argsList = []
        for (let i = 0; i < postContentList.length; i++) {
            let fileName = `input_post_${i+1}.txt`
            let rmHTMLTagContent = postContentList[i].replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, " ").trim()
            fs.writeFileSync(`${userPathForData}/${fileName}`, rmHTMLTagContent)
            argsList.push(path.resolve(userPathForData, fileName))
        }

        let options = {
            args: argsList
        }

        PythonShell.run(`${aiPath}/score_post.py`, options, (err, data) => {
            if (err) {
                return jsonType(res, 2, 'Chấm điểm bài viết thất bại. Vui lòng thử lại sau', null, err)
            }

            // console.log("data:", data[0])
            let result = []
            let scoreList = JSON.parse(data[0])
            for (let i = 0; i < postContentList.length; i++) {
                result.push([postContentList[i], scoreList[i]])
            }

            return jsonType(res, 200, 'Chấm điểm bài viết thành công', result)
        })
    } catch (err) {
        return jsonType(res, 1, 'Chấm điểm bài viết thất bại. Vui lòng thử lại sau', null, err)
    }
}

module.exports = {
    get_posts,
    get_origin_posts,
    get_spin_posts,
    get_post_details,
    add_new_post,
    edit_post,
    check_post_exist_schedule,
    delete_post,
    spin_posts,
    add_spin_post,
    score_post_by_ai,
}
