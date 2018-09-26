import union from "lodash/union";

import { types } from "../actions";

const initState = {
  loading: false,
  nextPageUrl: undefined,
  pageCount: 0,
  result: [],
  meta: {},
  hasError: false
};

export default function paginate(base, append) {
  const reducer = (state = initState, { type, payload = {}, error }) => {
    let { nextPageUrl, result = [] } = payload;
    result = append ? union(result, state.result) : result;
    switch (type) {
      case base:
        return { ...state, loading: true, meta: payload, hasError: false };
      case types(base).SUCCESS:
        return {
          ...state,
          loading: false,
          nextPageUrl,
          result,
          pageCount: state.pageCount + 1
        };
      case types(base).FAILURE:
        return { ...state, loading: false, hasError: true };
      default:
        return state;
    }
  };

  return reducer;
}
