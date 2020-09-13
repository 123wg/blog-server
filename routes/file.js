const express = require('express');
const router = express.Router();
const File = require('../db/model/file.js');
const { v4: uuid } = require('uuid');
const { resp, CODE } = require('../utils/response');
let ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var oss = require('ali-oss');
const { now } = require('../utils/timeConverter');
var client = new oss({
    accessKeyId: 'LTAI4GCywQS2gwf9fbDJPci2',
    accessKeySecret: 'sLJpp3brpY4fzddiPFa8OHF2OITIGZ',
    bucket: 'chefwang',
    region: 'oss-cn-shanghai'
});
client.useBucket('chefwang');
// 文件上传相关
const multer = require('multer');
const storage = multer.diskStorage({
    // 设置上传文件路径
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    // 给文件重命名
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')[1];
        let tmpname = uuid();
        cb(null, `${tmpname}.${ext}`);
    }
})
const imageFilter = function (req, file, cb) {
    var type = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (type.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const imageLimits = {
    fileSize: 50 * 1024 * 1024,
};
const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: imageLimits,
})
// 文件上传
router.post('/upload', upload.single('file'), async (req, res) => {
    // let {size,mimetype,path} = req.file;
    if (req.file) {
        const file = req.file;
        try {
            let result = await client.put('images/' + file.filename, 'public/images/' + file.filename);
            let saveFile = {
                name: file.filename,
                oldName: file.originalname,
                // path:`/${file.destination}/${file.filename}`,
                path: result.url,
                createTime: now,
            }
            // 删除本地文件
            fs.unlinkSync(`public/images/${file.filename}`);
            File.insertMany(saveFile)
                .then(data => {
                    saveFile.id = data[0]._id;
                    res.send(resp(true, CODE.SUCCESS, '文件保存成功', saveFile));
                }).catch(err => {
                    res.send(resp(false, CODE.ERROR, '文件保存失败', null));
                });
        } catch (err) {
            res.send(resp(false, CODE.ERROR, '文件保存失败', null));
        }
    }
})

// 删除文件
router.post('/del',  (req, res) => {
    const obj = req.body;
    if (obj.id) {
        File.findById(obj.id, async (err, data) => {
            if (err) {
                res.send(resp(false, CODE.ERROR, '删除失败'));
            } else {
                // 删除文件
                // fs.unlinkSync(`public/images/${data.name}`);
                try {
                    await client.delete('images/' + data.name);
                    File.deleteOne({ "_id": ObjectID(obj.id) }, (err) => {
                        if (err) {
                            res.send(resp(false, CODE.ERROR, '删除失败'));
                        } else {
                            res.send(resp(true, CODE.SUCCESS, '删除成功'))
                        }
                    })
                } catch (err) {
                    console.log(err);
                    res.send(resp(false, CODE.ERROR, '删除失败'));
                }

                // 删除数据
            }
        })
    }
    if (obj.name) {
        File.findOne({ name: obj.name }, async (err, data) => {
            if (err) {
                res.send(resp(false, CODE.ERROR, '删除失败'));
            } else {
                // 删除文件
                // fs.unlinkSync(`public/images/${data.name}`);
                try {
                    await client.delete('images/' + data.name);
                    File.deleteOne({ "name": obj.name }, (err) => {
                        if (err) {
                            res.send(resp(false, CODE.ERROR, '删除失败'));
                        } else {
                            res.send(resp(true, CODE.SUCCESS, '删除成功'))
                        }
                    })
                }catch(err) {
                    console.log(err);
                    res.send(resp(false, CODE.ERROR, '删除失败'));
                    
                }
                // 删除数据
            }
        })
    }

    // File.deleteOne({"_id":ObjectID(obj.id)},(err,data)=> {
    //     console.log(data);
    // })
})


// 获取文件
// router.get('/list')
module.exports = router;

