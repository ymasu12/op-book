import {useState, useEffect} from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

const EventList = (props) => {
  let informationId = props.match.params.informationId;
  const [information, setInformation] = useState({name: ''});
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [indicatorManager, setIndicator] = useState(false);

  // fetch
  useEffect(() => {
    setIndicator(true);
    Api.fetchInformationEvents(informationId, (res) => {
      const data = res.data.data;
      setEvents(data.events);
      setSchedules(data.schedules);
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
  }, [informationId]);
  
  var indicatorTag = indicatorManager ? <div class="loader"></div> : null;
  var breadcrumbTag = 
    <div id="breadcrumb" className='op-breadcrumb'>
      {Opu.VCBackLinkTab(props)}
      <ol className='l-breadcrumb'>
        <li><a href={Opu.TopPath()}>Top</a></li>
        <li><a href={Opu.InformationPath(informationId)}>{information.name}</a></li>
        <li>イベント一覧</li>
      </ol>
    </div>;
  
  var listTags = [];
  var current = {year: null, month: null, day: null, time: null};

  schedules.forEach((schedule) => {
    if (schedule.st_date.substr(0, 4) !== current.year) {
      current.year = schedule.st_date.substr(0, 4);
      current.month = null;
      current.day = null;
      current.time = null;
      listTags.push(<li className='label-year'>{current.year}年</li>);
    }
    if (schedule.st_date.substr(5, 2) !== current.month || schedule.st_date.substr(8, 2) !== current.day) {
      current.month = schedule.st_date.substr(5, 2);
      current.day = schedule.st_date.substr(8, 2);
      current.time = null;
      listTags.push(<li className='label-date'><span>{current.month}月{current.day}日</span></li>);
    }
    if (schedule.all_day === false && schedule.st_time !== current.time) {
      current.time = schedule.st_time;
      listTags.push(<li className='label-time'><span>{current.time}</span></li>);
    }
    for (var i = 0; i < events.length; i++) {
      if (events[i].puid === schedule.event_id) {
        listTags.push(
          <li className='row-content'>
            <div className='row-spacer'></div>
            <div className='row-event'>
              <img src={Opu.ImgUrl(events[i].icon_thumb)} alt={events[i].name}/>
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
  return (
    <div className='op-event-list'>
      {breadcrumbTag}
      <ul className='eventList'>
        {listTags}
      </ul>
      {indicatorTag}
    </div>
  );
};

export default withRouter(EventList);
