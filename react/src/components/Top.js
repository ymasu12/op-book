import { Link } from 'react-router-dom';
import * as Opu from '../OpUtils';

const Top = (props) => {
  Opu.VCShowHeaderFooter();
  console.log(process.env);
if (process.env.NODE_ENV === 'development') {
  console.log('s');
  //
  // 開発環境API呼び出し
  //
} else if (process.env.NODE_ENV === 'production') {
  console.log('ff');
  //
  // 本番環境API呼び出し
  //
} else if (process.env.NODE_ENV === 'test') {
  console.log('jj');
  //
  // テスト環境API呼び出し
  //
}
  return (
    <div className='op-top'>
      <div id="breadcrumb" className='op-breadcrumb'>
        <ol className='l-breadcrumb'>
          <li>Top</li>
        </ol>
      </div>
      <div className='search'>
        <Link className='text-btn link-no-decoration' to={Opu.SearchPath()}>パンフレットをさがす</Link>
      </div>
      <div className='search'>
        <a className='text-btn link-no-decoration' href='https://open-pamphlet.com/sessions/new'>パンフレットをつくる</a>
      </div>
    </div>
  );
};

export default Top;