import { denormalize } from "normalizr";
import moment from "moment";

export const selectFormData = (state, formName) => state.forms[formName];
export const selectRouteState = state => state.routes.location.state || {};
export const selectSession = state => state.session;
