import axios from "axios";

const apiParams = {
  headers: {
    "Content-Type": "application/json",
  }
};
export function api(url, queries, callBack, errorCallBack) {
  var cUrl = url;
  if (0 < queries.length) {
    cUrl = cUrl + '?' + queries.join(',');
  }
  axios.get(encodeURI(cUrl), apiParams)
  .then((res) => {
    console.log(`api [${encodeURI(cUrl)}]`);
    console.log(res.data.data);
    callBack(res);
  }).catch((error) => {
    if (error.response != null || error.response !== 'undefined') {
      // let status = error.response.status != null ? error.response.status : "?";
      console.log(`api error [${encodeURI(cUrl)}] => `);
    } else {
      console.log(`api error [${encodeURI(cUrl)}]`);
    }
    console.log(error);
    errorCallBack(error);
  });
}

export function fetchInformation(informationId, a, b) {
  api(`/api/information/${informationId}`, [], a, b);
}

export function fetchInformationEvents(informationId, a, b) {
  api(`/api/information/${informationId}/events`, [], a, b);
}

export function fetchPage(informationId, pageId, a, b) {
  api(`/api/information/${informationId}/pages/${pageId}`, [], a, b);
}

export function fetchShop(shopId, a, b) {
  api(`/api/shops/${shopId}`, [], a, b);
}

export function fetchEvent(eventId, a, b) {
  api(`/api/events/${eventId}`, [], a, b);
}

export function fetchSearch(keyword, a, b) {
  let query = `keyword=${keyword}`;
  api('/api/information/search', [query], a, b);
}