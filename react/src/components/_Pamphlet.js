import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as Api from '../OpApi';
import * as Opu from '../OpUtils';

class Pamphlet extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      informationId: props.match.params.informationId,
      pages: [],
      events: [],
      shops: [],
      initialized: false,
    };
  }
  
  componentDidMount() {
    if (false === this.state.initialized) {
      Api.fetchInformation(this.state.informationId, (res) => {
        const data = res.data.data;
        this.setState({
          informationId: this.state.informationId,
          pages: data.information.pages,
          events: data.events,
          initialized: true
        });
      }, (error) => {
        alert("エラーです！");
      });
    }
    Opu.VCShowHeaderFooter();
  }
  
  render() {
    return (
      <div className='op-pamphlet'>
        <div className='main'>
          <p>Pamphlet!!</p>
          <Link to={Opu.TopPath()}>Back To Top.</Link><br/>
          <p>pages</p>
          <ul>
            {this.state.pages.map((page) => <li key={page.puid}><Link to={Opu.PagePath(this.state.informationId, page.puid)}>{page.name}</Link></li>)}
          </ul>
          <p>Events</p>
          <ul>
            {this.state.events.map((event) => <li key={event.puid}><Link to={Opu.InformationEventPath(this.state.informationId, event.puid)}>{event.name}</Link></li>)}
          </ul>
          <Link to={Opu.InformationShopPath(this.state.informationId, "dummy")}>shop.</Link><br/>
        </div>
      </div>
    );
  }
}

export default withRouter(Pamphlet);