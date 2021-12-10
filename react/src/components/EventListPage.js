import {useState, useEffect} from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';
import EventListView from './EventListView';

const EventListPage = (props) => {
  const [information, setInformation] = useState({name: ''});
  const location = useLocation();
  const history = useHistory();
  const { informationId } = useParams();
  let passed = new URLSearchParams(location.search).get('passed');

  // fetch
  useEffect(() => {
    Api.fetchInformation(informationId, (res) => {
      setInformation(res.data.data.information);
    });
  }, [informationId, passed]);
  
  const listHistory = () => {
    history.replace(Opu.InformationEventsPath(informationId, true));
  };
  var showPassedTag = null;
  if (passed !== '1') {
    showPassedTag = <div className='op-msg short'><button onClick={() => {listHistory()}}>過去のイベントを含める</button></div>;
  }
  
  var breadcrumbTag = 
    <div id="breadcrumb" className='op-breadcrumb'>
      {Opu.VCBackLinkTab(history)}
      <ol className='l-breadcrumb'>
        <li><a href={Opu.TopPath()}>Top</a></li>
        <li><a href={Opu.InformationPath(informationId)}>{information.name}</a></li>
        <li>イベント一覧</li>
      </ol>
    </div>;
  
  return (
    <div className='op-event-list'>
      {breadcrumbTag}
      {showPassedTag}
      <EventListView />
    </div>
  );
};

export default EventListPage;