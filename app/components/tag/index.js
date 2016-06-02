import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Table,Form, Select,Input, Row, Col, Modal, Button } from 'antd';
const FormItem = Form.Item;

/*import BaseForm from '../common/base-form';*/

var FormSearch = React.createClass({
  render(){
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    return (
        <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="14">
              <div span="12" className='fl'>
               <Select defaultValue="0" style={{ width: 120 }} onChange={handleChange}>
                  <Option value="0">标签名</Option>
                  <Option value="1">标签ID</Option>
                </Select>
              </div>
              <div span="12" className='fl'>
                <Input placeholder="please enter..." style={{marginLeft:'10',width:120}} />
              </div>
            </Col>
            <Col span="8">
               <Select defaultValue="0" style={{ width: 120 }} onChange={handleChange}>
                  <Option value="0">全部标签</Option>
                  <Option value="1">一级标签</Option>
                  <Option value="2">二级标签</Option>
                </Select>
            </Col>
            <Col span="8">
             
            </Col>
          </Row>
          <Row className="u-mt-20">
            <Col span="12" style={{ textAlign: 'left' }}>
              <Button type="primary">新增</Button>
            </Col>
            <Col span="12" style={{ textAlign: 'right' }}>
              <Button type="primary">搜索</Button>
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
          record: {},
          visible: false
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      page: pagination.current
    });
  },
  fetch(params = {}) {
    console.log('请求参数：', params,apiConfig.apiHost);
    this.setState({ loading: true });

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.tjApiHost+'/service/report.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = this.state.pagination;
        pagination.total = result.totalPage*pagination.pageSize;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      }
    });
  },
  componentDidMount() {
    this.fetch();
  },

  // 弹出框
  showModal(record) {
    this.setState({
      visible: true,
      record: record
    });
  },
  handleOk() {
    console.log(this.state.record);
    this.setState({
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  },
  handleCancel() {
    console.log('点击了取消');
    this.setState({
      visible: false
    });
  },
  render() {

    let self = this;

  	let columns = [{
  	  title: 'ID',
  	  dataIndex: 'id',
  	}, {
  	  title: '标签名',
  	  dataIndex: 'name',
  	}, {
  	  title: '分级',
  	  dataIndex: 'eventId',
  	}, {
  	  title: '操作',
  	  dataIndex: '',
  	  render(text,record){
  	  	return (
  	  			<a href="javascript:;" onClick={self.showModal.bind(null,record)}>编辑</a>
  	  		)
  	  }
  	}];

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    return (
      <div className="right-container">
        <FormSearch />
        <Table columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange} 
          bordered
          />

          <Modal title="对话框标题"
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}>
            <Row>
              <Col span="4" style={{ textAlign: 'right',paddingTop:'5' }}>
                标签名：
              </Col>
              <Col span="12" style={{ textAlign: 'left' }}>
                <Input  placeholder="小尺寸"  />
              </Col>
            </Row>
            <Row className="u-mt-20">
              <Col span="4" style={{ textAlign: 'right',paddingTop:'5' }}>
                父级：
              </Col>
              <Col span="12" style={{ textAlign: 'left' }}>
                 <Select defaultValue="0" style={{ width: 120 }} onChange={handleChange}>
                    <Option value="0">全部标签</Option>
                    <Option value="1">一级标签</Option>
                    <Option value="2">二级标签</Option>
                  </Select>
              </Col>
            </Row>
          </Modal>
      </div>
    );
  }
});

module.exports = TagIndex;