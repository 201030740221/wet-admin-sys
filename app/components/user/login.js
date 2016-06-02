import Header from '../../views/header';
import Footer from '../../views/footer';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {message,Form, Checkbox, Button, Row, Col} from 'antd';
const FormItem = Form.Item;


const LoginPage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    // 获得光标焦点
    let username = $('#username').val();
    if (username) {
      $('#password').focus();
    } else {
      $('#username').focus();
    }


  },
  componentWillReceiveProps(nextProps) {

  },
  login: function (e) {
    e.preventDefault();
    let self = this;
    let username = $('#username').val();
    let password = $('#password').val();

    if (username && password) {

      reqwest({
        url: apiConfig.apiHost+'/cms/access/login.php',
        method: 'post',
        data: { username:username,password:password },
        type: 'json',
        success: (res) => {
          if(res.code==1){
            message.success('已成功登录');

            localStorage.setItem('adminId',res.data.adminId);
            localStorage.setItem('username',username);
            localStorage.setItem('password',password);

            setTimeout(function(){location.hash='/'},2000);
          }else{
             message.error(res.msg);
          }

        }
      });

    } else {
      message.error('用户名或密码不能为空');
    }
  },
  rememberMe: function (e) {

  },
  render: function () {
    const {actions, userData} = this.props;
    return (
      <div>
        <Header/>
        <div className="main-wrapper login-wrap clearfix">
          <div className="login-box main-box">
            <div className="main-box-inner">
              <Form horizontal={true}>
                <FormItem
                  id="username"
                  label="用户名："
                  labelCol={{
                    span: 6
                  }}
                  wrapperCol={{
                    span: 14
                  }}>
                  <input
                    id="username"
                    defaultValue={'admin'}
                    className="ant-input"
                    placeholder="请输入邮箱..."/>
                </FormItem>

                <FormItem
                  id="password"
                  label="密码："
                  labelCol={{
                    span: 6
                  }}
                  wrapperCol={{
                    span: 14
                  }}>
                  <input id="password" className="ant-input" type="password" placeholder="请输入密码..."/>
                </FormItem>

                <FormItem wrapperCol={{
                  span: 14,
                  offset: 6
                }}>
                  <label>
                    <Checkbox checked={'1'} onChange={this.rememberMe}/>
                    记住登录
                  </label>
                </FormItem>

                <Row>
                  <Col offset="6" span="16">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        width: '240px'
                      }}
                      onClick={this.login}>确定</Button>
                  </Col>
                </Row>
                <Row>
                  <Col
                    span="24"
                    style={{
                      textAlign: 'center',
                      marginTop: 50
                    }}>
                    <span>为了体验最佳的用户体验，推荐使用 <a href="javascript:;">safari浏览器</a>／<a target="_blank" href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html">chrome浏览器</a> 最新版本浏览网站</span>
                  </Col>
                </Row>

              </Form>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

});

module.exports = LoginPage;
