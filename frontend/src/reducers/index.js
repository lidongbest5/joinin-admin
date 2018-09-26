import { combineReducers } from "redux";
import { routerReducer as routes } from "react-router-redux";

import session from "./session";
import forms from "./form";
import entities from "./entities";
import events from "./events";

export default combineReducers({
  session,
  routes,
  entities,
  forms,
  events
});
