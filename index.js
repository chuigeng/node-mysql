'use strict';

let mysql = require('mysql');

let connection;

exports.create = function(config) {
  console.log('正在新建数据库连接');
  connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
  });
  console.log('新建数据库连接完成');
};

exports.query = function(sql, data) {
  return new Promise(function (resolve, reject) {
    connection.query(sql, data, function (error, results, fields) {
      // 如果出错
      if (error) {
        console.error('数据库错误', sql, data, error);
        reject(error);
        return;
      }
      // 如果是更新或者插入，则返回 true / false
      if (sql.indexOf('update') === 0 || sql.indexOf('insert') === 0) {
        resolve(results.affectedRows > 0);
      } else {
        resolve(results);
      }
    });
  });
};

exports.end = function() {
  if (connection) {
    console.log('正在关闭数据库连接');
    connection.end(function(err) {
      console.log('已关闭数据库连接');
      if (err) {
        console.error('MySQL connnet is terminated but meet error', err);
      }
    });
  }
};