import {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import * as Opu from '../OpUtils';
import ContentView from './ContentView';

const EventView = (props) => {
  const [event, setEvent] = useState();
  const [selectedContent, setSelectedContent] = useState();
  
  useEffect(() => setEvent(props.event), [props.event]);
  if (event == null) {
    return <div className='op-event'><div className='main'></div></div>;
  }

  // methods.
  const subSectionClass = (src) => Opu.IsEmpty(src) ? 'sub-section-frame display-none' : 'sub-section-frame';
  const contentsSectionClass = () => event.contents.length === 0 ? 'section-frame display-none' : 'section-frame';
  const selectedImage = (content = null) => setSelectedContent(content);
  
  return (
    <div className='op-event'>
      <div className='main'>
        <h1>{event.name}</h1>
        <img className='thumb' src={Opu.ImgUrl(event.icon)} alt={event.name}/>
        <div className='section-frame'>
          <div className='section-title'>説明</div>
          <div className='description'>
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

export default withRouter(EventView);