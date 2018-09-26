import moment from "moment";
import _ from "lodash";
import { EVENTS_LIST, EVENT_DELETE, EVENT_STATUS_LIST, EVENT_STATUS_CHANGE, GET_QINIU, types } from "../actions";

const initialState = {
  list: [],
  fetched: false,
  statusList: [],
  statusFetched: false,
  statusChangeFetched: false
};

const EVENTS_LIST_SUCCESS = types(EVENTS_LIST).SUCCESS;
const EVENT_DELETE_SUCCESS = types(EVENT_DELETE).SUCCESS;
const EVENT_STATUS_LIST_SUCCESS = types(EVENT_STATUS_LIST).SUCCESS;
const EVENT_STATUS_CHANGE_SUCCESS = types(EVENT_STATUS_CHANGE).SUCCESS;
const GET_QINIU_SUCCESS = types(GET_QINIU).SUCCESS;

export default function sessionReducer(state = initialState, { type, payload, error }) {
  switch (type) {
    case EVENTS_LIST_SUCCESS: 
      return { ...state, ...payload.result, fetched: true };
    case EVENT_DELETE: 
      return { ...state, fetched: false };
    case EVENT_DELETE_SUCCESS: 
      return { ...state, ...payload.result, fetched: true };
    case GET_QINIU_SUCCESS: 
      return { ...state, ...payload.result};
    case EVENT_STATUS_LIST: 
      return { ...state, statusFetched: false };
    case EVENT_STATUS_LIST_SUCCESS: 
      return { ...state, ...payload.result, statusFetched: true };
    case EVENT_STATUS_CHANGE: 
      return { ...state, statusChangeFetched: true };
    case EVENT_STATUS_CHANGE_SUCCESS: 
      const { id, status, replyReason } = payload.result;
      const tmp = _.cloneDeep(state.statusList);
      tmp.forEach(item => {
        if (item.id === id) {
          item.status = status;
          item.replyReason = replyReason;
        }
      });
      return { ...state, statusList: tmp, statusChangeFetched: false };
    default:
      return state;
  }
}
