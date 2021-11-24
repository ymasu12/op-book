import {useState, useEffect} from 'react';
// import * as Api from '../OpApi';
import * as Opu from '../OpUtils';
import ContentView from './ContentView';

const PageShopView = (props) => {
  const [shop, setShop] = useState();
  const [selectedContent, setSelectedContent] = useState();
  
  useEffect(() => setShop(props.shop), [props.shop]);
  if (shop === null || shop === undefined) {
    return <div className='op-shop-view'><div className='main'></div></div>;
  }
  // const [step, setStep] = useState(1);
  // const stepRef = useRef(null);

  // useEffect(() => {
  //   window.history.pushState(null, null, null);
  //   stepRef.current = step;
  //   window.addEventListener('popstate', overridePopstate, false);
  //   return () => window.removeEventListener('popstate', overridePopstate, false);
  // }, []);

  // useEffect(() => {
  //   stepRef.current = step;
  // }, [step]);

  // const overridePopstate = () => {
  //   if (stepRef.current === 2) {
  //     window.history.pushState(null, null, null);
  //     setStep(1);
  //   } else {
  //     window.history.back();
  //   }
  // };
  
  // init get data.
  // useEffect(() => {
  //   Api.fetchShop(shopId, (res) => {
  //     const data = res.data.data;
  //     setShop(data.shop);
  //   }, (error) => {
  //     console.log('error');
  //   });
  // }, [shopId]);
  const descriptionSectionClass = () => shop.description === null || shop.description === undefined || shop.description.length === 0 ? 'section-frame display-none' : 'section-frame';
  const contentsSectionClass = () => shop.contents.length === 0 ? 'section-frame display-none' : 'section-frame';
  const addressSectionClass = () => (Opu.IsEmpty(Opu.buildAddress(shop))) ? 'section-frame display-none' : 'section-frame';
  const functionsSectionClass = () => shop.functions.length === 0 ? 'section-frame display-none' : 'section-frame';
  const selectedImage = (content = null) => setSelectedContent(content);
  var closeBtn = <div className='text-btn rb-btn' onClick={() => props.remove()}>とじる</div>;
  if (selectedContent !== null && selectedContent !== undefined) {
    closeBtn = null;
  }

  return (
    <div className='op-shop-view'>
      <div className='main'>
        <div className='section-frame-mark c-shop'></div>
        <h1>{shop.name}</h1>
        <img className='thumb' src={Opu.ImgUrl(shop.icon)} alt={shop.name}/>
        <div className={descriptionSectionClass()}>
          <div className='section-title'>内容</div>
          <p>
            {shop.description}
          </p>
        </div>
        <div className={contentsSectionClass()}>
          <div className='section-title'>画像</div>
          <ul className='contentList'>
            { shop.contents.map((content) => {
              return (
                <li key={content.puid}>
                  <img src={Opu.ImgUrl(content.image_thumb)} alt={content.name} onClick={() => selectedImage(content)}/>
                  <div className='title'>{content.title}</div>
                </li>
                );
            })}
          </ul>
        </div>
        <div className={functionsSectionClass()}>
          <div className='section-title'>機能</div>
            { Opu.shopFuncTag(shop) }
        </div>
        <div className={addressSectionClass()}>
          <div className='section-title'>場所</div>
          <p className='info address'>
            {Opu.buildAddress(shop)}
          </p>
        </div>
      </div>
      <ContentView content={selectedContent} remove={selectedImage} />
      {closeBtn}
    </div>
  );
};

export default PageShopView;