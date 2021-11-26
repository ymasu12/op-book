import { useCallback } from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import * as Opu from '../OpUtils';

const Top = (props) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const history = useHistory();
  Opu.VCShowHeaderFooter();
  
  const onSubmit = useCallback(() => {
    history.push(`/search?keyword=${watch('keyword')}`);
  }, [history, watch]);
  
  return (
    <div className='op-top'>
      <div className='description'>
        Openパンフレットは、誰でも自由にデジタルパンフレットを作成し公開できるサービスです。
      </div>
      <div className='search-frame'>
        <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
          <p><span className='title'>キーワードでパンフレットを見つけよう</span></p>
          <input type='text' defaultValue={process.env.REACT_APP_SEARCH_DEFVAL} {...register("keyword", { required: true })} placeholder='キーワード' />
          <input type="submit" value="検索"/>
          {errors.keyword && <span className='error'>キーワードを入力してください。</span>}
        </form>
      </div>
      <div className='web-banner'>
        <a href='https://open-pamphlet.com/sessions/new'>パンフレットをつくる場合はこちら</a>
      </div>
    </div>
  );
};

export default Top;