const ErrorView = (props) => {
  if (props.error != null && props.error.response != null && props.error.response.status != null) {
    if (props.error.response.status === 404) {
      return <div className='op-msg'>ページがみつかりません。<div className='reason c-warn'>パンフレットが非公開に設定されているか、すでに削除されたパンフレットの可能性があります。</div></div>;
    }
    if (props.error.response.status === 502) {
      return <div className='op-msg'>サーバーメンテナンス中。ご迷惑をおかけします。</div>;
    }
    if (props.error.response.status === 503) {
      return <div className='op-msg'>サーバーメンテナンス中。ご迷惑をおかけします。</div>;
    }
    return <div className='op-msg'>エラーが発生しました。</div>;
  }
  return null;
};
export default ErrorView;