import { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

const Search = (props) => {
  const [ pamphlets, setPamphlets] = useState([]);
  const [ keywordText, setKeywordText ] = useState();
  const [ errorMsg, setErrorMsg ] = useState();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { search } = useLocation();
  const history = useHistory();

  const onSubmit = () => {
    history.replace(`/search?keyword=${watch('keyword')}`);
  };
  
  const doSearch = (keyword) => {
    Api.fetchSearch(keyword, (res) => {
      if (res.data.data != null) {
        if (res.data.data.informations != null) {
          setPamphlets(res.data.data.informations);
        } else {
          setPamphlets([]);
        }
      } else {
        setPamphlets([]);
      }
    }, (error) => {
      setPamphlets([]);
      setErrorMsg(error.message || "unknown error.");
    });
  };
  
  useEffect(() => {
    let val = new URLSearchParams(search).get('keyword');
    if (Opu.IsEmpty(val)) {
      console.warn('キーワードを入力してください。');
    } else {
      setKeywordText(val);
      doSearch(val);
    }
  }, [search]);
  
  var isEmptyTag = null;
  var errorMsgTag = null;
  if (!Opu.IsEmpty(errorMsg)) {
    errorMsgTag = <p><span className='message'>エラーが発生しました。</span><br/><span className='error'>{errorMsg}</span></p>;
  } else {
    if (pamphlets.length === 0) {
      isEmptyTag = <div>検索結果0件</div>;
    }
  }

  Opu.VCShowHeaderFooter();

  return (
    <div className='op-search'>
      <div id="breadcrumb" className='op-breadcrumb'>
        <ol className='l-breadcrumb'>
          <li><a href={Opu.TopPath()}>Top</a></li>
          <li>検索</li>
        </ol>
      </div>
      <div className='search-frame'>
        <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
          <input type='text' defaultValue={keywordText} {...register("keyword", { required: true })} placeholder='キーワード' />
          <input type="submit" value="検索"/>
          {errors.keyword && <span className='error'>キーワードを入力してください。</span>}
          {errorMsgTag}
        </form>
      </div>
      {isEmptyTag}
      <ul className='informationList'>
        { pamphlets.map(information => {
            var tag =
              <li key={information.puid}>
                <img src={Opu.ImgUrl(information.icon_thumb)} alt={information.name} loading='lazy'/>
                <div className='info'>
                  <div className='category'>{information.category_name}</div>
                  <div className='title'>{information.name}</div>
                  <div className='owner'>
                    {Opu.VCIconOwner()}
                    {information.user_name}
                  </div>
                  <div className='views'>
                    {Opu.VCIconView()}
                    {information.access_total}
                  </div>
                </div>
                <Link to={Opu.InformationPath(information.puid)}></Link>
              </li>;
            return tag;
          }) }
      </ul>
    </div>
  );
};

export default Search;