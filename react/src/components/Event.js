import {useState, useEffect} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import * as Api from '../OpApi';
import * as Opu from '../OpUtils';
import ErrorView from './ErrorView';
import ContentView from './ContentView';

const Event = (props) => {
  const [eventId] = useState(props.match.params.eventId);
  const [event, setEvent] = useState({name: '', icon: '', contents: []});
  const [selectedContent, setSelectedContent] = useState();
  const [error, setError] = useState();
  const history = useHistory();
  
  // init get data.
  useEffect(() => {
    Api.fetchEvent(eventId, (res) => {
      setEvent(res.data.data.event);
    }, (error) => {
      setError(error);
    });
  }, [eventId]);
  
  if (event == null) {
    return (
      <div className='op-event'>
        <ErrorView error={error} />
        <div className='main'></div>
      </div>
    );
  }
  
  // methods.
  const subSectionClass = (src) => Opu.IsEmpty(src) ? 'sub-section-frame display-none' : 'sub-section-frame';
  const contentsSectionClass = () => event.contents.length === 0 ? 'section-frame display-none' : 'section-frame';
  const selectedImage = (content = null) => setSelectedContent(content);
  
  return (
    <div className='op-event'>
      <HelmetProvider>
        <Helmet>
          <title>{`${event.name} | Openパンフレット`}</title>
          <meta name="description" content={`${event.name} | ${Opu.MetaDescriptionStr(event.description)}`} />
        </Helmet>
      </HelmetProvider>
      <div id="breadcrumb" className='op-breadcrumb'>
        {Opu.VCBackLinkTab(history)}
        <ol className='l-breadcrumb'>
          <li>{event.name}</li>
        </ol>
      </div>
      <div className='main'>
        <h1>{event.name}</h1>
        <img className='thumb' src={Opu.ImgUrl(event.icon)} alt={event.name}/>
        <div className='section-frame'>
          <div className='section-title'>説明</div>
          <div className='info'>
            {event.description}
          </div>
        </div>
        <div className={contentsSectionClass()}>
          <div className='section-title'>画像</div>
          <ul className='contentList'>
            { event.contents.map((content) => {
                var contentList =
                  <li key={content.puid}>
                    <img src={Opu.ImgUrl(content.image_thumb)} alt={content.name} onClick={() => selectedImage(content)}/>
                    <div className='title'>{content.title}</div>
                  </li>;
                return contentList;
            }) }
          </ul>
        </div>
        <div className='section-frame'>
          <div className='section-title'>情報</div>
          <div className={subSectionClass(event.schedule)}>
            <div className='sub-section-title'><span>スケジュール</span></div>
            <div className='info'>
              {event.schedule}
            </div>
          </div>
          <div className={subSectionClass(event.entry_criteria)}>
            <div className='sub-section-title'><span>参加資格</span></div>
            <div className='info'>
              {event.entry_criteria}
            </div>
          </div>
          <div className={subSectionClass(event.access_guide)}>
            <div className='sub-section-title'><span>アクセス</span></div>
            <div className='info'>
              {event.access_guide}
            </div>
          </div>
          <div className={subSectionClass(event.organizer)}>
            <div className='sub-section-title'><span>主催</span></div>
            <div className='info'>
              {event.organizer}
            </div>
          </div>
          <div className={subSectionClass(event.tel)}>
            <div className='sub-section-title'><span>TEL</span></div>
            <div className='info tel'>
              {event.tel}
            </div>
          </div>
          <div className={subSectionClass(Opu.buildAddress(event))}>
            <div className='sub-section-title'><span>場所</span></div>
            <div className='info address'>
              {Opu.buildAddress(event)}
            </div>
          </div>
        </div>
      </div>
      <ContentView content={selectedContent} remove={selectedImage} />
    </div>
  );
};

export default withRouter(Event);