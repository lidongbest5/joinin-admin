function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function clean(obj) {
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

function handleError(res, err) {
  throw err;
  return res.status(500).json({ err });
}

function stringToQuery(str) {
  const arr = Array.isArray(str) ? str : str.split(",");
  let result = "";
  arr.map((item, index) => {
    let value = item;
    if (isNaN(item)) {
      value = "\'" + item.replace(/\'/ig,"\\'") + "\'";
    }
    if (index === 0) {
      result += value;
    } else {
      result += "," + value;
    }
  });
  return result;
}

function removeSpaceAndLowerCase(str) {
  return str && str.toString().replace(/\s/g, "").toLowerCase();
}

function getPermission(req, res, token) {
  try {
    const authorization = token || req.headers.bigoneper;
    try {
      if (authorization) {
        return JSON.parse(authorization);
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } catch (e) {
    return false;
  }
}

module.exports = {
  getPermission,
  removeSpaceAndLowerCase,
  stringToQuery,
  handleError,
  clean,
  isEmptyObject
};
