import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as Opu from './OpUtils';

import logo from './logo.svg';
import './App.scss';
import './components/Op.scss';

// import {useWindowDimensions} from './window';
import Top from './components/Top';
import Search from './components/Search';
import Pamphlet from './components/Pamphlet';
import Page from './components/Page';
import Shop from './components/Shop';
import Event from './components/Event';
import EventList from './components/EventList';

function App() {
  // const { width, height } = useWindowDimensions();
  setTimeout(() => {onClickDemoClose()} ,6000);
  const onClickDemoClose = () => {
    if (document.getElementById('demo-msg')) {
      document.getElementById('demo-msg').style.display = 'none';
    }
  };
  return (
    <div className="App">
      <div id='ap-app-is-debug-' />
      <header>
        <div className='op-header'>
          <div className='h-left'></div>
          <div className='h-center'>
            <a href={Opu.TopPath()}>
              <img className="logo" alt="OpenPamphletLogo" src={logo} />
            </a>
          </div>
          <div className='h-right'></div>
        </div>
      </header>
      <div className='op-container min-h'>
        <BrowserRouter>
          <Switch>
            <Route exact path={Opu.TopPath()} component={Top} />
            <Route exact path={Opu.SearchPath()} component={Search} />
            <Route exact path={Opu.InformationPath(':informationId')} component={Pamphlet} />
            <Route exact path={Opu.ShopPath(':shopId')} component={Shop} />
            <Route exact path={Opu.EventPath(':eventId')} component={Event} />
            <Route
              path={Opu.InformationPath(':informationId')}
              render={({ match: { url } }) => (
                <Switch>
                  <Route exact path={url} component={Pamphlet} />
                  <Route path={Opu.InformationShopsPath(':informationId')} component={Shop} />
                  <Route path={Opu.InformationEventsPath(':informationId')} component={EventList} />
                  <Route exact path={Opu.PagePath(':informationId', ':pageId')} >
                    <Page/>
                  </Route>
                  <Route
                    path={Opu.PagePath(':informationId', ':pageId')}
                    render={({ match: { url } }) => (
                      <Switch>
                        <Route exact path={url} component={Page} />
                        <Route path={Opu.PageShopPath(':informationId', ':pageId', ':shopId')}>
                          <Shop/>
                        </Route>
                      </Switch>
                    )}
                  />
                </Switch>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
      <footer>
        <ul>
          <li></li>
        </ul>
        <div className='footer_copyright'>Copyright© 2020-2021 Penguin-system.</div>
      </footer>
      <div id='demo-msg'>
        <p>Openパンフレットをご利用いただきありがとうございます。</p>
        <p>この機能はデモ版のため機能保証はございません。</p>
        <p>正式リリースをお待ち下さい。</p>
        <p className='close-btn' onClick={() => onClickDemoClose()}>OK</p>
      </div>
    </div>
  );
}

export default App;