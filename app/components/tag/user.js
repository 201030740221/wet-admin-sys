import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
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

    let allTag = this.props.allTag||[];
    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="10">
              <div span="12" className='fl'>
               <Select
                  defaultValue="-1"
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
            <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_channel')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部用户</Option>
                  <Option value="1">vip用户</Option>
                  <Option value="2">推荐用户</Option>
                </Select>
            </Col>
             <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'tag_type')}
                  style={{width:'120'}}
               >
                <Option value="-1">全部标签分类</Option>
                {
                  allTag.map(function(item,key){
                    return (
                      <Option key={key} value={item.tagid}>{item.name}</Option>
                    )
                  })
                }

                </Select>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'has_tag')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部标签</Option>
                  <Option value="1">有标签</Option>
                  <Option value="0">无标签</Option>
                </Select>
            </Col>
          </Row>
          <Row>
             <Col span="3" style={{marginTop:'10'}}>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'sorttype')}
                  style={{width:'120'}}
               >
                  <Option value="-1">排序</Option>
                  <Option value="1">按赞数</Option>
                  <Option value="2">按粉丝数</Option>
                  <Option value="3">按内容发布数</Option>
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


var TagIndex = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
        return {
          data: [],
          pagination: { pageSize:20, showQuickJumper:true },
          loading: false,
          allTag:[],

          searchtype: -1,
          isrec: -1,
          tagid:-1,
          istag: -1,
          sorttype: -1
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag,
        sorttype = this.state.sorttype;

    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      viptype: +isrec,
      tagid: +tagid,
      istag: +istag,
      sorttype: +sorttype,
      index: pagination.current
    }

    this.fetch(_parmas);
  },
  fetch(params = {}) {

    let self = this;
    this.setState({ loading: true });

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/tag/user/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        let _arr = result.data.users;
        if(result.data.users.length>0){
           self.setState({
            loading: false,
            data: result.data.users,
            pagination,
            allTag: _arr[0].firstLevelTag||[]
          });
        }else{
          self.setState({
            loading: false
          });
        }

      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  onSearch(){
     let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag,
        sorttype = this.state.sorttype;

    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      viptype: +isrec,
      tagid: +tagid,
      istag: +istag,
      sorttype: +sorttype,
    }
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
            isrec: val
          })
          break;
      case 'tag_type':
          this.setState({
            tagid: val
          })
          break;
      case 'has_tag':
          this.setState({
            istag: val
          })
          break;
      case 'sorttype':
          this.setState({
            sorttype: val
          })
          break;
    }

  },

  tagClick(uid,tagid){

    let self = this;

    let params = {
      uid: uid,
      tagid: tagid
    }
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/user/add.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {

        let addTag = result.data.addTag;
        let data = self.state.data;
        data.map(function(_item,_key){
          let firstLevelTag = _item.firstLevelTag||[];
          firstLevelTag.map(function(item,key){
            if(+_item.uid==uid){
              if(+item.tagid==tagid){
                item.tagStatus = 'active';
              }else{
                item.tagStatus = '';
              }
            }
          })
          if(+_item.uid==uid){
             let existedTags = _item.existedTags||[];
             console.log(addTag);
             if(addTag){
              existedTags.push(addTag);
             }
            _item.secondLevelTag = result.data.secondLevelTag||[];
          }

        })

        self.setState({
          data: data
        })
      }
    });

  },
  tagSecondClick(uid,tagid){

    let self = this;

    let params = {
      uid: uid,
      tagid: tagid
    }
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/user/add.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {

        let addTag = result.data.addTag;
        let data = self.state.data;
        data.map(function(_item,_key){
          let secondLevelTag = _item.secondLevelTag||[];
          secondLevelTag.map(function(item,key){
            if(+_item.uid==uid){
              if(+item.tagid==tagid){
                item.tagStatus = 'active';
              }else{
                item.tagStatus = '';
              }
            }
          })
          if(+_item.uid==uid){
             let existedTags = _item.existedTags||[];
             console.log(addTag);
             if(addTag){
              existedTags.push(addTag);
             }
            _item.secondLevelTag = result.data.secondLevelTag||[];
          }

        })

        self.setState({
          data: data
        })
      }
    });

  },
  delTag(uid,tagid){

    let self = this;

    let params = {
      uid: uid,
      tagid: tagid
    }
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/user/del.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
         message.success('成功删除');
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
    if(this.state.data.length<=0){
      return (
        <div>暂无数据</div>
      )
    }

    let columns = [{
      title: 'title',
      dataIndex: '',
      render(text,record){
        record.firstLevelTag =record.firstLevelTag||[];
        record.secondLevelTag =record.secondLevelTag||[];
        return (
          <Row>
            <Col span="4">
              <div className="u-p-10">
               <a href={"#/content/index/type/4/userId/"+record.uid} target="_blank">
                <img className="header_pic" src={record.uavatar} />
               </a>
                <p className="mt-10">用户：
                   <a href={"#/content/index/type/4/userId/"+record.uid} target="_blank">{record.uname}</a>
                </p>
                <p className="mt-15">简介：{record.sintro}</p>
              </div>
            </Col>
            <Col span="20">
              <div className="u-p-10">
                <Row>
                   <Col span="8">
                   .
                      <div className="clearfix">
                          {
                            record.tuleImage.map(function(item,key){
                              return (
                                <div className="fl ml-5" key={key}>
                                  <img src={item} width="100" />
                                </div>
                              )
                            })
                          }
                      </div>
                   </Col>

                    <Col span="14" style={{textAlign: 'right'}}>
                      <div className="">
                        已选:
                        <span className="ml-5">
                          {
                            record.existedTags.map(function(item,key){

                                if(record.existedTags.length<=0){
                                  return (
                                    <span>暂无</span>
                                  )
                                }
                                return (
                                  <Tag key={key} closable onClose={self.delTag.bind(null,record.uid,item.tagid)}>{item.name}</Tag>
                                )
                            })
                          }
                        </span>
                      </div>
                    </Col>
                </Row>
                  <div className="tag_section mt-10">
                    <div className="tag_type first">
                      <span className="title">一级：</span>
                      {
                        record.firstLevelTag.map(function(_item,index){
                          return (
                            <span key={index} className={"tag_list "+_item.tagStatus} onClick={self.tagClick.bind(null,record.uid,_item.tagid)}>{_item.name}</span>
                          )
                        })
                      }

                  </div>
                  <div className="tag_type">
                      <span className="title">二级：</span>
                      {
                        record.secondLevelTag.map(function(_item,index){
                          if(_item){
                              return (
                                <span key={index} className={"tag_list "+_item.tagStatus} onClick={self.tagSecondClick.bind(null,record.uid,_item.id)}>{_item.name}</span>
                              )
                            }else{
                              return(
                                <span>暂无</span>
                              )
                            }

                        })
                      }
                  </div>
                  </div>
              </div>
            </Col>
          </Row>
          )
      }
    }];

    let allTag = this.state.allTag||[];


    return (
      <div className="right-container">
        <FormSearch
          onSearch={this.onSearch}
          changeHandle={this.changeHandle}
          allTag = {allTag}
        />
        <Table
          showHeader
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          bordered
          rowKey={record => record.uid}
          />
      </div>
    );
  }
});

module.exports = TagIndex;
