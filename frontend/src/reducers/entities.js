import merge from "lodash/merge";

const initState = {
  orders: {}
};

// Updates an entity cache in payload to any action with payload.entities.
export default function entities(state = initState, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
}
