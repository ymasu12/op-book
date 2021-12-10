import axios from "axios";

const apiParams = {
  headers: {
    "Content-Type": "application/json",
  }
};

export function api(url, queries, callBack, errorCallBack, fin) {
  var cUrl = process.env.REACT_APP_API + url;
  if (0 < queries.length) {
    cUrl = cUrl + '?' + queries.join('&');
  }
  axios.get(encodeURI(cUrl), apiParams)
  .then((res) => {
    console.log(`api [${encodeURI(cUrl)}]`);
    console.log(res.data.data);
    callBack(res);
  }).catch((error) => {
    if (error.response != null) {
      // let status = error.response.status != null ? error.response.status : "?";
      console.log(`api error [${encodeURI(cUrl)}] => `);
    } else {
      console.log(`api error [${encodeURI(cUrl)}]`);
    }
    console.error(error);
    if (errorCallBack != null) {
      errorCallBack(error);
    }
  }).finally(() => {
    if (fin != null) {
      fin();
    }
  });
}

export function fetchInformation(informationId, a, b = null, c = null) {
  api(`/api/information/${informationId}`, [], a, b, c);
}

export function fetchInformationEvents(informationId, after = 0, limit = 10, offset = 0, a, b = null, c = null) {
  let queryAfter = `after=${after}`;
  let queryLimit = `limit=${limit}`;
  let queryOffset = `offset=${offset}`;
  api(`/api/information/${informationId}/events`, [queryAfter, queryLimit, queryOffset], a, b, c);
}

export function fetchPage(informationId, pageId, a, b = null, c = null) {
  api(`/api/information/${informationId}/pages/${pageId}`, [], a, b, c);
}

export function fetchShop(shopId, a, b = null, c = null) {
  api(`/api/shops/${shopId}`, [], a, b, c);
}

export function fetchEvent(eventId, a, b = null, c = null) {
  api(`/api/events/${eventId}`, [], a, b, c);
}

export function fetchSearch(keyword, a, b = null, c = null) {
  let query = `keyword=${keyword}`;
  api('/api/information/search', [query], a, b, c);
}