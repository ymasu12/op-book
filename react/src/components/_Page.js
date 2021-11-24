import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';
// import Shop from './Shop';
import PageShopView from './PageShopView';

import './Op.scss';

class Page extends React.Component {
  /** 
   * Constructor
   */
  constructor(props) {
    super(props);
    var offset = {x: 0, y: 0};
    var rate = 1;
    if (props.location.state !== null && props.location.state !== undefined) {
      if (props.location.state.offset !== null && props.location.state.offset !== undefined) {
        offset = props.location.state.offset;
      }
      if (props.location.state.rate2 !== null && props.location.state.rate2 !== undefined) {
        rate = props.location.state.rate2;
      }
    }
    this.state = {
      informationId: props.match.params.informationId,
      pageId: props.match.params.pageId,
      page: null,
      shops: [],
      facilities: [],
      initialized: false,
      width: window.innerWidth,
      height: window.innerHeight,
      touchState: 'none',
      offset: offset,
      initOfs: { x: 0, y: 0, },
      prevTouches: [],
      currentDist: 0,
      currentStartDist: 0,
      initRate: 1,
      rate2: rate,
      zoomStartRate: 1,
      zoomStartOfs: {x: 0, y: 0},
      selectedShop: null,
      selectedFacility: null,
      showShopView: false,
      showShopPreView: false,
      showFacilityPreView: false,
      showIndicator: false, 
    };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleSelectedShop = this.handleSelectedShop.bind(this);
    this.handleSelectedFacility = this.handleSelectedFacility.bind(this);
    this.setInitOfs = this.setInitOfs.bind(this);
    this.allReset = this.allReset.bind(this);
    this.showShopPage = this.showShopPage.bind(this);
    this.switchShopView = this.switchShopView.bind(this);
  }
  
  componentDidMount() {
    Api.fetchPage(this.state.informationId, this.state.pageId, (res) => {
      const data = res.data.data;
      this.setState({
        page: data.page,
        shops: data.shops,
        facilities: data.facilities,
        initialized: true
      });
      this.setInitOfs();
    }, (error) => {
      alert("エラーです！");
    });
    document.querySelector('.op-page .canvas').addEventListener('touchstart', (e) => this.handleTouchStart(e));
    document.querySelector('.op-page .canvas').addEventListener('touchend', (e) => this.handleTouchEnd(e));
    document.querySelector('.op-page .canvas').addEventListener('touchmove', (e) => this.handleMouseMove(e));
    Opu.VCHideHeaderFooter();
  }
  
