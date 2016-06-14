import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Popconfirm,Popover,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

//缩略图
const TuleImageBox = React.createClass({
  render(){

    let _item = this.props.item;

    return (
      <div>
        <img src={_item} width='480' />
      </div>
    )
  }
})


var ViewPage = React.createClass({
    getInitialState: function () {
        return {
          data: [],
          loading: false,
          pagination: { pageSize:20,total:20},
          totalItem: 20,
        };
    },
    componentDidMount: function () {
      let {params} = this.props;
      this.getSource(params);
    },
    componentWillReceiveProps(nextProps) {
       let {params} = nextProps;
      this.getSource(params);
    },
    handleTableChange(pagination) {
      const pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });

      let {params} = this.props;
      let _parmas = {
        pid:params.id,
        index: pagination.current
      }

      this.getSource(_parmas);
    },
    getSource(params={}){
      let self = this;
      this.setState({ loading: true });

      params = {pid: params.id};

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/detail.php',
        method: 'get',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            let pagination = self.state.pagination;
            pagination.total = res.totalIndex*pagination.pageSize;
            self.setState({
              data: res.data,
              loading: false,
              pagination,
              totalItem: res.totalItem
            })
          }
        }
      });
    },
    hideHandle(id,tid){
      let self = this;
      let params = { id: id, tid: tid };
      let _data = this.state.data;

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/tuledel.php',
        method: 'post',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            message.success(res.msg);
            _data.forEach((item)=>{
              if(item.id==id){
                item.isDel=0;
                item.status="已屏蔽";
              }
            })
            self.setState({
              data: _data
            })

          }else{
            message.error(res.msg);
          }
        }
      });
    },
    render(){

      let self = this;
      let columns = [{
        title: '图乐ID',
        dataIndex: 'tid'
      },{
        title: '缩略图',
        dataIndex: 'image',
        render(text,record){
          return(
            <Popover overlay={<TuleImageBox item={record.image} />} title="图片" trigger="hover" placement="rightBottom">
              <img src={record.image} width="60" />
            </Popover>
            )
        }
      },{
        title: '内容主题',
        dataIndex: 'topic'
      },{
        title: '频道',
        dataIndex: 'channelName'
      },{
        title: '标签',
        dataIndex: 'tagName'
      },{
        title: '发布用户',
        dataIndex: 'userName'
      },{
        title: '发布时间',
        dataIndex: 'publishTime'
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
          let hide_node = '';
          if(+record.isDel==1){
            hide_node = (
                <a href="javascript:;" onClick={self.hideHandle.bind(null,record.id,record.tid)}>屏蔽</a>
              );
          }
          return (
              <span>
                {hide_node}
              </span>
            )
        }
      }];

      return (
          <div>
             <Table
              showHeader
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              bordered
              rowKey={record => record.id}
              />
              <span className="total_show">共 {this.state.totalItem} 条记录</span>
          </div>
        )
    }
})

module.exports = ViewPage;
