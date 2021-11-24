import {useState} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import * as Opu from '../OpUtils';
import * as Api from '../OpApi';

const Search = (props) => {
  const [pamphlets, setPamphlets] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    Api.fetchSearch(watch('keyword'), (res) => {
      if (res.data.data !== null && res.data.data !== undefined) {
        if (res.data.data.informations !== null && res.data.data.informations !== undefined) {
          setPamphlets(res.data.data.informations);
        } else {
          setPamphlets([]);
        }
      } else {
        setPamphlets([]);
      }
    }, (error) => {
      setPamphlets([]);
      console.log(error);
    });
  };
  Opu.VCShowHeaderFooter();

  return (
    <div className='op-search'>
      <div id="breadcrumb" className='op-breadcrumb'>
        <ol className='l-breadcrumb'>
          <li><a href={Opu.TopPath()}>Top</a></li>
          <li>検索</li>
        </ol>
      </div>
      <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' defaultValue='花' {...register("keyword", { required: true })} placeholder='キーワード' />
        <input type="submit" value="検索"/>
      </form>
      {errors.keyword && <span className='error'>キーワードを入力してください。</span>}
      <ul className='informationList'>
        { pamphlets.map(information => {
            var tag =
              <li key={information.puid}>
                <img src={Opu.ImgUrl(information.icon_thumb)} alt={information.name}/>
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