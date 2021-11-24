import {useState, useEffect} from 'react';
import * as Opu from '../OpUtils';

const ShopList = (props) => {
  const selected = (puid) => props.selected(puid);
  const [shops, setShops] = useState([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  
  useEffect(() => setShops(props.shops), [props.shops]);
  useEffect(() => setSelectedCategoryList(props.categories), [props.categories]);
  // const selectedCategory = (code) => {
  //   var newList = [];
  //   var fNotFound = true;
  //   for (var i = 0; i < selectedCategoryList.length; i++) {
  //     if (selectedCategoryList[i] === code) {
  //       // not contain new list.
  //       fNotFound = false;
  //     } else {
  //       newList.push(selectedCategoryList[i]);
  //     }
  //   }
  //   if (fNotFound) {
  //     newList.push(code);
  //   }
  //   setSelectedCategoryList(newList);
  // };
  // const categories = [
  //   {code: 'eat', name: '食事'},
  //   {code: 'shop', name: 'ショップ'},
  //   {code: 'service', name: 'サービス'},
  //   {code: 'entertainment', name: 'エンタメ'},
  //   {code: 'any', name: 'その他'},
  //   // {code: 'facility', name: '施設'},
  // ];
  // const filterBtn = (category) => {
  //   var filterBtnClass = 'item';
  //   selectedCategoryList.forEach((selectedCategory) => {
  //     if (selectedCategory === category.code) {
  //       filterBtnClass = 'item active';
  //     }
  //   });
  //   return (
  //     <div className={filterBtnClass} onClick={() => selectedCategory(category.code)}>
  //       {category.name}
  //     </div>
  //   );
  // };
  var categories = ['eat','shop','service','entertainment','any','facility'];
  if (selectedCategoryList.length !== 0) {
    categories = selectedCategoryList;
  }
  return (
    <div className='op-shop-list'>
      <div className='main'>
        {
          categories.map((category) => {
            var count = 0;
            var tag = 
              <ul className='shopList'>
                {shops.map((shop) => {
                  if (shop.category_code === category) {
                    count = count + 1;
                    var dTag = null;
                    if (!Opu.IsEmpty(shop.description)) {
                      dTag = <div className='description'>{shop.description}</div>;
                    }
                    return (
                      <li onClick={() => selected(shop.puid)} key={shop.puid}>
                        <img src={Opu.ImgUrl(shop.icon_thumb)} alt={shop.puid}/>
                        <div className='title'>{shop.name}</div>
                        {dTag}
                        <div className={`category ${shop.category_code}`}>{shop.category_name}</div>
                        <div className={`triangle ${shop.category_code}`}/>
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </ul>;
            return count !== 0 ? tag : null;
          })
        }
      </div>
    </div>
    );
};
export default ShopList;