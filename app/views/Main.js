'use strict';

import ReactRouter from 'react-router';
import SideBar from './sidebar';
import Header from './header';
import Footer from './footer';
import Container from './container';
import {Icon, Breadcrumb} from 'antd';

let Home = React.createClass({
  render() {
    return (
      <div className="home-page">
        <div className="home-logo"><Icon type="home"/></div>
        <div className="f14">new Date()</div>
        <div className="f16">{this.props.username}，欢迎来到wecut运营管理中心.</div>
      </div>
    );
  }
});

let App = React.createClass({
   contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  renderChild() {

    const { children, userData } = this.props;
    if (children) {
      return (
        <div>
          <Breadcrumb {...this.props} router={ReactRouter}/>
          <div className="u-mt-20">
            {children}
          </div>
        </div>
      );
    }
    return (
      <div className="u-mt-20">
        <Home username={"hi"}/>
      </div>
    );
  },
  render() {
    return (
      <div>
        <Header/>
        <div className="main-wrapper clearfix">
          <SideBar/>
          <Container>
            {this.renderChild()}
          </Container>
        </div>
        <Footer/>
      </div>
    );
  }
});
module.exports = App;