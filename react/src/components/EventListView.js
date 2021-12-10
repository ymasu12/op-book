import {useState, useEffect} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

const EventListView = (props) => {
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [indicatorManager, setIndicator] = useState(false);
  const location = useLocation();
  const { informationId } = useParams();
  let passed = new URLSearchParams(location.search).get('passed');

  // fetch
  useEffect(() => {
    setIndicator(true);
    var after = 0;
    if (passed !== '1') {
      after = Date.now() - 3600000;
    }
    Api.fetchInformationEvents(informationId, after, 10, 0, (res) => {
      const data = res.data.data;
      setEvents(data.events);
      setSchedules(data.schedules);
    }, null, () => {
      setIndicator(false);
    });
  }, [informationId, passed]);
  
  var indicatorTag = indicatorManager ? <div className="loader"></div> : null;
  
  var listTags = [];
  var current = {year: null, month: null, day: null, time: null};
  
  schedules.forEach((schedule) => {
    if (schedule.st_date.substr(0, 4) !== current.year) {
      current.year = schedule.st_date.substr(0, 4);
      current.month = null;
      current.day = null;
      current.time = null;
      listTags.push(<li className='label-year' key={`${schedule.puid}-${current.year}`}><div className='row-spacer'></div>{current.year}年</li>);
    }
    if (schedule.st_date.substr(5, 2) !== current.month || schedule.st_date.substr(8, 2) !== current.day) {
      current.month = schedule.st_date.substr(5, 2);
      current.day = schedule.st_date.substr(8, 2);
      current.time = null;
      listTags.push(<li className='label-date' key={`${schedule.puid}-${current.month}-${current.day}`}><div className='row-spacer'></div><span>{current.month}月{current.day}日</span></li>);
    }
    if (schedule.all_day === false && schedule.st_time !== current.time) {
      current.time = schedule.st_time;
      listTags.push(<li className='label-time' key={`${schedule.puid}-${current.time}`}><div className='row-spacer'></div><span>{current.time}</span></li>);
    }
    for (var i = 0; i < events.length; i++) {
      if (events[i].puid === schedule.event_id) {
        listTags.push(
          <li className='row-content' key={`${events[i].puid}_${schedule.puid}`}>
            <div className='row-spacer'></div>
            <div className='row-event'>
              <img src={Opu.ImgUrl(events[i].icon_thumb)} alt={events[i].name} loading='lazy'/>
              <div className='info'>
                <div className='title'>{events[i].name}</div>
                <div className='owner'>
                  {Opu.VCIconOwner()}
                  {events[i].user_name}
                </div>
                <div className='views'>
                  {Opu.VCIconView()}
                  {events[i].access_total}
                </div>
              </div>
              <Link to={Opu.EventPath(events[i].puid)}></Link>
            </div>
          </li>
        );
        break;
      }
    }
  });
  if (listTags.length === 0) {
    listTags = <div className='op-msg short'>イベントは見つかりませんでした。</div>;
  }
  return (
    <div className='op-event-list'>
      <ul className='eventList'>
        {listTags}
      </ul>
      {indicatorTag}
    </div>
  );
};

export default EventListView;
