import React from 'react';
import { withRouter } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    var history = {offset: {x: 0, y: 0}, rate2: 1};
    if (props.location.state !== null && props.location.state !== undefined) {
      if (props.location.state.offset !== null && props.location.state.offset !== undefined) {
        history.offset = props.location.state.offset;
      }
      if (props.location.state.rate2 !== null && props.location.state.rate2 !== undefined) {
        history.rate2 = props.location.state.rate2;
      }
    }
    this.state = {
      shopId: props.match.params.shopId,
      informationId: props.match.params.informationId,
      pageId: props.match.params.pageId,
      history: history,
      shop: null,
    };
    this.backPage = this.backPage.bind(this);
  }
  componentDidMount() {
    Api.fetchShop(this.state.shopId, (res) => {
      const data = res.data.data;
      this.setState({
        shop: data.shop,
      });
    }, (error) => {
      console.log("shop fetch is erros.");
    });
  }
  backPage() {
    this.props.history.push({
      pathname: Opu.PagePath(this.state.informationId, this.state.pageId),
      state: this.state.history
    });
  }
  render() {
    var shopName = "", shopDescription = "";
    if (this.state.shop !== null && this.state.shop !== undefined) {
      shopName = this.state.shop.name;
      shopDescription = this.state.shop.description;
    }
    return (
      <div>
        Shop!!<br/>
          <div>
            {shopName}<br/>
            {shopDescription}<br/>
          </div>;
        <br/>
        <button onClick={this.backPage}>backuuuu</button>
      </div>
    );
  }
}

export default withRouter(Shop);