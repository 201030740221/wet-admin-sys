import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Upload,Transfer,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

//import BaseForm from '../../common/base-form';
//import TagsMultSelect from '../../common/tags-mult-select';


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
  addPublish(){
    if(this.props.addPublish){
      this.props.addPublish();
    }
  },
  render(){

    let taskadminIds = this.props.taskadminIds;
    var taskadminIds_node = '';
    if(taskadminIds.length>0){
      taskadminIds_node = (
        <Col span="3" style={{marginLeft:'10'}}>
           <Select
              defaultValue={this.props.taskadminId+''}
              onChange={this.handleChange.bind(null,'taskadminId')}
              style={{width:'120'}}
           >
              <Option value='-1'>全部管理</Option>
              {
                taskadminIds.map((item,key)=>{
                  return (
                    <Option key={key} value={item.accountdminId+''}>{item.name}</Option>
                  )
                })
              }
            </Select>
        </Col>
      )
    }else{
      taskadminIds_node = '';
    }

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            {taskadminIds_node}
          </Row>
          <Row className="u-mt-20">
            <Col span="12" style={{ textAlign: 'left' }}>
                <Button type="primary" onClick={this.addPublish}>新增账号</Button>
            </Col>
            <Col span="12" style={{ textAlign: 'right' }}>
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
          pagination: { pageSize:20, showQuickJumper:true ,totalItem:null},
          loading: false,
          fileList:[],
          firstLevelTag: [],
          secondLevelTag: [],

          taskadminIds: [],
          taskadminId: -1,

          record: {},
          visible: false,

          accountList: []
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    let taskadminId = this.state.taskadminId;

    let _parmas = {
      accountadminId: taskadminId,
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
      url: apiConfig.apiHost+'/cms/publish/accountlist.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        //let firstLevelTag = result.data.firstLevelTag;
        let _arr = result.data;
         self.setState({
          loading: false,
          data: result.data.accounts,
          taskadminIds: result.data.accountadminIds,
          pagination,
          totalItem: result.totalItem
        });

      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  onSearch(){
    let taskadminId = this.state.taskadminId;

    let _parmas = {
      accountadminId: taskadminId,
      index: 1
    }

    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'taskadminId':
          this.setState({
            taskadminId: val
          })
          break;
    }

  },
  tagChange(_key,value){
    let accountList = this.state.accountList;
    accountList.forEach((item,key)=>{
      if(_key==key){
        item.tagid = value
      }
    })
    this.setState({
      accountList: accountList
    })
  },


  //新增发布
  addPublish(){
    //this.context.router.push('/publish/account/edit');
    this.showModal({});
  },
  edit(uid){
    this.context.router.push('/publish/account/edit/'+uid);
  },

  addAccount(){
    let accountList = this.state.accountList;
    if(accountList.length>=10){
      message.warn('新增用户不能超过10个');
      return;
    }
    accountList.push({uname:''});
    this.setState({
      accountList: accountList
    });

  },
  delHandle(_key){
    let accountList = this.state.accountList;
    accountList.splice(_key,1);
    this.setState({
      accountList: accountList
    })
  },

  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }

    let columns = [{
      title: '用户ID',
      dataIndex: 'uid'
    },{
      title: '昵称',
      dataIndex: 'uname'
    },{
      title: '内容数',
      dataIndex: 'worksNum'
    },{
      title: '标签',
      dataIndex: 'tag'
    },{
      title: '账号质量',
      dataIndex: 'quality'
    },{
      title: '创建时间',
      dataIndex: 'ctime'
    },{
      title: '状态',
      dataIndex: 'status'
    },{
      title: '操作人',
      dataIndex: 'admin'
    },{
      title: '管理',
      dataIndex: '',
      render(text,record){
        return (
            <a href="javascript:;" onClick={self.edit.bind(null,record.uid)}>编辑</a>
          )
      }
    }];

    let props = {
      onSearch: this.onSearch,
      changeHandle: this.changeHandle,
      addPublish: this.addPublish,
      taskadminIds: this.state.taskadminIds,
      taskadminId: this.state.taskadminId,
    }

    return (
      <div className="right-container">
        <FormSearch
          {...props}
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
          <span className="total_show">共 {this.state.totalItem} 条记录</span>

      </div>
    );
  }
});

module.exports = TagIndex;
