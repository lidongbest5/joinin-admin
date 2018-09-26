import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import App from './app';
import registerServiceWorker from './register-service-worker';
import './index.less';

ReactDOM.render(<LocaleProvider locale={zh_CN}><App /></LocaleProvider>, document.querySelector('#root'));
registerServiceWorker();
