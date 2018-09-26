import { SAVE_FIELDS, RESET_FORM } from "../actions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case SAVE_FIELDS:
    case RESET_FORM:
      return { ...state, [payload.name]: form(state[payload.name], { type, payload }) };
    default:
      return state;
  }
};

function form(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_FIELDS:
      return { ...state, fields: { ...state.fields, ...payload.fields } };
    case RESET_FORM:
      return { ...state, fields: {} };
    default:
      return state;
  }
}
