import moment from "moment";
import { message } from "antd";
import { LOGIN, LOGOUT, REGISTER, ACCOUNTS_GET, ACCOUNTS_SAVE, types } from "../actions";

const initialState = {
  loading: false,
  submitting: false,
  accountGetFetching: false,
  accountSaveFetching: false,
};

const LOGIN_SUCCESS = types(LOGIN).SUCCESS;
const LOGIN_FAILURE = types(LOGIN).FAILURE;
const REGISTER_SUCCESS = types(REGISTER).SUCCESS;
const REGISTER_FAILURE = types(REGISTER).FAILURE;
const ACCOUNTS_GET_SUCCESS = types(ACCOUNTS_GET).SUCCESS;
const ACCOUNTS_SAVE_SUCCESS = types(ACCOUNTS_SAVE).SUCCESS;

export default function sessionReducer(state = initialState, { type, payload, error }) {
  switch (type) {
    case LOGIN:
      return { ...state, loading: true };
    case REGISTER:
      return { ...state, submitting: true };
    case LOGOUT:
      return initialState;
    case REGISTER_SUCCESS: 
      return { ...state, ...payload.result, submitting: false };
    case REGISTER_FAILURE: 
      return { ...state, error, submitting: false };
    case LOGIN_SUCCESS:
      return { ...state, ...payload.result, loading: false };
    case LOGIN_FAILURE:
      return { ...state, error, loading: false };
    case ACCOUNTS_GET:
      return { ...state, accountGetFetching: true };
    case ACCOUNTS_GET_SUCCESS:
      return { ...state, ...payload.result, accountGetFetching: false };
    case ACCOUNTS_SAVE:
      return { ...state, accountSaveFetching: true };
    case ACCOUNTS_SAVE_SUCCESS:
      message.success("保存成功");
      const tmp = Object.assign({}, state.account, payload.result);
      return { ...state, account: tmp, accountSaveFetching: false };
    default:
      return state;
  }
}
