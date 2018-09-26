import request from "./request";
const dev = window.location.hostname.indexOf("localhost") === -1 ? "" : "http://127.0.0.1:8888";

class SDK {
  // session
  login = ({ body }) => {
    return request(`${dev}/api/v1/sessions`, {
      method: "POST",
      body
    });
  };

  register = ({ body }) => {
    return request(`${dev}/api/v1/sessions/register`, {
      method: "POST",
      body
    });
  };

  sendSMS = ({ body }) => {
    return request(`${dev}/api/v1/sessions/sms`, {
      method: "POST",
      body
    });
  };

  getEventsList = ({ query }) => {
    return request(`${dev}/api/v1/events/lists`, {
      query
    });
  };

  deleteEvent = ({ body }) => {
    return request(`${dev}/api/v1/events/delete`, {
      method: "POST",
      body
    });
  };

  saveEvent = ({ body }) => {
    return request(`${dev}/api/v1/events/save`, {
      method: "POST",
      body
    });
  };

  getEventsStatus = ({ query }) => {
    return request(`${dev}/api/v1/events/statusList`, {
      query
    });
  };

  changeEventsStatus = ({ body }) => {
    return request(`${dev}/api/v1/events/status`, {
      method: "POST",
      body
    });
  };

  getAccounts = ({ query }) => {
    return request(`${dev}/api/v1/sessions/get`, {
      query
    });
  };

  saveAccounts = ({ body }) => {
    return request(`${dev}/api/v1/sessions/save`, {
      method: "POST",
      body
    });
  };

  getQiniu = ({ query }) => {
    return request(`${dev}/api/v1/events/qiniu`, {
      query
    });
  };
}

const sdk = new SDK();
export default sdk;
