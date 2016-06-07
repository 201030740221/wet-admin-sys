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
                  <Option value="-1">全部频道</Option>
                  <Option value="1">推荐频道</Option>
                  <Option value="0">非推荐频道</Option>
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
                  className="search_channel"
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
          firstLevelTag: [],
          secondLevelTag: [],
          allTag:[],

          searchtype: -1,
          isrec: -1,
          tagid:-1,
          istag: -1
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
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag,
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
      url: apiConfig.apiHost+'/cms/tag/content/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        //let firstLevelTag = result.data.firstLevelTag;
        let _arr = result.data.tule;
        if(result.data.tule.length>0){
           self.setState({
            loading: false,
            data: result.data.tule,
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
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag
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
    }

  },

  tagClick(chid,tagid){

    let self = this;

    let params = {
      tid: chid,
      tagid: tagid
    }
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/content/add.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {

        let addTag = result.data.addTag;
        let data = self.state.data;
        data.map(function(_item,_key){
          let firstLevelTag = _item.firstLevelTag||[];
          firstLevelTag.map(function(item,key){
            if(+_item.tid==chid){
              if(+item.tagid==tagid){
                item.tagStatus = 'active';
              }else{
                item.tagStatus = '';
              }
            }
          })
          if(+_item.tid==chid){
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
  tagSecondClick(chid,tagid){

    let self = this;

    let params = {
      tid: chid,
      tagid: tagid
    }
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/content/add.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {

        let addTag = result.data.addTag;
        let data = self.state.data;
        data.map(function(_item,_key){
          let secondLevelTag = _item.secondLevelTag||[];
          secondLevelTag.map(function(item,key){
            if(+_item.tid==chid){
              if(+item.tagid==tagid){
                item.tagStatus = 'active';
              }else{
                item.tagStatus = '';
              }
            }
          })
          if(+_item.tid==chid){
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
  delTag(chid,tagid){

    let self = this;

    let params = {
      tid: chid,
      tagid: tagid
    }
     if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/tag/content/del.php',
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
  							<img src={record.purl} />

  						</div>
  					</Col>
  					<Col span="20">
  						<div className="u-p-10">
  							<Row>
                      <Col span="10" className="">
                        <p className="mt-10">用户：{record.uname}</p>
				                <p className="mt-15">描述：{record.description}</p>
                      </Col>

        	  					<Col span="13" style={{textAlign: 'right'}}>
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
                                  <Tag key={key} closable onClose={self.delTag.bind(null,record.tid,item.tagid)}>{item.name}</Tag>
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
                            <span key={index} className={"tag_list "+_item.tagStatus} onClick={self.tagClick.bind(null,record.tid,_item.tagid)}>{_item.name}</span>
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
                                <span key={index} className={"tag_list "+_item.tagStatus} onClick={self.tagSecondClick.bind(null,record.tid,_item.id)}>{_item.name}</span>
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
          rowKey={record => record.tid}
          />
      </div>
    );
  }
});

module.exports = TagIndex;
