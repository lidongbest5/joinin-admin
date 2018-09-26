import qs from "qs";
import { normalize } from "normalizr";
import { camelizeKeys } from "humps";

import { clean } from "../lib";

function withDefaultHeaders(headers) {
  // TODO: 性能不太好，考虑修改
  const token = localStorage.getItem("token");
  const Authorization = token ? `Bearer ${token}` : null;

  return clean({
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization,
    ...headers
  });
}

// function handleResponse(response) {
//   const defaultType = "application/json";
//   const contentType = response.headers.get("Content-Type") || defaultType;

//   let parser;
//   if (contentType.includes("application/pdf")) {
//     parser = response.blob();
//   } else if (contentType.includes("application/json")) {
//     parser = response.json().then(json;
//   } else {
//     parser = response.text();
//   }

//   if (!response.ok) {
//     return parser.then(err => {
//       throw new Error(err);
//     });
//   }

//   return parser;
// }

// Extracts the next page URL from response header.
function getNextPageUrl(response) {
  const link = response.headers.get("link");
  if (!link) {
    return null;
  }

  const nextLink = link.split(",").find(s => s.indexOf('rel="next"') > -1);
  if (!nextLink) {
    return null;
  }

  return nextLink.split(";")[0].slice(1, -1);
}

async function request(endpoint, options) {
  const headers = withDefaultHeaders(options.headers);
  const body = options.body ? JSON.stringify(options.body) : undefined;
  const opts = Object.assign({}, options, { body, headers });
  const query = qs.stringify(options.query, { skipNulls: true });
  const url = `${endpoint}?${query}`;

  return fetch(url, opts)
    .then(response => {
      let jsonResponse;
      try {
        jsonResponse = response.json();
      } catch (err) {
        jsonResponse = {};
      }
      return jsonResponse.then(json => ({ json, response }));
    })
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);
      const nextPageUrl = getNextPageUrl(response);

      return Object.assign({}, normalize(camelizedJson, options.schema || {}), {
        nextPageUrl
      });
    });
}

export default request;
