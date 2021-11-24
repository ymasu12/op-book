import {useState, useEffect} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import * as Api from '../OpApi';
import * as Opu from '../OpUtils';

const Pamphlet = (props) => {
  let informationId = props.match.params.informationId;
  const [information, setInformation] = useState();
  const [pages, setPages] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log('useEffect called.');
    Api.fetchInformation(informationId, (res) => {
      setInformation(res.data.data.information);
      setPages(res.data.data.information.pages);
      setEvents(res.data.data.events);
    }, (error) => {
      console.log('error');
    });
  }, [informationId]);

  if (information === null || information === undefined) {
    return <div className='op-pamphlet'><div className='main'></div></div>;
  }
  Opu.VCHideHeaderFooter();
  
  var breadcrumbTag = 
    <div id="breadcrumb" className='op-breadcrumb'>
      {Opu.VCBackLinkTab(props)}
      <ol className='l-breadcrumb'>
        <li><a href={Opu.TopPath()}>Top</a></li>
        <li>{information.name}</li>
      </ol>
    </div>;
  
  return (
    <div className='op-pamphlet'>
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Openパンフレット | ${information.name}`}</title>
        </Helmet>
      </HelmetProvider>
      {breadcrumbTag}
      <div className='main'>
        <img className='thumb' src={Opu.ImgUrl(information.icon)} alt={information.name}/>
        <h1>{information.name}</h1>
        <div className='section-frame'>
          <div className='section-title'>ページ</div>
          <ul className='pageList'>
            { pages.map((page) => {
                var pageList = 
                  <li key={page.puid}>
                    <img src={Opu.ImgUrl(page.image_thumb)} alt={page.name}/>
                    <div className='title'>{page.name}</div>
                    <Link to={Opu.PagePath(informationId, page.puid)}></Link>
                  </li>;
                return pageList;
              })
            }
          </ul>
        </div>
        <div className='section-frame'>
          <div className='section-title'>イベント</div>
          <ul className='eventList'>
            { events.map((event) => {
                var eventList =
                  <li key={event.puid}>
                    <img src={Opu.ImgUrl(event.icon_thumb)} alt={event.name}/>
                    <div className='title'>{event.name}</div>
                    <Link to={Opu.EventPath(event.puid)}>{event.name}</Link>
                  </li>;
                return eventList;
              })
            }
          </ul>
          <div className='showAll'>
            <Link to={Opu.InformationEventsPath(props.match.params.informationId)}>イベントをもっとみる</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Pamphlet);