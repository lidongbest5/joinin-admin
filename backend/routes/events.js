const express = require("express");
const router = express.Router();
const config = require("config-lite")(__dirname);
const moment = require("moment");
const mysql = require("mysql2/promise");
const handleError = require("../utils").handleError;
const qiniu = require("qiniu");
const mysqlConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: "joinin"
};

// const uploadFolder = "./public/upload/";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadFolder);
//   },
//   filename: function (req, file, cb) {  
//     const a = file.originalname;
//     cb(null, a.split('.')[0] + '-' + Date.now() + '.' + a.split('.')[1]);  
//   }
// });

// const upload = multer({ storage: storage });

// routers
router.get("/lists", lists);
router.get("/listsAll", listsAll);
router.post("/delete", eventDelete);
router.post("/save", eventSave);
router.get("/statusList", eventStatusList);
router.post("/status", eventStatus);
router.get("/qiniu", getQiniu);

/**
 * lists
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function lists(req, res, next) {
  const {
    id
  } = req.query;

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `SELECT * FROM joinin_event where user_id = ${id} ORDER BY id DESC`;
  let result;
  try {
    [result] = await connection.execute(query);
    connection.end();
    return res.status(200).json({
      list: result
    });
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * lists
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function listsAll(req, res, next) {
  const connection = await mysql.createConnection(mysqlConfig);
  const query = `SELECT * FROM joinin_event ORDER BY id DESC`;
  let result;
  try {
    [result] = await connection.execute(query);
    connection.end();
    return res.status(200).json({
      list: result
    });
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * delete event
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function eventDelete(req, res, next) {
  const {
    id,
    user
  } = req.body;

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `DELETE FROM joinin_event where id = ${id}`;

  let result1;

  try {
    await connection.execute(query);

    const query1 = `SELECT * FROM joinin_event where user_id = ${user} ORDER BY id DESC`;
    try {
      [result1] = await connection.execute(query1);
      connection.end();
      return res.status(200).json({
        list: result1
      });
    } catch (err) {
      handleError(res, err);
    }
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * save event
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function eventSave(req, res, next) {
  const {
    id,
    title,
    start_time,
    end_time,
    district,
    place,
    category,
    price,
    desc,
    image = "",
    banner = "",
    color,
    template,
    guest = [],
    sponsor = [],
    user_id
  } = req.body;

  let query;
  let result1;
  const connection = await mysql.createConnection(mysqlConfig);

  if (id) {
    query = `UPDATE joinin_event SET title='${title}', start_time='${start_time}', end_time='${end_time}', district='${district}', place='${place}', category='${category}', price=${price}, description='${desc}', image='${image}', banner='${banner}', color='${color}', template=${template}, guest='${guest}', sponsor='${sponsor}' WHERE id=${id} and user_id=${user_id}`;
  } else {
    query = `INSERT INTO joinin_event (title, start_time, end_time, district, place, category, price, description, image, banner, color, template, guest, sponsor, user_id, created_time ) VALUES ('${title}', '${start_time}', '${end_time}', '${district}', '${place}', '${category}', ${price}, '${desc}', '${image}', '${banner}', '${color || 'black'}', ${template || 1}, '${guest}', '${sponsor}', ${user_id}, '${moment().format('YYYY-MM-DD HH:mm:ss')}')`;
  }

  try {
    await connection.execute(query);

    const query1 = `SELECT * FROM joinin_event where user_id = ${user_id} ORDER BY id DESC`;
    try {
      [result1] = await connection.execute(query1);
      connection.end();
      return res.status(200).json({
        list: result1
      });
    } catch (err) {
      handleError(res, err);
    }
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * status list
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function eventStatusList(req, res, next) {
  const {
    id,
    user_id
  } = req.query;
  const connection = await mysql.createConnection(mysqlConfig);

  const query = `SELECT a.id, a.date_joined, a.invite_reason, a.reply_reason, a.status, b.degree, b.intro, b.major, b.name, b.school, b.school_time, b.sex FROM joinin_membership a, joinin_studentuser b WHERE a.event_id = ${id} and a.user_id = b.user_id ORDER BY a.id DESC`;
  let result;

  try {
    [result] = await connection.execute(query);
    connection.end();
    return res.status(200).json({
      statusList: result
    });
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * change status
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function eventStatus(req, res, next) {
  const {
    id,
    status,
    reply_reason
  } = req.body;

  let result;
  const connection = await mysql.createConnection(mysqlConfig);

  const query = `UPDATE joinin_membership SET status=${status}, reply_reason='${reply_reason || ""}' WHERE id=${id}`;

  try {
    [result] = await connection.execute(query);
    connection.end();
    return res.status(200).json({
      id,
      status,
      reply_reason
    });
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * get qiniu
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

function getQiniu(req, res, next) {
  const accessKey = "adSj3QNN1vI8Viyjhis3mW7dcG9dv9R3vLqx2WFE";
  const secretKey = "zDLuZKns0g-yoChvizCxIaZu5LI1PUTO0kvqZbl7";
  const bucket = "joinin";
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  return res.status(200).json({
    uploadToken
  });
}

/**
 * upload
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

function uploadFile(req, res, next) {
  qiniu.conf.ACCESS_KEY = "adSj3QNN1vI8Viyjhis3mW7dcG9dv9R3vLqx2WFE";
  qiniu.conf.SECRET_KEY = "zDLuZKns0g-yoChvizCxIaZu5LI1PUTO0kvqZbl7";

  // 要上传的空间
  const bucket = "lidongbest5";

  // 构建上传策略函数
  function uptoken(bucket, key) {
    let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
  }

  function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if (!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
    });
  }

  const key = req.files.file.originalFilename.split('.')[0] + Date.now() + '.' + req.files.file.originalFilename.split('.')[1];
  const token = uptoken(bucket, key);
  const filePath = req.files.file.path;

  uploadFile(token, key, filePath);
};

module.exports = router;