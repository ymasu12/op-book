import {useState, useEffect, useRef} from 'react';
import { withRouter, Link } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';
import PageShopView from './PageShopView';
import ShopList from './ShopList';
import ContentView from './ContentView';

const Page = (props) => {
  let informationId = props.match.params.informationId;
  let pageId = props.match.params.pageId;
  
  const [information, setInformation] = useState({name: ''});
  const [page, setPage] = useState({name: '', image: ''});
  const [shops, setShops] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedShop, setSelectedShop] = useState();
  const [selectedFacility, setSelectedFacility] = useState({name: '', description: '', contents: [], puid: 'xxx'});
  const [selectedContent, setSelectedContent] = useState();
  const [indicatorManager, setIndicator] = useState(false);
  const [uiState, setUiState] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    touchState: 'none',
    offset: {x: 0, y: 0},
    initOfs: {x: 0, y: 0},
    prevTouches: [],
    currentDist: 0,
    currentStartDist: 0,
    initRate: 1,
    rate2: 1,
    zoomStartRate: 1,
    zoomStartOfs: {x: 0, y: 0},
  });
  const uiStateRef = useRef(null);
  uiStateRef.current = uiState;
  
  // .......Transitions
  const [shopViewInProp, setShopViewInProp] = useState(false);
  const [facilityViewInProp, setFacilityViewInProp] = useState(false);
  const [shopListInProp, setShopListInProp] = useState(false);
  const [pageMenuInProp, setPageMenuInProp] = useState(true);
  const transitionStyles = {
    entering: { top: 0, transition: 'all .25s ease-in' },
    entered: { top: 0 },
    exiting: { top: '100%', transition: 'all .2s ease-in' },
    exited: { top: '100%' },
  };
  const menuTransitionStyles = {
    entering: { bottom: 0, transition: 'all .35s ease' },
    entered: { bottom: 0 },
    exiting: { bottom: '-100%', transition: 'all .3s ease' },
    exited: { bottom: '-100%' },
  };
  
  // useEffect(() =>{
  //   var offset = {x: 0, y: 0};
  //   var rate = 1;
  //   if (props.location.state != null) {
  //     if (props.location.uiState.offset != null) {
  //       offset = props.location.uiState.offset;
  //     }
  //     if (props.location.uiState.rate2 != null) {
  //       rate = props.location.uiState.rate2;
  //     }
  //   }
  //   setUiState(uiState => ({...uiState,
  //     offset: offset,
  //     rate2: rate,
  //   }));
  // }, []);
  
  // fetch page.
  useEffect(() => {
    setIndicator(true);
    Api.fetchPage(informationId, pageId, (res) => {
      const data = res.data.data;
      setPage(data.page);
      setShops(data.shops);
      setFacilities(data.facilities);
      
      // set init offset.
      var wr = parseFloat(uiStateRef.current.width) / parseFloat(data.page.canvas_column);
      var hr = parseFloat(uiStateRef.current.height) / parseFloat(data.page.canvas_row);
      var x = 0, y = 0, rate = 1;
      if (wr < hr) {
        y = (parseFloat(uiStateRef.current.height) - parseFloat(data.page.canvas_row) * wr) / 2;
        rate = wr;
      } else {
        x = (parseFloat(uiStateRef.current.width) - parseFloat(data.page.canvas_column) * hr) / 2;
        rate = hr;
      }
      setUiState(uiState => ({...uiStateRef.current,
        initOfs: {
          x: x,
          y: y,
        },
        initRate: rate,
      }));
      setIndicator(false);
    }, (error) => {
      // alert("エラーです！");
      console.log('fetch page error.');
      setIndicator(false);
    });
    Api.fetchInformation(informationId, (res) => {
      setInformation(res.data.data.information);
    }, (error) => {
      console.log('fetch page error.');
    });
  }, [informationId, pageId]);
  
  // set events.
  // can not use react event(ex. onTouchStart) then use "e.preventDefault".
  useEffect(() => {
    document.querySelector('.op-page .canvas').addEventListener('touchstart', (e) => handleTouchStart(e), {passive: true});
    document.querySelector('.op-page .canvas').addEventListener('touchend', (e) => handleTouchEnd(e), {passive: true});
    document.querySelector('.op-page .canvas').addEventListener('touchmove', (e) => handleMouseMove(e), {passive: false});
    Opu.VCHideHeaderFooter();
  }, []);
  
  /** 
   * Handler [touchmove]
   */
  const handleMouseMove = (event) => {
    Opu.DebugViewUpdate('mousMove-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    event.preventDefault();
    var newTouches = [];
    let _uiState = uiStateRef.current;
    for (var i = 0; i < _uiState.prevTouches.length; i++) {
      var e = 0;
      for (; e < event.changedTouches.length; e++) {
        if (event.changedTouches[e].identifier === _uiState.prevTouches[i].id) {
          newTouches.push({
            id: event.changedTouches[e].identifier,
            x: event.changedTouches[e].clientX,
            y: event.changedTouches[e].clientY,
          });
          break;
        }
      }
      if (e === event.changedTouches.length) {
        newTouches.push({
          id: _uiState.prevTouches[i].id,
          x: _uiState.prevTouches[i].x,
          y: _uiState.prevTouches[i].y,
        });
      }
    }
    if (_uiState.touchState === 'move') {
      if (event.changedTouches.length === 1) {
        var dfx = 0, dfy = 0;
        for (var u = 0; u < _uiState.prevTouches.length; u++) {
          if (event.changedTouches[0].identifier === _uiState.prevTouches[u].id) {
            dfx = event.changedTouches[0].clientX - _uiState.prevTouches[u].x;
            dfy = event.changedTouches[0].clientY - _uiState.prevTouches[u].y;
            break;
          }
        }
        setUiState(uiState => ({..._uiState,
          offset: {
            x: _uiState.offset.x + dfx,
            y: _uiState.offset.y + dfy,
          },
          prevTouches: newTouches,
        }));
      }
    } else if (_uiState.touchState === 'zoom') {
      if (event.touches.length === 2) {
        var dist1 = event.touches[0].clientX - event.touches[1].clientX;
        var dist2 = event.touches[0].clientY - event.touches[1].clientY;
        dist1 = 0 < dist1 ? dist1 : -dist1;
        dist2 = 0 < dist2 ? dist2 : -dist2;
        
        // 中心
        var ax = event.touches[0].clientX;
        var ay = event.touches[0].clientY;
        var bx = event.touches[1].clientX;
        var by = event.touches[1].clientY;
        var qx = (ax + bx) / 2;
        var qy = (ay + by) / 2;
        var gx = _uiState.zoomStartOfs.x;
        var gy = _uiState.zoomStartOfs.y;
        var zw = qx - gx;
        var zh = qy - gy;
        var oRate = _uiState.currentDist / _uiState.currentStartDist;
        var cw = qx - (zw * oRate);
        var ch = qy - (zh * oRate);
        var newRate = _uiState.zoomStartRate * oRate;
        var rateDiff = newRate - _uiState.rate2;

        Opu.DebugViewUpdate('output6', `q:(${qx.toFixed(2)}, ${qy.toFixed(2)})  diff:(${zw.toFixed(2)}, ${zh.toFixed(2)}  last:(${cw.toFixed(2)}, ${ch.toFixed(2)})`);
        Opu.DebugViewUpdate('output7', `zoom (new):${newRate.toFixed(3)} (old):${_uiState.rate2.toFixed(3)} (diff):${rateDiff.toFixed(5)}`);
        
        setUiState(uiState => ({..._uiState,
          currentDist: dist1 + dist2,
          rate2: newRate,
          offset: {
            x: cw,
            y: ch,
          },
          prevTouches: newTouches,
        }));
      }
    }
  };
  /** 
   * Handler [touchstart]
   */
  const handleTouchStart = (event) => {
    Opu.DebugViewUpdate('touchStart-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    let dist;
    let _uiState = uiStateRef.current;
    if (event.touches.length === 2) {
      var dist1 = event.touches[0].clientX - event.touches[1].clientX;
      var dist2 = event.touches[0].clientY - event.touches[1].clientY;
      dist1 = 0 < dist1 ? dist1 : -dist1;
      dist2 = 0 < dist2 ? dist2 : -dist2;
      dist = dist1 + dist2;
    }
    if ((_uiState.touchState === 'none' || _uiState.touchState === 'move') && event.touches.length === 1) {
      var prev = _uiState.prevTouches;
      var i = 0;
      for (; i < prev.length; i++) {
        if (prev[i].id === event.changedTouches[0].identifier) {
          prev.x = event.changedTouches[0].clientX;
          prev.y = event.changedTouches[0].clientY;
          break;
        }
      }
      if (i === prev.length) {
        prev.push({id: event.changedTouches[0].identifier, x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
      }
      setUiState(uiState => ({..._uiState,
        touchState: 'move',
        prevTouches: prev
      }));
    } else if ((_uiState.touchState === 'none' || _uiState.touchState === 'move') && event.touches.length === 2) {
      var prev2 = [];
      for (var e = 0; e < event.touches.length; e++) {
        prev2.push({
          id: event.touches[e].identifier,
          x: event.touches[e].clientX,
          y: event.touches[e].clientY,
        });
      }
      setUiState(uiState => ({..._uiState,
        touchState: 'zoom',
        currentStartDist: dist,
        zoomStartOfs: {x: _uiState.offset.x, y: _uiState.offset.y},
        zoomStartRate: _uiState.rate2,
        prevTouches: prev2,
      }));
    }
  };
  /** 
   * Handler [touchend]
   */
  const handleTouchEnd = (event) => {
    Opu.DebugViewUpdate('touchEnd-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    var prev = [];
    let _uiState = uiStateRef.current;
    for (var i = 0; i < _uiState.prevTouches.length; i++) {
      var remove = false;
      for (var e = 0; e < event.changedTouches.length; e++) {
        if (event.changedTouches[e].identifier === _uiState.prevTouches[i].id) {
          remove = true;
          break;
        }
      }
      if (!remove) {
        prev.push(_uiState.prevTouches[i]);
      }
    }
    var state = 'none';
    if (_uiState.touchState === 'zoom') {
      if (event.touches.length === 1) {
        state = 'move';
      }
    }
    setUiState(uiState => ({..._uiState,
      touchState: state,
      prevTouches: prev,
    }));
  };
  const handleSelectedShop = (event) => switchShopView(event.target.dataset.shopId);
  const handleSelectedFacility = (event) => switchFacilityView(event.target.dataset.facilityId);
  const allReset = () => setUiState(uiState => ({...uiState, rate2: 1, offset: {x: 0, y: 0}}));
  // ============================= FILTER =============================
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const selectedCategory = (code) => {
    var newList = [];
    var fNotFound = true;
    for (var i = 0; i < selectedCategoryList.length; i++) {
      if (selectedCategoryList[i] === code) {
        // not contain new list.
        fNotFound = false;
      } else {
        newList.push(selectedCategoryList[i]);
      }
    }
    if (fNotFound) {
      newList.push(code);
    }
    setSelectedCategoryList(newList);
  };
  const categories = [
    {code: 'eat', name: '食事'},
    {code: 'shop', name: 'ショップ'},
    {code: 'service', name: 'サービス'},
    {code: 'entertainment', name: 'エンタメ'},
    {code: 'any', name: 'その他'},
    {code: 'facility', name: '施設'},
  ];
  const filteredCheck = (src) => {
    if (selectedCategoryList.length === 0) {
      return true;
    } else {
      for (var i = 0; i < selectedCategoryList.length; i++) {
        if (selectedCategoryList[i] === src.category_code) {
          return true;
        }
      }
    }
    return false;
  };
  const filterBtn = (category) => {
    var filterBtnClass = 'item';
    selectedCategoryList.forEach((selectedCategory) => {
      if (selectedCategory === category.code) {
        filterBtnClass = 'item active';
      }
    });
    return (
      <div className={filterBtnClass} onClick={() => selectedCategory(category.code)}>
        {category.name}
      </div>
    );
  };
  const filterBtnTag = () => {
    return categories.map((category) => {
      return filterBtn(category);
    });
  };
  
  const switchShopView = (shopId) => {
    if (shopId != null) {
      for (var i = 0; i < shops.length; i++) {
        if (shops[i].puid === shopId) {
          const shop = shops[i];
          setSelectedShop(shop);
          setShopViewInProp(true);
          setPageMenuInProp(false);
          break;
        }
      }
    } else {
      setShopViewInProp(false);
      setPageMenuInProp(true);
    }
  };
  const switchFacilityView = (facilityId) => {
    if (facilityId != null) {
      for (var i = 0; i < facilities.length; i++) {
        if (facilities[i].puid === facilityId) {
          let facility = facilities[i];
          setSelectedFacility(facility);
          setFacilityViewInProp(true);
          break;
        }
      }
    } else {
      setFacilityViewInProp(false);
    }
  };
  const selectedShopFromList = (shopId) => {
    switchShopView(shopId);
    setShopListInProp(false);
  };
  var imgTag = <p>no image</p>;
  if (page != null) {
    var imgfStyle = {
      top: uiState.initOfs.y,
      left: uiState.initOfs.x,
      transform: `translate(${uiState.offset.x}px, ${uiState.offset.y}px)`
    };
    var imgStyle = {
      width: `${page.canvas_column * uiState.initRate * uiState.rate2}px`,
      height: `${page.canvas_row * uiState.initRate * uiState.rate2}px`
    };
    imgTag = 
      <div className="image" style={imgfStyle}>
        <img src={Opu.ImgUrl(page.image)} alt={page.name} style={imgStyle}/>
      </div>;
  }
  // shop icons.
  var shopsTag = shops.map((shop) => {
    if (!filteredCheck(shop)) {
      return null;
    }
    let aStyle = {
        top: uiState.initOfs.y + shop.y * uiState.initRate * uiState.rate2,
        left: uiState.initOfs.x + shop.x * uiState.initRate * uiState.rate2,
        transform: `translate(${uiState.offset.x}px, ${uiState.offset.y}px)`
      };
    let imgStyle = {
        width: 32 * uiState.initRate * uiState.rate2,
        height: 32 * uiState.initRate * uiState.rate2,
        transform: `translate(-50%, -50%)`,
      };
    var nameTag = null;
    if (shop.show_name) {
      nameTag = <div className='icon-name' style={{transform: `translate(-50%, calc(-0.4rem - ${32 * uiState.initRate * uiState.rate2}px))`}}>{shop.name}</div>;
    }
    return (
      <div className='icon-ab' style={aStyle}>
        <div className="shop" key={shop.puid}>
          {nameTag}
          <img className="icon" src={Opu.MiconUrl(shop.micon_code)} style={imgStyle} alt={shop.name} onClick={handleSelectedShop} data-shop-id={shop.puid}/>
        </div>
      </div>
    );
  });
  // facility icons.
  var facilitiesTag = facilities.map((facility) => {
    if (!filteredCheck({category_code: 'facility'})) {
      return null;
    }
    let aStyle = {
        top: uiState.initOfs.y + facility.y * uiState.initRate * uiState.rate2,
        left: uiState.initOfs.x + facility.x * uiState.initRate * uiState.rate2,
        transform: `translate(${uiState.offset.x}px, ${uiState.offset.y}px)`
      };
    let imgStyle = {
        width: 32 * uiState.initRate * uiState.rate2,
        height: 32 * uiState.initRate * uiState.rate2,
        transform: `translate(-50%, -50%)`,
      };
    return (
      <div className='icon-ab' style={aStyle}>
        <div className="facility" key={facility.puid}>
          <img className="icon" src={Opu.MiconUrl(facility.micon_code)} style={imgStyle} alt={facility.name} onClick={handleSelectedFacility} data-facility-id={facility.puid}/>
        </div>
      </div>
    );
  });
  var indicatorTag = indicatorManager ? <div class="loader"></div> : null;
  const selectedImage = (content = null) => setSelectedContent(content);
  const shopListBtn = () => shopListInProp || shopViewInProp ? Opu.VCIconX() : Opu.VCIconList();
  var listBtnStyle = shopListInProp ? 'list-btn close' : 'list-btn';
  const onClickListBtn = () => {
    setShopListInProp(!shopListInProp);
  };

  return (
    <div className='op-page'>
      <div className='canvas-ab'>
        <div className='canvas' style={{
          width: uiState.width != null ? uiState.width : "100vw",
          height: uiState.height != null ? uiState.height : "100vh"
        }}>
          {imgTag}
          {shopsTag}
          {facilitiesTag}
          <button onClick={allReset}>ALL RESET</button>
        </div>
      </div>
      <div id="breadcrumb" className='op-breadcrumb' style={{position: 'fixed', top: '0', left: '0'}}>
        {Opu.VCBackLinkTab(props)}
        <ol className='l-breadcrumb'>
          <li><a href={Opu.TopPath()}>Top</a></li>
          <li><a href={Opu.InformationPath(informationId)}>{information.name}</a></li>
          <li>{page.name}</li>
        </ol>
      </div>
      {Opu.DebugView([
        {key: 'state', value: uiState.touchState},
        {key: 'offset', value: `${uiState.offset.x.toFixed(1)}, ${uiState.offset.y.toFixed(1)}`},
        {key: 'rate', value: uiState.rate2.toFixed(1)},
        {key: 'zoomStartRate', value: uiState.zoomStartRate.toFixed(1)},
        {key: 'currentDist', value: uiState.currentDist.toFixed(1)},
        {key: 'currentStartDist', value: uiState.currentStartDist.toFixed(1)},
        {key: 'shops', value: shops.length},
        {key: 'facilities', value: facilities.length},
      ])}
      <Transition in={facilityViewInProp} timeout={500}>
        {(state) => (
          <div className='fill-frame' style={transitionStyles[state]}>
            <div className='untouch-layer'></div>
            <div className='v-stack'>
              <div className="v-spacer" onClick={() => switchFacilityView()}>
                <div className='text-btn rb-btn'>とじる</div>
              </div>
              <div className='op-facility-view'>
                <div className='main'>
                  <div className='section-frame-mark c-shop'></div>
                  <h3>{selectedFacility.name}</h3>
                  <div className='section-frame'>
                    <p>
                      {selectedFacility.description}
                    </p>
                  </div>
                  <div className='section-frame'>
                    <ul className='contentList'>
                      { selectedFacility.contents.map((content) => {
                        return (
                          <li key={content.puid}>
                            <img src={Opu.ImgUrl(content.image_thumb)} alt={content.puid} onClick={() => selectedImage(content)}/>
                          </li>
                          );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='pageMenuSpacer'></div>
            </div>
          </div>
        )}
      </Transition>
      <Transition in={shopViewInProp} timeout={500}>
        {(state) => (
          <div className='fill-frame' style={transitionStyles[state]}>
            <div className='rel-layer'>
              <PageShopView shop={selectedShop} remove={switchShopView}/>
            </div>
          </div>
        )}
      </Transition>
      <Transition in={shopListInProp} timeout={500}>
        {(state) => (
          <div className='fill-frame' style={transitionStyles[state]}>
            <div className='v-stack'>
              <ShopList shops={shops} remove={setShopListInProp} selected={(puid) => selectedShopFromList(puid)} categories={selectedCategoryList}/>
              <div className='pageMenuSpacer'></div>
            </div>
          </div>
        )}
      </Transition>
      <Transition in={pageMenuInProp} timeout={500}>
        {(state) => (
          <div className='pageMenuFrame' style={menuTransitionStyles[state]}>
            <div className='menuFrame'>
              <div className='column'>
                <div className='home-btn'>
                  {Opu.VCIconPamphletHome()}
                  <Link to={Opu.InformationPath(informationId)}></Link>
                </div>
              </div>
              <div className='column'>
                <div className='filter'>
                  {filterBtnTag()}
                </div>
              </div>
              <div className='column' onClick={() => onClickListBtn()}>
                <div className={listBtnStyle}>
                  {shopListBtn()}
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
      <ContentView content={selectedContent} remove={selectedImage} />
      {indicatorTag}
    </div>
  );
};

export default withRouter(Page);