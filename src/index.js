import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import store from './store/index'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider  locale={zhCN}>
            <App />
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);


