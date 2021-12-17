import {useState, useEffect, useRef} from 'react';
import { Link, useLocation, useParams, useHistory } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

const EventListView = (props) => {
  const [schedules, setSchedules] = useState([]);
  const [indicatorManager, setIndicator] = useState(false);
  const [total, setTotal] = useState();
  const location = useLocation();
  const history = useHistory();
  const { informationId } = useParams();
  let isPamphletPage = props.isPamphletPage;
  let passed = new URLSearchParams(location.search).get('passed');
  let next = new URLSearchParams(location.search).get('next');
  
  const schedulesRef = useRef(null);
  schedulesRef.current = schedules;
  
  // fetch
  useEffect(() => {
    setIndicator(true);
    var to = Math.floor(Date.now() / 1000) + 3600000 * 365; // one year later.
    var from = Math.floor(Date.now() / 1000) - 3600000;
    if (passed === '1') {
      from = null;
    }
    var offset = 0;
    if (next != null) {
      offset = schedulesRef.current.length;
    }
    Api.fetchInformationEventSchedules(informationId, 10, offset, from, to, (res) => {
      const data = res.data.data;
      if (next != null) {
        var tmpSchedules = [];
        schedulesRef.current.forEach((schedule) => {
          tmpSchedules.push(schedule);
        });
        data.schedules.forEach((schedule) => {
          tmpSchedules.push(schedule);
        });
        setSchedules(tmpSchedules);
      } else {
        setSchedules(data.schedules);
      }
      setTotal(data.total);
    }, null, () => {
      setIndicator(false);
    });
  }, [informationId, passed, next, schedulesRef]);
  
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
    listTags.push(
      <li className='row-content' key={`${schedule.event.puid}_${schedule.puid}`}>
        <div className='row-spacer'></div>
        <div className='row-event'>
          <img src={Opu.ImgUrl(schedule.event.icon_thumb)} alt={schedule.event.name} loading='lazy'/>
          <div className='info'>
            <div className='title'>{schedule.event.name}</div>
            <div className='owner'>
              {Opu.VCIconOwner()}
              {schedule.event.user_name}
            </div>
            <div className='views'>
              {Opu.VCIconView()}
              {schedule.event.access_total}
            </div>
          </div>
          <Link to={Opu.EventPath(schedule.event.puid)}></Link>
        </div>
      </li>
    );
  });
  if (listTags.length === 0) {
    listTags = <div className='op-msg short'>イベントは見つかりませんでした。</div>;
  }
  var nextTag = null;
  if (isPamphletPage != null) {
  } else {
    if (schedules.length < total) {
      nextTag = <div className='btns btns-ct'><button className='next' onClick={() => nextClick()}>さらに表示する</button></div>;
    } else {
      nextTag = <div className='btns btns-ct'><button className='next' >End</button></div>;
    }
  }
  const nextClick = () => {
    var length = schedules.length || 0;
    history.replace(Opu.InformationEventsPath(informationId, true) + `&next=${length}`);
  };
  return (
    <div className='op-event-list'>
      <ul className='eventList'>
        {listTags}
      </ul>
      {nextTag}
      {indicatorTag}
    </div>
  );
};

export default EventListView;
