import {useEffect} from 'react';
import * as Opu from '../OpUtils';

function ContentView(props) {
  const notScroll = (e) => e.preventDefault();
  useEffect(() => {
    if (props.content !== null && props.content !== undefined) {
      document.querySelector('.full-content-view').addEventListener('touchmove', notScroll, {passive: false});
      document.querySelector('.full-content-view').addEventListener('mousewheel', notScroll, {passive: false});
    }
  });
  var ret = null;
  if (props.content !== null && props.content !== undefined) {
    // style={{top: (window.pageYOffset - 50) + 'px'}}
    ret = 
      <div className='full-content-view' onClick={() => props.remove()}>
        <img src={Opu.ImgUrl(props.content.image)} alt={props.content.name}/>
      </div>;
  }
  return ret;
}

export default ContentView;