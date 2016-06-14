'use strict';

import React from 'react';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import 'antd/style/index.less';
import './css/style';

import App from './views/Main';

//标签管理
import TagIndex from './components/tag/index';
import TagUser from './components/tag/user';
import TagChannel from './components/tag/channel';
import TagContent from './components/tag/content';

//内容推荐管理
import ContentIndex from './components/content/index';
import ContentUser from './components/content/user';
import ContentLimit from './components/content/limit';

import LoginPage from './components/user/login';

//发布管理
import PublishIndex from './components/publish/index';

//权限管理
import PermissionIndex from './components/permission/index';
import PermissionEdit from './components/permission/edit';


// 登录验证
function requireAuth() {
  if (!localStorage.getItem('adminId')) {
    location.hash = '/user/login';
    return false;
  }
}


var routes = (
  <Router history={appHistory}>

  	  {/* 用户管理 */}
      <Route path="user">
        	<Route component={LoginPage} path="login" breadcrumbName="登录"/>
      </Route>

      <Route onEnter={requireAuth} component={App} path="/" >

            {/* 标签管理 */}
	        <Route onEnter={requireAuth} path="tag" breadcrumbName="标签功能">
	          <IndexRoute component={TagIndex}/>
	          <Route onEnter={requireAuth} component={TagIndex} path="index" breadcrumbName="标签管理"/>
	          <Route onEnter={requireAuth} component={TagUser} path="user" breadcrumbName="用户标签管理"/>
	          <Route onEnter={requireAuth} component={TagChannel} path="channel" breadcrumbName="频道标签管理"/>
	          <Route onEnter={requireAuth} component={TagContent} path="content" breadcrumbName="内容标签管理"/>
	        </Route>

	        {/* 内容推荐管理 */}
	        <Route onEnter={requireAuth} path="content" breadcrumbName="内容推荐管理">
	          <IndexRoute component={ContentIndex}/>
	          <Route onEnter={requireAuth} component={ContentIndex} path="index" breadcrumbName="内容推荐筛选"/>
	          <Route onEnter={requireAuth} component={ContentIndex} path="index/type/:typeId/userId/:userId" breadcrumbName="内容推荐筛选"/>
	          <Route onEnter={requireAuth} component={ContentUser} path="user" breadcrumbName="用户推荐筛选"/>
	          <Route onEnter={requireAuth} component={ContentLimit} path="limit" breadcrumbName="内容举报管理"/>
	        </Route>

	        {/* 发布管理 */}
	        <Route onEnter={requireAuth} path="publish" breadcrumbName="发布管理">
	          <IndexRoute component={PublishIndex}/>
	          <Route onEnter={requireAuth} component={PublishIndex} path="index" breadcrumbName="内容发布"/>
	        </Route>

          {/* 权限管理 */}
	        <Route onEnter={requireAuth} path="permission" breadcrumbName="权限管理">
	          <IndexRoute component={PermissionIndex}/>
	          <Route onEnter={requireAuth} component={PermissionIndex} path="index" breadcrumbName="账号列表"/>
            <Route onEnter={requireAuth} component={PermissionEdit} path="edit" breadcrumbName="权限列表"/>
	        </Route>


      </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app-root'));
