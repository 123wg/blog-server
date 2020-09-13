var express = require('express');
var router = express.Router();
const Article = require('../db/model/article.js');
const { resp, CODE } = require('../utils/response');
const { formDate } = require('../utils/timeConverter');
// 保存文章
router.post('/add', function (req, res, next) {
  let article = req.body;
  const now = new Date().Format();
  article.createTime = now;
  article.updateTime = now;
  Article.insertMany(article).then(() => {
    res.send(resp(true, CODE.SUCCESS, '发布成功'));
  })
    .catch(err => {
      res.send(resp(false, CODE.ERROR, '发布失败'));
    })
});


//查询所有文章
router.get('/list', (req, res) => {
  // Article.find({})
  // .populate({ path: 'typeId', select: { name: 1 } })   //上述结果集合中的dep字段用departments表中的name字段填充
  // .populate({ 
  //   path: 'coverId', 
  //   select: { path: 1 } 
  // })
  // .exec((err,data)=>{
  //     if(err) {
  //       res.send(resp(false,CODE.ERROR,'查询文章失败'))
  //       return;
  //     }
  //     res.send(resp(true,CODE.SUCCESS,'',data))
  //   })
  const query = {};
  if (req.query.typeId && req.query.typeId !== '') {
    query.typeId = req.query.typeId;
  }
  const pageNum = parseInt(req.query.pageNum);
  let pageSize = parseInt(req.query.pageSize);
  if (req.query.archive) {
    pageSize = 1000;
  }
  var options = {
    populate: [
      {
        path: 'typeId',
        select: { name: 1 }
      },
      {
        path: 'coverId',
        select: { path: 1 }
      }
    ],
    page: pageNum,
    limit: pageSize
  };
  Article.paginate(query, options, (err, result) => {
    if (req.query.archive) {
      // 整理数据
      const year = [];
      result.docs.forEach(item => {
        const tmpYear = item.createTime.substring(0, 4);
        if (!year.includes(tmpYear)) {
          year.push(tmpYear);
        }
      });
      let results = [];
      year.forEach(item => {
        const obj = {};
        obj.year = item;
        let tmpList = result.docs.filter(items => items.createTime.substring(0, 4) === item);
        tmpList=tmpList.sort((a, b) =>{
            return  formDate(b.createTime)-formDate(a.createTime)
        });
        obj.list = tmpList;
        results.push(obj);
      });
      res.send(resp(true, CODE.SUCCESS, '查询成功', results));
    }
    else {
      res.send(resp(true, CODE.SUCCESS, '查询成功', result));
    }
  })
})

// 根据id查询文章
router.get('/getById', (req, res) => {
  const id = req.query.id;
  Article.findById(id)
    .populate({
      path: 'typeId',
      select: { name: 1 }
    })
    .populate({
      path: 'coverId',
      select: { path: 1 }
    })
    .exec((err, data) => {
      if (err) {
        res.send(resp(false, CODE.ERROR, '查询文章失败'))
        return;
      }
      res.send(resp(true, CODE.SUCCESS, '', data))
    })
})

// 关键字查询模糊匹配
router.get('/searchByKey',(req,res)=>{
  const keywords = req.query.keywords;
  const reg = new RegExp(keywords,'i');
  Article.find(
    {
      $or: [
        {title: {$regex: reg}},
        {abstract: {$regex: reg}}
      ]
    },
    {title:1},
    (err,data)=>{
      if(err){
        res.send(resp(false,CODE.ERROR));
      }else{
        console.log(data);
        res.send(resp(true,CODE.SUCCESS,'查询成功',data));
      }
    }
  )
})

//更新文章
router.post('/update', (req, res) => {
  if (req.body) {
    const article = req.body;
    const id = article.id;
    delete article.id;
    article.updateTime = new Date().Format();
    Article.findByIdAndUpdate(id, article, (err) => {
      if (err) {
        res.send(resp(false, CODE.ERROR, '修改失败'));
      } else {
        res.send(resp(true, CODE.SUCCESS, '修改成功'));
      }
    })
  }
})

// 删除文章
router.post('/del', (req, res) => {
  console.log(req.body);
  if (req.body.id) {
    Article.findByIdAndRemove(req.body.id, (err) => {
      if (err) {
        res.send(resp(false, CODE.ERROR, '删除失败'));
      } else {
        res.send(resp(true, CODE.SUCCESS, '删除成功'));
      }
    })
  }
})

module.exports = router;
