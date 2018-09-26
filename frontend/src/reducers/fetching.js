import { types } from "../actions";

const initState = {
  loading: false,
  result: null,
  error: null
};

export default baseType => {
  const reducer = (state = initState, { type, payload = {}, error }) => {
    const { result } = payload;

    switch (type) {
      case baseType:
        return { ...state, loading: true, meta: payload };
      case types(baseType).SUCCESS:
        return {
          ...state,
          loading: false,
          result,
          error: null
        };
      case types(baseType).FAILURE:
        return {
          ...state,
          loading: false,
          error
        };
      default:
        return state;
    }
  };

  return reducer;
};
