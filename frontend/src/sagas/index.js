import { call, put, all, takeLatest, select } from "redux-saga/effects";
import { push } from "react-router-redux";
import { message } from "antd";

import {
  selectRouteState,
  selectSession,
} from "../selectors";

import {
  LOGIN,
  LOGOUT,
  SMS,
  REGISTER,
  EVENTS_LIST,
  EVENT_DELETE,
  EVENT_SAVE,
  EVENT_STATUS_LIST,
  EVENT_STATUS_CHANGE,
  ACCOUNTS_GET,
  ACCOUNTS_SAVE,
  GET_QINIU,
  receive,
  fail
} from "../actions";
import sdk from "../lib/sdk";

/************** 简单 api 调用 ******************/

// TODO: 合并 callAPI
// const API = {
//   'actionType': sdk.someAPI
// }
// yield call(API[action.type], action.payload);
function* callAPI(api, action) {
  try {
    const data = yield call(api, action.payload);
    return yield put(receive(action.type)(data));
  } catch (e) {
    console.log(e);
    yield put(fail(action.type)(e));
  }
}

const register = callAPI.bind(null, sdk.register);
const sendSMS = callAPI.bind(null, sdk.sendSMS);
const getEventsList = callAPI.bind(null, sdk.getEventsList);
const deleteEvent = callAPI.bind(null, sdk.deleteEvent);
const getEventsStatus = callAPI.bind(null, sdk.getEventsStatus);
const changeEventsStatus = callAPI.bind(null, sdk.changeEventsStatus);
const getAccounts = callAPI.bind(null, sdk.getAccounts);
const saveAccounts = callAPI.bind(null, sdk.saveAccounts);
const getQiniu = callAPI.bind(null, sdk.getQiniu);

/******************** 复杂业务逻辑的调用 ******************************/

function* login(action) {
  try {
    const data = yield call(sdk.login, action.payload);
    yield put(receive(action.type)(data));

    // store in localstorage
    const session = yield select(selectSession);
    localStorage.setItem("token", session.token);

    const { from } = yield select(selectRouteState);
    const to = from ? from.pathname : "/";
    yield put(push(to));
  } catch (e) {
    console.log(e);
    yield put(fail(action.type)(e));
  }
}

function* logout(action) {
  // remove token
  localStorage.removeItem("token");

  yield put(push("/login"));
}

function* saveEvent(action) {
  try {
    const data = yield call(sdk.saveEvent, action.payload);
    yield put(receive(action.type)(data));

    message.success("保存活动成功!");
    yield put(push("/events"));
  } catch (e) {
    console.log(e);
    yield put(fail(action.type)(e));
  }
}

function flashError({ error }) {
  const msg = error.errMsg || "api 请求错误";
  message.error(msg);
}

function flashSuccess({ type }) {
  const msg = `Request ${type} success`;
  message.success(msg);
}

/*
  Alternatively you may use takeLatest.
  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
export default function* rootSaga() {
  yield all([
    takeLatest(LOGIN, login),
    takeLatest(REGISTER, register),
    takeLatest(LOGOUT, logout),
    takeLatest(SMS, sendSMS),
    takeLatest(EVENTS_LIST, getEventsList),
    takeLatest(EVENT_DELETE, deleteEvent),
    takeLatest(EVENT_SAVE, saveEvent),
    takeLatest(EVENT_STATUS_LIST, getEventsStatus),
    takeLatest(EVENT_STATUS_CHANGE, changeEventsStatus),
    takeLatest(ACCOUNTS_GET, getAccounts),
    takeLatest(ACCOUNTS_SAVE, saveAccounts),
    takeLatest(GET_QINIU, getQiniu),
    takeLatest(isFailure, flashError)
  ]);
}

function isFailure(action) {
  return action.type.includes("FAILURE");
}