  handleMouseDown() {
    console.log("onMouseDown");
  }
  /** 
   * Handler [touchmove]
   */
  handleMouseMove(event) {
    Opu.DebugViewUpdate('mousMove-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    event.preventDefault();
    var newTouches = [];
    for (var i = 0; i < this.state.prevTouches.length; i++) {
      var e = 0;
      for (; e < event.changedTouches.length; e++) {
        if (event.changedTouches[e].identifier === this.state.prevTouches[i].id) {
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
          id: this.state.prevTouches[i].id,
          x: this.state.prevTouches[i].x,
          y: this.state.prevTouches[i].y,
        });
      }
    }
    if (this.state.touchState === 'move') {
      if (event.changedTouches.length === 1) {
        var dfx = 0, dfy = 0;
        for (var u = 0; u < this.state.prevTouches.length; u++) {
          if (event.changedTouches[0].identifier === this.state.prevTouches[u].id) {
            dfx = event.changedTouches[0].clientX - this.state.prevTouches[u].x;
            dfy = event.changedTouches[0].clientY - this.state.prevTouches[u].y;
            break;
          }
        }
        this.setState({
          offset: {
            x: this.state.offset.x + dfx,
            y: this.state.offset.y + dfy,
          },
          prevTouches: newTouches,
        });
      }
    } else if (this.state.touchState === 'zoom') {
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
        var gx = this.state.zoomStartOfs.x;
        var gy = this.state.zoomStartOfs.y;
        var zw = qx - gx;
        var zh = qy - gy;
        var oRate = this.state.currentDist / this.state.currentStartDist;
        var cw = qx - (zw * oRate);
        var ch = qy - (zh * oRate);
        var newRate = this.state.zoomStartRate * oRate;
        var rateDiff = newRate - this.state.rate2;

        Opu.DebugViewUpdate('output6', `q:(${qx.toFixed(2)}, ${qy.toFixed(2)})  diff:(${zw.toFixed(2)}, ${zh.toFixed(2)}  last:(${cw.toFixed(2)}, ${ch.toFixed(2)})`);
        Opu.DebugViewUpdate('output7', `zoom (new):${newRate.toFixed(3)} (old):${this.state.rate2.toFixed(3)} (diff):${rateDiff.toFixed(5)}`);
        
        this.setState({
          currentDist: dist1 + dist2,
          rate2: newRate,
          offset: {
            x: cw,
            y: ch,
          },
          prevTouches: newTouches,
        });
      }
    }
  }
  /** 
   * Handler [touchstart]
   */
  handleTouchStart(event) {
    Opu.DebugViewUpdate('touchStart-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    let dist;
    if (event.touches.length === 2) {
      var dist1 = event.touches[0].clientX - event.touches[1].clientX;
      var dist2 = event.touches[0].clientY - event.touches[1].clientY;
      dist1 = 0 < dist1 ? dist1 : -dist1;
      dist2 = 0 < dist2 ? dist2 : -dist2;
      dist = dist1 + dist2;
    }
    if ((this.state.touchState === 'none' || this.state.touchState === 'move') && event.touches.length === 1) {
      var prev = this.state.prevTouches;
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
      this.setState({
        touchState: 'move',
        prevTouches: prev
      });
    } else if ((this.state.touchState === 'none' || this.state.touchState === 'move') && event.touches.length === 2) {
      var prev2 = [];
      for (var e = 0; e < event.touches.length; e++) {
        prev2.push({
          id: event.touches[e].identifier,
          x: event.touches[e].clientX,
          y: event.touches[e].clientY,
        });
      }
      this.setState({
        touchState: 'zoom',
        currentStartDist: dist,
        zoomStartOfs: {x: this.state.offset.x, y: this.state.offset.y},
        zoomStartRate: this.state.rate2,
        prevTouches: prev2,
      });
    }
  }
  /** 
   * Handler [touchend]
   */
  handleTouchEnd(event) {
    Opu.DebugViewUpdate('touchEnd-touchies', `change:${event.changedTouches.length} target:${event.targetTouches.length} all:${event.touches.length}`);
    var prev = [];
    for (var i = 0; i < this.state.prevTouches.length; i++) {
      var remove = false;
      for (var e = 0; e < event.changedTouches.length; e++) {
        if (event.changedTouches[e].identifier === this.state.prevTouches[i].id) {
          remove = true;
          break;
        }
      }
      if (!remove) {
        prev.push(this.state.prevTouches[i]);
      }
    }
    var state = 'none';
    if (this.state.touchState === 'zoom') {
      if (event.touches.length === 1) {
        state = 'move';
      }
    }
    this.setState({
      touchState: state,
      prevTouches: prev,
    });
    // this.props.history.push(this.state);
  }
  handleSelectedShop(event) {
    this.switchShopView(event.target.dataset.shopId);
  }
  handleSelectedFacility(event) {
    this.switchFacilityView(event.target.dataset.facilityId);
  }
  allReset() {
    this.setState({rate2: 1, offset: {x: 0, y: 0}});
  }
  setInitOfs() {
    if (this.state.page == null || this.state.page === undefined) {
      return;
    }
    var wr = parseFloat(this.state.width) / parseFloat(this.state.page.canvas_column);
    var hr = parseFloat(this.state.height) / parseFloat(this.state.page.canvas_row);
    var x = 0, y = 0, rate = 1;
    if (wr < hr) {
      y = (parseFloat(this.state.height) - parseFloat(this.state.page.canvas_row) * wr) / 2;
      rate = wr;
    } else {
      x = (parseFloat(this.state.width) - parseFloat(this.state.page.canvas_column) * hr) / 2;
      rate = hr;
    }
    this.setState(
      {
        initOfs: {
          x: x,
          y: y,
        },
        initRate: rate,
      });
  }
  showShopPage(shopId) {
    // this.props.history.push({
    //   pathname: Opu.PageShopPath(this.state.informationId, this.state.pageId, shopId),
    //   state: {
    //     offset: this.state.offset,
    //     rate2: this.state.rate2,
    //   }
    // });
  }
  switchShopView(shopId) {
    if (shopId !== null && shopId !== undefined) {
      for (var i = 0; i < this.state.shops.length; i++) {
        if (this.state.shops[i].puid === shopId) {
          this.setState({
            selectedShop: this.state.shops[i],
            selectedFacility: null,
            showShopView: true,
            showShopPreView: false,
            showFacilityPreView: false,
          });
          break;
        }
      }
    } else {
      this.setState({
        selectedShop: null,
        selectedFacility: null,
        showShopView: false,
        showShopPreView: false,
        showFacilityPreView: false,
      });
    }
  }
  switchFacilityView(facilityId) {
    if (facilityId !== null && facilityId !== undefined) {
      for (var i = 0; i < this.state.facilities.length; i++) {
        if (this.state.facilities[i].puid === facilityId) {
          this.setState({
            selectedShop: null,
            selectedFacility: this.state.facilities[i],
            showShopView: false,
            showShopPreView: false,
            showFacilityPreView: true,
          });
          break;
        }
      }
    } else {
      this.setState({
        selectedShop: null,
        selectedFacility: null,
        showShopView: false,
        showShopPreView: false,
        showFacilityPreView: false,
      });
    }
  }
  render() {
    var imgTag = <p>no image</p>;
    if (this.state.page != null && this.state.page !== undefined) {
      var imgfStyle = {
        top: this.state.initOfs.y,
        left: this.state.initOfs.x,
        transform: `translate(${this.state.offset.x}px, ${this.state.offset.y}px)`
      };
      var imgStyle = {
        width: `${this.state.page.canvas_column * this.state.initRate * this.state.rate2}px`,
        height: `${this.state.page.canvas_row * this.state.initRate * this.state.rate2}px`
      };
      imgTag = 
        <div className="image" style={imgfStyle}>
          <img src={Opu.ImgUrl(this.state.page.image)} alt={this.state.page.name} style={imgStyle}/>
        </div>;
    }
    // shop icons.
    var shops = this.state.shops.map((shop) => {
      let aStyle = {
          top: this.state.initOfs.y + shop.y * this.state.initRate * this.state.rate2,
          left: this.state.initOfs.x + shop.x * this.state.initRate * this.state.rate2,
          transform: `translate(${this.state.offset.x}px, ${this.state.offset.y}px)`
        };
      let imgStyle = {
          width: 32 * this.state.initRate * this.state.rate2,
          height: 32 * this.state.initRate * this.state.rate2,
          transform: `translate(-50%, -50%)`,
        };
      let shopMiconTag = 
        <div className="shop" style={aStyle} key={shop.puid}>
          <img className="icon" src={Opu.MiconUrl(shop.micon_code)} style={imgStyle} alt={shop.name} onClick={this.handleSelectedShop} data-shop-id={shop.puid}/>
        </div>;
      return shopMiconTag;
    });
    // facility icons.
    var facitlies = this.state.facilities.map((facility) => {
      let aStyle = {
          top: this.state.initOfs.y + facility.y * this.state.initRate * this.state.rate2,
          left: this.state.initOfs.x + facility.x * this.state.initRate * this.state.rate2,
          transform: `translate(${this.state.offset.x}px, ${this.state.offset.y}px)`
        };
      let imgStyle = {
          width: 32 * this.state.initRate * this.state.rate2,
          height: 32 * this.state.initRate * this.state.rate2,
          transform: `translate(-50%, -50%)`,
        };
      let FacilityMiconTag = 
        <div className="facility" style={aStyle} key={facility.puid}>
          <img className="icon" src={Opu.MiconUrl(facility.micon_code)} style={imgStyle} alt={facility.name} onClick={this.handleSelectedFacility} data-facility-id={facility.puid}/>
        </div>;
      return FacilityMiconTag;
    });
    var canvasStyle = {
      width: this.state.width != null ? this.state.width : "100vh",
      height: this.state.height != null ? this.state.height : "100vh"
    };
    // shop preview block.
    var shopPreviewTag = null;
    if (this.state.showShopPreView === true) {
      shopPreviewTag = 
        <div className="shopPreview">
          <div className="card">
            <div className='title'>
              {this.state.selectedShop.name}
            </div>
            <div className='discription'>
              {this.state.selectedShop.description}
            </div>
            <Link className='closeBtn' to={Opu.PageShopPath(this.state.informationId, this.state.pageId, this.state.selectedShop.puid)}>GO!</Link>
            <button onClick={() => this.showShopPage(this.state.selectedShop.puid)}>lllllllllll</button>
          </div>
        </div>;
    }
    // facility preview block.
    var facilityPreview = null;
    if (this.state.showFacilityPreView === true) {
      facilityPreview = 
        <div className="facilityPreview">
          <div className="card">
            <div className='title'>
              {this.state.selectedFacility.name}
            </div>
            <div className='discription'>
              {this.state.selectedFacility.description}
            </div>
          </div>
        </div>;
    }
    var shopViewTag = null;
    if (this.state.showShopView === true) {
      shopViewTag = 
        <div className="shopViewFrame">
          <div className="close-area" onClick={() => this.switchShopView()}></div>
          <PageShopView shopId={this.state.selectedShop.puid} shop={this.state.selectedShop} remove={this.switchShopView}/>
        </div>;
    }
    return (
      <div className='op-page'>
        <div className='canvas-ab'>
          <div className='canvas' style={canvasStyle}>
            {imgTag}
            {shops}
            {facitlies}
            <button onClick={this.allReset}>ALL RESET</button>
          </div>
          <Link className='circle-btn rt-btn-fix' to={Opu.InformationPath(this.state.informationId)}>
            {Opu.VCIconClose()}
          </Link>
        </div>
        {Opu.DebugView([
          {key: 'state', value: this.state.touchState},
          {key: 'offset', value: `${this.state.offset.x.toFixed(1)}, ${this.state.offset.y.toFixed(1)}`},
          {key: 'rate', value: this.state.rate2.toFixed(1)},
          {key: 'zoomStartRate', value: this.state.zoomStartRate.toFixed(1)},
          {key: 'currentDist', value: this.state.currentDist.toFixed(1)},
          {key: 'currentStartDist', value: this.state.currentStartDist.toFixed(1)},
          {key: 'shops', value: this.state.shops.length},
          {key: 'facilities', value: this.state.facilities.length},
        ])}
        {facilityPreview}
        {shopPreviewTag}
        {shopViewTag}
      </div>
    );
  }
}

export default withRouter(Page);