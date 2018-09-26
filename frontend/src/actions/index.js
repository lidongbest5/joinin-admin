import { normalize } from "normalizr";

export function types(base) {
  return ["SUCCESS", "FAILURE"].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}

export function base(type) {
  return type.replace(/_SUCCESS|_FAILURE/, "");
}

/***************************** action creators ************************************/

export const receive = (base, schema) => (payload, meta) => ({
  type: types(base).SUCCESS,
  payload: schema ? normalize(payload, schema) : payload,
  meta
});

export const fail = base => (error, meta) => ({
  type: types(base).FAILURE,
  error,
  meta
});

/***************************** constants ************************************/

// session
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";
export const LOGOUT = "LOGOUT";
export const SMS = "SMS";

// accounts
export const ACCOUNTS_GET = "ACCOUNTS_GET";
export const ACCOUNTS_SAVE = "ACCOUNTS_SAVE";

// form
export const INIT_FORM = "INIT_FORM";
export const RESET_FORM = "RESET_FORM";
export const SAVE_FIELDS = "SAVE_FIELDS";

// events
export const EVENTS_LIST = "EVENTS_LIST";
export const EVENT_DELETE = "EVENT_DELETE";
export const EVENT_SAVE = "EVENT_SAVE";
export const EVENT_STATUS_LIST = "EVENT_STATUS_LIST";
export const EVENT_STATUS_CHANGE = "EVENT_STATUS_CHANGE";
export const GET_QINIU = "GET_QINIU";

/***************************** actions ************************************/

/**
 * api 相关调用规范
 *
 * action 的参数是显示的，意义明确
 * 通过明确的字段组装在 payload 里，然后传递给 saga
 * saga 调用 api，参数直接是 action.payload，无需解析
 * sdk.api({id, body, query})
 */

// session
export const login = (username, password) => ({
  type: LOGIN,
  payload: { body: { username, password } }
});

export const register = body => ({
  type: REGISTER,
  payload: { body }
});

export const sendSMS = body => ({
  type: SMS,
  payload: { body }
});

export const logout = () => ({
  type: LOGOUT,
  payload: {}
});

// accounts
export const getAccounts = query => ({
  type: ACCOUNTS_GET,
  payload: { query }
});

export const saveAccounts = body => ({
  type: ACCOUNTS_SAVE,
  payload: { body }
});

// events

export const getEventsList = query => ({
  type: EVENTS_LIST,
  payload: { query }
});

export const deleteEvent = body => ({
  type: EVENT_DELETE,
  payload: { body }
});

export const saveEvent = body => ({
  type: EVENT_SAVE,
  payload: { body }
});

export const getEventsStatus = query => ({
  type: EVENT_STATUS_LIST,
  payload: { query }
});

export const changeEventsStatus = body => ({
  type: EVENT_STATUS_CHANGE,
  payload: { body }
});

export const getQiniu = query => ({
  type: GET_QINIU,
  payload: { query }
});

// form
export const initForm = (name, fields) => ({
  type: INIT_FORM,
  payload: { fields, name }
});
export const saveFields = (name, fields) => ({
  type: SAVE_FIELDS,
  payload: { fields, name }
});
export const resetForm = name => ({
  type: RESET_FORM,
  payload: { name }
});
