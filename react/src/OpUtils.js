const URL_PREFIX = '';
const URL_TOP = '';
const URL_SEARCH = 'search';
const URL_INFORMATION = 'pamphlet';
const URL_SHOPS = 'shops';
const URL_EVENTS = 'events';
const URL_PAGES = 'pages';

export function BuildUrl(...a) {
  return '/' + a.filter(word => word !== '').join('/');
}

export function TopPath() {
  return BuildUrl(URL_PREFIX, URL_TOP);
}
export function SearchPath() {
  return BuildUrl(URL_PREFIX, URL_SEARCH);
}
export function InformationPath(informationId) {
  return BuildUrl(
    URL_PREFIX,
    URL_INFORMATION,
    informationId);
}
export function PagePath(informationId, pageId) {
  return BuildUrl(
    URL_PREFIX,
    URL_INFORMATION,
    informationId,
    URL_PAGES,
    pageId);
}
export function ShopPath(shopId) {
  return BuildUrl(
    URL_PREFIX,
    URL_SHOPS,
    shopId);
}
export function EventPath(eventId) {
  return BuildUrl(
    URL_PREFIX,
    URL_EVENTS,
    eventId);
}
export function InformationShopsPath(informationId) {
  return BuildUrl(
    URL_PREFIX,
    URL_INFORMATION,
    informationId,
    URL_SHOPS);
}
export function InformationEventsPath(informationId) {
  return BuildUrl(
    URL_PREFIX,
    URL_INFORMATION,
    informationId,
    URL_EVENTS);
}
export function PageShopPath(informationId, pageId, shopId) {
  return BuildUrl(
    URL_PREFIX,
    URL_INFORMATION,
    informationId,
    URL_PAGES,
    pageId,
    URL_SHOPS,
    shopId);
}
export function ImgUrl(path) {
  return process.env.REACT_APP_CONTENTS_URL + path;
}
export function MiconUrl(code) {
  return ImgUrl(`/images/micons/${code}.svg`);
}
export function VCHideHeaderFooter() {
  if (document.querySelector('header') != null) {
    if (!document.querySelector('header').classList.contains('fullMode')) {
      document.querySelector('header').classList.add('fullMode');
    }
  }
  if (document.querySelector('footer') != null) {
    if (!document.querySelector('footer').classList.contains('fullMode')) {
      document.querySelector('footer').classList.add('fullMode');
    }
  }
}
export function VCShowHeaderFooter() {
  if (document.querySelector('header') != null) {
    if (document.querySelector('header').classList.contains('fullMode')) {
      document.querySelector('header').classList.remove('fullMode');
    }
  }
  if (document.querySelector('footer') != null) {
    if (document.querySelector('footer').classList.contains('fullMode')) {
      document.querySelector('footer').classList.remove('fullMode');
    }
  }
}
export function VCIconOwner() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>;
}
export function VCIconView() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>;
}
export function VCIconBack() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>;
}
export function VCIconClose() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
}

export function VCIconList() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>;
}

export function VCIconFilter() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/></svg>;
}

export function VCIconX() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>;
}

export function VCIconPamphletHome() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></svg>;
}

export function IsEmpty(src) {
  return src === null || src === undefined || src.length === 0;
}

export function VCBackLinkTab(props) {
  if (props.history.length !== 0) {
    return <div className='back-link' onClick={() => props.history.goBack()}>{VCIconBack()}Back</div>;
  } else {
    return null;
  }
}

export function IsDebug() {
  return document.querySelector('#ap-app-is-debug') != null;
}

export function DebugView(items = []) {
  if (IsDebug()) {
    var itemTag = items.map((item) => {
      return <div key={item.key}>{`${item.key} : ${item.value}`}</div>;
    });
    return <div className="output">{itemTag}</div>;
  }
}
export function DebugViewUpdate(key, value) {
  if (IsDebug()) {
    let text = `${key} : ${value}`;
    let debugElement = document.querySelector('.output');
    if (debugElement != null) {
      var targetElement = debugElement.querySelector(`.output [data-key='${key}']`);
      if (targetElement != null) {
        targetElement.innerHTML = text;
      } else {
        debugElement.insertAdjacentHTML('beforeend', `<div data-key=${key}>${text}</div>`);
      }
    }
  }
}
export function buildAddress(src) {
  if (src != null) {
    var result = src.prefecture || '';
    result = result + (src.address1 || '');
    result = result + (src.address2 || '');
    return result;
  }
  return null;
}

export function shopFuncTag(src) {
  if (src != null) {
    var tags = src.functions.map((f) => {
      switch (f.group_code) {
        case 'payment':
          return <li key={`${f.group_code}_${f.id}`}>{`${FNC_PAYMENT[f.number]}`}</li>;
        case 'method':
          return <li key={`${f.group_code}_${f.id}`}>{`${FNC_METHOD[f.number]}`}</li>;
        case 'baby':
          return <li key={`${f.group_code}_${f.id}`}>{`${FNC_BABY[f.number]}`}</li>;
        case 'investment':
          return <li key={`${f.group_code}_${f.id}`}>{`${FNC_INVESTMENT[f.number]}`}</li>;
        case 'language':
          return <li key={`${f.group_code}_${f.id}`}>{`${FNC_LANGUAGE[f.number]}`}</li>;
        default:
          return null;
      }
    });
    return <ul className='functionList'>{tags}</ul>;
  }
}

const FNC_PAYMENT = {1: '現金のみ',2: 'MasterCard',3: 'VISA',4: 'JCB',5: 'アメリカンエクスプレス',6: 'ダイナーズクラブ',7: 'PayPay',8: '交通系IC',9: '楽天Edy',10: '楽天Pay',11: 'QuicPay',12: 'iD',13: 'LINE Pay',14: 'メルペイ',15: 'au PAY'};
const FNC_METHOD = {1: 'デリバリーあり',2: '持ち帰りあり'};
const FNC_BABY = {1: 'ベビーチェアあり',2: 'ベビーカー入店OK',3: 'おむつ替えあり',4: 'おむつゴミOK',5: '授乳スペースあり',6: '電子レンジあり',7: 'お湯あり',8: 'キッズスペースあり'};
const FNC_INVESTMENT = {1: 'トイレあり',2: '駐車場あり',3: '駐輪場あり',4: '喫煙',5: '分煙',6: '禁煙'};
const FNC_LANGUAGE = {1: '英語',2: '中国語',3: '韓国語'};
