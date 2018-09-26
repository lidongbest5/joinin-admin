const express = require("express");
const router = express.Router();
const config = require("config-lite")(__dirname);
const jwt = require("jsonwebtoken");
const moment = require("moment");
const mysql = require("mysql2/promise");
const QcloudSms = require("qcloudsms_js");
const handleError = require("../utils").handleError;
const mysqlConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: "joinin"
};

const appid = 1400130996;
const appkey = "0d164f41e0c5fb246c9e2b75a6aa3556";

const qcloudsms = QcloudSms(appid, appkey);

// routers
router.post("/", login);
router.post("/register", register);
router.post("/sms", sms);
router.get("/get", getAccounts);
router.post("/save", saveAccounts);

/**
 * login
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function login(req, res, next) {
  const { username, password } = req.body;

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `SELECT * FROM auth_user where (email = "${username}" OR mobile =  "${username}" OR username = "${username}" ) AND password = "${password}"`;
  let result;
  try {
    [result] = await connection.execute(query);
    if (result.length) {
      const token = jwt.sign({ username }, config.secret);
      const userData = result[0];
      if (!userData.is_active) {
        return res.status(403).json({ errMsg: "您的账户已经被禁用，请联系我们" });
      }
      const data = {
        user: userData,
        token,
        auth: true,
        createAt: moment().format()
      };
      connection.end();
      return res.status(200).json(data);
    } else {
      return res.status(403).json({ errMsg: "用户名或密码错误" });
    }
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * register
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function register(req, res, next) {
  const {
    mail,
    password,
    mobile,
    captcha
  } = req.body;
  
  const connection = await mysql.createConnection(mysqlConfig);
  const query = `SELECT count(*) as total FROM auth_user where email = "${mail}"`;
  let result;
  try {
    [result] = await connection.execute(query);
    if (!result[0].total) {
      try {
        const query3 = `SELECT * FROM joinin_sms where mobile = ${mobile} order by id DESC`;
        let result3;
        try {
          [result3] = await connection.execute(query3);

          if (result3.length) {
            const code = result3[0].code;

            if (code === captcha) {
              const query1 = `INSERT INTO auth_user (password, email, username, mobile, date_joined, is_active) VALUES ("${password}", "${mail}", "${mail}", "${mobile}", "${moment().format('YYYY-MM-DD HH:mm:ss')}", 1)`;
              try {
                await connection.execute(query1);
                const query2 = `SELECT * FROM auth_user where email = "${mail}"`;
                let result1;
                try {
                  [result1] = await connection.execute(query2);
                  const query3 = `INSERT INTO joinin_eventuser (user_id) VALUES(${result1[0].id});`;
                  await connection.execute(query3);

                  connection.end();
                  return res.status(200).json({ regUser: result1[0] });
                } catch (err) {
                  handleError(res, err);
                }
              } catch (err) {
                handleError(res, err);
              }
            } else {
              connection.end();
              return res.status(403).json({ errMsg: "手机验证码错误" });
            }
          } else {
            connection.end();
            return res.status(403).json({ errMsg: "手机验证码错误" });
          }

        } catch (err) {
          handleError(res, err);
        }
      } catch (err) {
        handleError(res, err);
      }
    } else {
      connection.end();
      return res.status(403).json({ errMsg: "邮箱名已存在" });
    }
    return res.status(200).json({ users: result });
  } catch (err) {
    handleError(res, err);
  }
}

async function sms(req, res, next) {
  const { mobile } = req.body;
  
  const code = Math.floor(1000 + Math.random() * 9000);

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `INSERT INTO joinin_sms (mobile, code) VALUES ("${mobile}", "${code}")`;
  
  let result;
  try {
    [result] = await connection.execute(query);

    const ssender = qcloudsms.SmsSingleSender();
    const params = [code, 10];
    ssender.sendWithParam(86, mobile, 180653, params, "JoinIn活动", "", "", callback);

    return res.status(200).json();
  } catch (err) {
    handleError(res, err);
  }
}

function callback(err, res, resData) {
  if (err) {
    console.log("err: ", err);
  } else {
    console.log("request data: ", res.req);
    console.log("response data: ", resData);
  }
}

/**
 * get accounts
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function getAccounts(req, res, next) {
  const { id } = req.query;

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `SELECT a.id, a.username, a.mobile, a.email, b.avatar, b.intro, b.name, b.label, b.weibo, b.wechat  FROM auth_user a, joinin_eventuser b WHERE a.id = b.user_id and a.id = ${id}`;

  let result;
  try {
    [result] = await connection.execute(query);

    connection.end();
    return res.status(200).json({ account: result[0] });
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * save accounts
 *
 * @param {Request} req: request
 * @param {Response} res: response
 * @param {Function} next: next function
 */

async function saveAccounts(req, res, next) {
  const {
    username = "",
    avatar = "",
    intro = "",
    name = "",
    label = "",
    weibo = "",
    wechat = "",
    id
  } = req.body;

  const connection = await mysql.createConnection(mysqlConfig);
  const query = `UPDATE auth_user SET username='${username}' WHERE id = ${id}`;
  const query1 = `UPDATE joinin_eventuser SET avatar='${avatar}', intro='${intro}', name='${name}', label='${label}', weibo='${weibo}', wechat='${wechat}' WHERE user_id = ${id}`;

  try {
    await connection.execute(query);
    await connection.execute(query1);

    connection.end();
    return res.status(200).json({ data: req.body });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = router;