'use strict';

import {Icon} from 'antd';

let Header = React.createClass({
  propsTypes: {
    userData: React.PropTypes.object.isRequired
  },
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    // 检查是否登录
    //this.props.actions.checkLogin();
  },
  componentWillReceiveProps(nextProps) {
    // 如果没有登录则跳登录
   
  },
  // 跳转登录页
  handleLogin: function (e) {
    e && e.preventDefault();
    this.context.router.push('/user/login');
  },
  handleLogout: function (e) {
    e.preventDefault();
    localStorage.removeItem('adminId');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    location.hash = '/user/login';
  },
  
  render: function () {
   let nav = '';
   let username=localStorage.getItem('username');
   if(username){
    nav='欢迎您，'+username;
   }

    return (
      <header id="header" className="clearfix">
        <div className="header-inner">
          <a className="logo" href="#/">
            <span className="logo-text">wecut运营管理中心</span>
          </a>
          <div className="search"></div>
          <nav className="right_nav">
            <span id="login_dec">{nav}</span>
             <a className="u-ml-10" href="#" onClick={this.handleLogout}>退出登录</a>
          </nav>
          <div className="nav-phone-icon"></div>
        </div>
      </header>
    );
  }
});
module.exports = Header;
