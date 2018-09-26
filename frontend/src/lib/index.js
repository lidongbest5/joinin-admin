import isEqual from "lodash/isEqual";
import transform from "lodash/transform";
import isObject from "lodash/isObject";

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function clean(obj) {
  if (Array.isArray(obj)) return obj;
  const newObj = { ...obj };
  var propNames = Object.getOwnPropertyNames(newObj);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (newObj[propName] && typeof newObj[propName] === "object") {
      newObj[propName] = clean(newObj[propName]);
    }
    if (
      newObj[propName] === null ||
      newObj[propName] === undefined ||
      isEmptyObject(newObj[propName])
    ) {
      delete newObj[propName];
    }
  }
  return newObj;
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function diff(object, base) {
  return transform(object, function(result, value, key) {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? diff(value, base[key]) : value;
    }
  });
}

export function isEmpty(obj) {
  return obj.constructor === Object && Object.keys(obj).length === 0;
}

/**
 * 生成随机字符串
 * @param {number} len 长度
 */
export function generateSalt(len) {
  const set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
  const setLen = set.length;

  let salt = "";
  for (let i = 0; i < len; i++) {
    const p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}
