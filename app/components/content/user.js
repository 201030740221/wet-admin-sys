import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Menu, Dropdown,Popover, message,Icon,Table,Tag,Form, Select,Input, Row, Col, Modal, Button,Pagination } from 'antd';
const FormItem = Form.Item;

/*import BaseForm from '../common/base-form';*/

var FormSearch = React.createClass({
   getInitialState: function () {
        return {


        };
  },
  search(){
    if(this.props.onSearch){
      this.props.onSearch();
    }
  },

  handleChange(which,val){
    let self = this;

    if(this.props.changeHandle){
      this.props.changeHandle(which,val);
    }
  },
  render(){

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="10">
              <div span="12" className='fl'>
               <Select className="search_type"
                  defaultValue={this.props.searchtype+''}
                  onChange={this.handleChange.bind(null,'search_type')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">搜索类型</Option>
                  <Option value="1">用户昵称</Option>
                  <Option value="2">用户ID</Option>
                </Select>
              </div>
              <div span="12" className='fl'>
                <Input className="search_input" placeholder="please enter..." style={{marginLeft:'10'}} />
              </div>
            </Col>
            <Col span="4" style={{marginLeft:'10'}}>
               <Select
                  className="search_content"
                  defaultValue={this.props.usertype+''}
                  onChange={this.handleChange.bind(null,'search_channel')}
                  style={{width:'120'}}
               >
                  <Option value="-1">用户筛选</Option>
                  <Option value="1">vip用户</Option>
                  <Option value="2">推荐用户</Option>
                </Select>
            </Col>
            <Col span="4">
               <Select
                  className="search_channel"
                  defaultValue={this.props.sorttype+''}
                  onChange={this.handleChange.bind(null,'sorttype')}
                  style={{width:'120'}}
               >
                  <Option value="-1">排序</Option>
                  <Option value="1">按赞数</Option>
                  <Option value="2">按粉丝数</Option>
                  <Option value="3">按内容发布数</Option>
                  <Option value="4">按吸粉实力</Option>
                  <Option value="5">按获赞实力</Option>
                  <Option value="6">按内容强度</Option>
                </Select>
            </Col>
            <Col span="4" style={{marginLeft:'10'}}>
               <Select
                  className="search_channel"
                  defaultValue={this.props.activeday+''}
                  onChange={this.handleChange.bind(null,'has_tag')}
                  style={{width:'120'}}
               >
                  <Option value="-1">不限制活跃</Option>
                  <Option value="1">一天前活跃</Option>
                  <Option value="3">三天前活跃</Option>
                  <Option value="5">五天前活跃</Option>
                  <Option value="7">七天前活跃</Option>
                  <Option value="15">十五天前活跃</Option>
                </Select>
            </Col>
          </Row>
          <Row className="u-mt-20">
            <Col span="24" style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.search}>搜索</Button>
            </Col>
          </Row>
        </div>
      )
  }
});


//卡片内容
const PopoverBox = React.createClass({
  render(){

    let _item = this.props.item;

    let tag_arr = [
      {name: '手机',color: +_item.ismobile?'bg_green':''},
      {name: 'QQ',color: +_item.isqq?'bg_green':''},
      {name: '微博',color: +_item.isweibo?'bg_green':''},
      {name: '微信',color: +_item.isweixin?'bg_green':''}
    ];
    return (
      <div style={{width: '300'}}>
        <Row>
          <Col span='14'>
            <p className="mt-5">简介：{_item.sintro}</p>
            <p className="mt-5">点赞数：{_item.likenum}</p>
          </Col>
          <Col span='10' className="u-tr">
            <p className="mt-5">注册天数：{_item.registerdays}</p>
            <p className="mt-5">{_item.lastActivedays}天前活跃</p>
          </Col>
        </Row>
        <Row className="mt-15">
          <a href="javascript:;">粉丝({_item.followcount})</a>
          <a className="u-ml-20" href="javascript:;">内容({_item.tlcount})</a>
          <a className="u-ml-20" href="javascript:;">频道({_item.createchannelcount})</a>
        </Row>
        <Row className="mt-15">
          <a href="javascript:;">关注({_item.focuscount})</a>
          <a className="u-ml-20" href="javascript:;">贴纸({_item.scount})</a>
          <a className="u-ml-20" href="javascript:;">关注频道({_item.focuschannelcount})</a>
        </Row>
        <Row className="mt-10">
          <span className="tag_icon">{_item.platform}</span>
          {
            tag_arr.map(function(elm,index){
              return (
               <span key={index} className={"tag_icon "+elm.color}>{elm.name}</span>
              )
            })
          }
        </Row>
      </div>
    )
  }
})

