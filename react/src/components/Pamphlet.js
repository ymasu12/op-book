import {useState, useEffect} from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import * as Api from '../OpApi';
import * as Opu from '../OpUtils';
import ErrorView from './ErrorView';
import EventListView from './EventListView';

const Pamphlet = (props) => {
  let informationId = props.match.params.informationId;
  let history = useHistory();
  const [information, setInformation] = useState();
  const [pages, setPages] = useState([]);
  const [indicatorManager, setIndicator] = useState(false);
  const [error, setError] = useState();
  
  useEffect(() => {
    setIndicator(true);
    Api.fetchInformation(informationId, (res) => {
      setInformation(res.data.data.information);
      setPages(res.data.data.information.pages);
    }, (error) => {
      setError(error);
    }, () => {
      setIndicator(false);
    });
  }, [informationId]);
  
  if (information == null) {
    return (
      <div className='op-pamphlet'>
        <ErrorView error={error} />
        <div className='main'></div>
      </div>
    );
  }
  var indicatorTag = indicatorManager ? <div className="loader"></div> : null;
  Opu.VCHideHeaderFooter();
  
  var breadcrumbTag = 
    <div id="breadcrumb" className='op-breadcrumb'>
      {Opu.VCBackLinkTab(history)}
      <ol className='l-breadcrumb'>
        <li><a href={Opu.TopPath()}>Top</a></li>
        <li>{information.name}</li>
      </ol>
    </div>;
  
  return (
    <div className='op-pamphlet'>
      <HelmetProvider>
        <Helmet>
          <title>{`${information.name} | Openパンフレット`}</title>
          <meta name="description" content={`${Opu.MetaDescriptionStr(information.description)}`} />
        </Helmet>
      </HelmetProvider>
      {breadcrumbTag}
      <div className='main'>
        <img className='thumb' src={Opu.ImgUrl(information.icon)} alt={information.name}/>
        <h1>{information.name}</h1>
        <section className='section-frame'>
          <div className='info'>
            {information.description}
          </div>
        </section>
        <section className='section-frame'>
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
        </section>
        <section className='section-frame'>
          <div className='section-title'>イベント</div>
          <EventListView />
          <div className='showAll'>
            <Link to={Opu.InformationEventsPath(props.match.params.informationId)}>一覧でみる</Link>
          </div>
        </section>
        {indicatorTag}
      </div>
    </div>
  );
};
          // <ul className='hEventList'>
          //   { events.map((event) => {
          //       var eventList =
          //         <li key={event.puid}>
          //           <img src={Opu.ImgUrl(event.icon_thumb)} alt={event.name} loading='lazy'/>
          //           <div className='title'>{event.name}</div>
          //           <Link to={Opu.EventPath(event.puid)}>{event.name}</Link>
          //         </li>;
          //       return eventList;
          //     })
          //   }
          // </ul>

export default withRouter(Pamphlet);