//缩略图
const TuleImageBox = React.createClass({
  render(){

    let _item = this.props.item;

    return (
      <div>
        <img src={_item} width='320' />
      </div>
    )
  }
})

var TagIndex = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
        return {
          data: [],
          pagination: { pageSize:10, showQuickJumper:true,current:1 },
          loading: true,

          searchtype: -1,
          usertype: 2,
          activeday:-1,
          sorttype: -1
        };
  },

  fetch(params = {}) {

    let self = this;
    let _data = [];

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    this.setState({ loading: true });
    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/user/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        console.log(result);
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        _data = result.data.users;

        _data.forEach(function(item,key){
          item.remark_status = 'hidden';
        })

        self.setState({
            loading: false,
            data: _data,
            pagination: pagination
          });

      }
    });
  },
  componentDidMount() {

    let self = this;
    this.fetch({usertype: this.state.usertype});
    document.onkeydown=function(event){
       var e = event || window.event || arguments.callee.caller.arguments[0];
       if(e && e.keyCode==27){ // 按 Esc
           //要做的事情
         }
       if(e && e.keyCode==113){ // 按 F2
            //要做的事情
          }
       if(e && e.keyCode==13){ // enter 键
            self.onSearch();
        }
     };
  },

  onSearch(){
    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        usertype  = this.state.usertype,
        activeday = this.state.activeday,
        sorttype = this.state.sorttype;

    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      usertype: +usertype,
      activeday: +activeday,
      sorttype: +sorttype,
      index: 1
    }

    let pagination = this.state.pagination;
    pagination.current = 1;
    this.setState({
      pagination: pagination
    })
    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'search_type':
          this.setState({
            searchtype: val
          })
          break;
      case 'search_channel':
          this.setState({
            usertype: val
          })
          break;
      case 'has_tag':
          this.setState({
            activeday: val
          })
          break;
      case 'sorttype':
          this.setState({
            sorttype: val
          })
          break;
    }

  },

  pageChange(_page){

   let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        usertype  = this.state.usertype,
        activeday = this.state.activeday,
        sorttype = this.state.sorttype;

    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      usertype: +usertype,
      activeday: +activeday,
      sorttype: +sorttype,
      index: _page
    }

    let pagination = this.state.pagination;
    pagination.current = _page;
    this.setState({
      pagination: pagination
    })

    this.fetch(_parmas);

  },

 recommend(uid,status){

    let self = this;
    let data = this.state.data;

    let params = {uid:uid , status:+status==1?3:1};
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/user/rec.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (res) => {
        message.success(res.msg);
        data.forEach(function(item,key){
          if(uid==item.uid){
            if(+status==1){
              item.status = 3;
            }else{
              item.status = 1;
            }

          }
        })

        self.setState({
          data: data
        })
      }
    });
  },

  froneHandle(uid,status){
    let self = this;
    let data = this.state.data;

    let params = {uid:uid , status:+status==1?2:1};
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/user/freeze.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (res) => {
        message.success(res.msg);
        data.forEach(function(item,key){
          if(uid==item.uid){
            if(+status==1){
              item.status = 2;
            }else{
              item.status = 1;
            }

          }
        })

        self.setState({
          data: data
        })
      }
    });
  },

  linkTo(){
     message.warn('该功能暂未开放');
  },

  remarkHandle(_key,uid,remark_status){

    let self = this;
    let data = this.state.data;

    if(remark_status=='hidden'){
      data.forEach(function(item,key){
         if(_key==key){
            item.remark_status = 'shown';
          }
        })
        this.setState({
          data: data
        })
      return;
    }

    let remark = $('#remark_'+uid).val();
    if(!remark){
      message.warn('备注不能为空');
      return;
    }

    let params = {uid:uid,remark:remark};
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/user/remark.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (res) => {
        message.success(res.msg);
         data.forEach(function(item,key){
         if(_key==key){
           item.remark = remark;
           item.remark_status = 'hidden';
          }
        })

        self.setState({
          data: data
        })
      }
    });

  },
  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }

  let data = this.state.data;

   if(data.length<=0){
      return(
        <div>
           <FormSearch
              onSearch={this.onSearch}
              changeHandle={this.changeHandle}
            />
            <div className="content_section">
              <p>暂无数据</p>
            </div>
        </div>

      )
    }

    let props = {
      onSearch: this.onSearch,
      changeHandle: this.changeHandle,
      searchtype: this.state.searchtype,
      usertype: this.state.usertype,
      activeday:this.state.activeday,
      sorttype: this.state.sorttype
    }

    return (
      <div className="right-container">
        <FormSearch
          {...props}
        />

        <Row className="content_section">
         {
          data.map(function(item,key){

            item.tuleImage = item.tuleImage||[];

            let vip_icon = '' , rec_icon = '';
            if(+item.isvip){
              vip_icon = (
                <span className="tip_more_icon bg_green">v</span>
              )
            }
            if(+item.isrec){
              rec_icon = (
                <span className="tip_more_icon bg_green">荐</span>
              )
            }

            let menu = (
                  <Menu>
                    <Menu.Item key="0">
                      <a
                        href="javascript:;"
                        onClick={self.froneHandle.bind(null,item.uid,item.status)}
                        >{+item.status==2?'取消封号':'封号'}</a>
                    </Menu.Item>
                    <Menu.Divider />
                  </Menu>
                );
            return (
              <Col span="11" className="list_content" key={key}>
                 <Row style={{minHeight:'70'}}>
                    <Col span="16">
                      <Row>
                        <div className="fl">
                          <a href={"#/content/index/type/4/userId/"+item.uid} target="_blank">
                            <img src={item.uavatar} className="header_pic" />
                          </a>
                       </div>
                       <div className="fl u-ml-10">
                          <p className="mt-5">
                           <a href={"#/content/index/type/4/userId/"+item.uid} target="_blank">
                            {item.uname}
                           </a>

                             <Popover overlay={<PopoverBox item={item} />} title={item.uname+"（ "+item.uid+" ）"} trigger="hover">
                              <span className="tip_more_icon">?</span>
                            </Popover>
                          </p>
                          <p className="mt-10">
                            {vip_icon}
                            {rec_icon}
                          </p>
                       </div>
                      </Row>
                    </Col>
                    <Col span="8" className="u-tr">
                      <p>

                         <Dropdown overlay={menu} trigger={['click']}>
                          <a className="ant-dropdown-link" href="#">
                            更多 <Icon type="down" />
                          </a>
                        </Dropdown>

                        <span className="u-ml-10 small_btn">分组</span>
                        <span
                          className="u-ml-5 small_btn"
                          onClick={self.recommend.bind(null,item.uid,item.status)}
                          >{+item.status==3?"取消推荐":"推荐"}</span>
                      </p>
                    </Col>
                 </Row>
                 <Row className="mt-20">
                    {
                      item.tuleImage.map(function(_item,_key){
                        return (
                          <div className="fl u-mr-10" key={_key}>
                            <Popover overlay={<TuleImageBox item={_item} />} title="图片" trigger="hover" placement="rightBottom">
                              <img src={_item} height="80" />
                            </Popover>
                          </div>
                        )
                      })
                    }
                 </Row>
                 <Row className="mt-10">
                    <div className="fl">
                      <span className="remark">备注：</span>
                      <input
                        type="text"
                        defualtValue={item.remark}
                        id={"remark_"+item.uid}
                        className={"remark_input "+item.remark_status}
                        />
                      <span className={item.remark_status=='hidden'?'shown-inline':'hidden'}>{item.remark}</span>
                    </div>
                    <div className="fr">
                      <a
                        href="javascript:;"
                        onClick={self.remarkHandle.bind(null,key,item.uid,item.remark_status)}
                        >
                        {item.remark_status=='shown'?'保存备注':'修改备注'}
                        </a>
                    </div>
                 </Row>
              </Col>
            )
          })
         }
        </Row>
        <div className="page_nav u-tc">
          <Pagination
            showQuickJumper
            current={this.state.pagination.current}
            total={this.state.pagination.total}
            onChange={self.pageChange}
            />
        </div>
      </div>
    );
  }
});

module.exports = TagIndex;
