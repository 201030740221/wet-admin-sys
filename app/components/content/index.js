import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Pagination } from 'antd';
const FormItem = Form.Item;

/*import BaseForm from '../common/base-form';*/

var FormSearch = React.createClass({
  getInitialState: function () {
        return {
         type: 0,
         content: 0,
         channel: 0
        };
  },
  search(){
    if(this.props.onSearch){
      this.props.onSearch();
    }
  },
  handleChange(which,val){
    let self = this;
    switch(which){
      case 'search_type':
          this.setState({
            type: val
          })
          break;
      case 'search_content':
          this.setState({
            content: val
          })
          break;
      case 'search_channel':
          this.setState({
            channel: val
          })
          break;
    }

    if(this.props.changeHandle){
      this.props.changeHandle(which,val);
    }
  },
  render(){
    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="12">
              <div span="12" className='fl'>
               <Select
                  className="search_type"
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_type')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">搜索类型</Option>
                  <Option value="1">用户昵称</Option>
                  <Option value="2">频道名</Option>
                  <Option value="3">内容ID</Option>
                  <Option value="4">用户ID</Option>
                  <Option value="5">频道ID</Option>
                </Select>
              </div>
              <div span="12" className='fl'>
                <Input className="search_input" placeholder="please enter..." style={{marginLeft:'10'}} />
              </div>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  className="search_content"
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_content')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">全部内容类型</Option>
                  <Option value="1">图乐</Option>
                  <Option value="2">音频图乐</Option>
                  <Option value="7">影片</Option>
                  <Option value="8">原创视频</Option>
                </Select>
            </Col>
             <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  className="search_channel"
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_channel')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">全部频道</Option>
                  <Option value="0">不限频道</Option>
                  <Option value="1">频道内容</Option>
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
          first_id: null,
          last_id: null,
          current_page: 1,
          type: -1,
          content: -1,
          channel:-1,
		      loading: true,
          record: {},
          visible: false,
        };
  },
   componentDidMount() {

    let self = this;
    console.log(this.props);
    let params = this.props.params;
    if(params){
       this.fetch({searchtype: params.typeId , searchtext: params.userId,type:1});
    }else{
      this.fetch();
    }

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
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  },
 timeHandle(_date){
    //计算出相差天数
    var days=Math.floor(_date/(24*3600*1000))

    //计算出小时数
    var leave1=_date%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))

    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    if(days>0){
      return days+'天';
    }
    if(hours>0){
      return hours+'小时';
    }
    if(minutes>0){
      return minutes+'分';
    }
    if(seconds>0){
      return seconds+'秒';
    }

  },
  pageNav(which){

    let tid , _page;
    let current_page = this.state.current_page;

    if(which=='prev'){
      tid = this.state.first_id;
      _page = 'pre';
      if(current_page==1){
        message.warn('已经是第一页了');
        return;
      }
    }else{
      tid = this.state.last_id;
      _page = 'next';
    }

    let _val = $('.search_input').val();
    let searchtype = this.state.type,
        searchtext = _val,
        mtype = this.state.content,
        channel = this.state.channel;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      mtype: +mtype,
      channel: +channel,
      index: current_page,
      page:_page,
      tid: tid
    }
    this.fetch(_parmas);
  },
  fetch(params = {}) {

    let self = this;
    let _data = [];

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    this.setState({ loading: true });
    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/content/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        console.log(result);

        _data = result.data;

        _data.forEach(function(_item,_key){
          _item.class_more = 'hidden';
          _item.recommend_class = 'shown';
          _item.has_recommend_class = 'hidden'
        })

        if(_data.length>0){
           self.setState({
            loading: false,
            data: _data,
            current_page: result.pageIndex,
            first_id: _data[0].tid||'',
            last_id: _data[_data.length-1].tid||''
          });
        }else{
           self.setState({
            loading: false,
            data: _data,
            current_page: result.pageIndex,
          });
        }


      }
    });
  },

  onSearch(){
    let _val = $('.search_input').val();
    let searchtype = this.state.type,
        searchtext = _val,
        mtype = this.state.content,
        channel = this.state.channel;
    let _parmas = {
      searchtype: +searchtype||0,
      searchtext: searchtext||null,
      mtype: +mtype||0,
      channel: +channel||0
    }
    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'search_type':
          this.setState({
            type: val
          })
          break;
      case 'search_content':
          this.setState({
            content: val
          })
          break;
      case 'search_channel':
          this.setState({
            channel: val
          })
          break;
    }

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

  playContent(_item,_key){
    if(_item.mtype=='2'){
       let _audio = $('#_audio'+_key);
       let this_audio = document.getElementById('_audio'+_key);
       if($(_audio).hasClass('on')){

         this_audio.pause();
        $(_audio).removeClass('on');
        $(_audio).siblings('.btn').text('播放');

       }else{
          this_audio.play();
          $(_audio).addClass('on');
          $(_audio).siblings('.btn').text('暂停');
       }
    }

    if(_item.mtype=='7'||_item.mtype=='8'){
      this.showModal(_item.attach.url);
    }
  },

  TagSection(_item,_key){

    let self = this;
    let tagSection = '';

    if(_item.mtype=='1'){
      tagSection = (
        <div className="tag_show">
          <span className="small_btn">{_item.attach.ischangeimg==1?'可改图':'不可改图'}</span>
        </div>
      );
    }else{
      if(_item.mtype=='2'){
        tagSection = (
            <div className="">
               <div className="play_btn_section">
                  <div className="btn" onClick={self.playContent.bind(null,_item,_key)}>播放</div>
                  <div className="play_type">音频</div>
                  <audio src={_item.attach.url} id={"_audio"+_key} className="_audio"></audio>
                </div>
            </div>
          )
      }
      if(_item.mtype=='7'){
        tagSection = (
            <div className="">
               <div className="play_btn_section">
                  <div className="btn" onClick={self.playContent.bind(null,_item,_key)}>播放</div>
                  <div className="play_type">影片</div>
                </div>
            </div>
          )
      }
      if(_item.mtype=='8'){
        tagSection = (
          <div className="">
             <div className="play_btn_section">
                <div className="btn" onClick={self.playContent.bind(null,_item,_key)}>播放</div>
                <div className="play_type">原创视频</div>
              </div>
              <div className="tag_show">
                <span className="small_btn">{_item.attach.iscopy==1?'可翻拍':'不可翻拍'}</span>
              </div>
          </div>
        )
      }
    }


    return tagSection;

  },

  showMore(index){
    let data = this.state.data;
    data.forEach(function(item,key){
      if(key==index){
        if(item.class_more=='shown'){
          item.class_more = 'hidden';
        }else{
          item.class_more = 'shown';
        }

      }
    })

    this.setState({
      data: data
    })
  },

  recommend(_tid,index){

    let self = this;
    let data = this.state.data;
    let _tids = [];
    _tids.push(_tid);
    let _json = JSON.stringify(_tids);

    let params = {tids:_json};
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/content/add.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (res) => {
        message.success('已成功推荐');
        data.forEach(function(item,key){
          if(key==index){
            item.recommend_class='hidden';
            item.has_recommend_class = 'shown';
          }
        })

        self.setState({
          data: data
        })
      }
    });
  },
  delItem(_tid){
    let self = this;
    let data = this.state.data;

    let params = {tid:_tid+''||''};
    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }


    reqwest({
      url: apiConfig.apiHost+'/cms/recommend/content/del.php',
      method: 'post',
      data: params,
      type: 'json',
      success: (res) => {
        message.success('已成功删除');
        data.forEach(function(item,index){
            if(item.tid==_tid){
              $('#'+_tid).hide();
              $('#has_recommend'+_tid).show();
              $('#has_recommend'+_tid).text('已删除');

              item.class_more='hidden';
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
  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }

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

    return (
      <div className="right-container">
        <FormSearch
          onSearch={this.onSearch}
          changeHandle={this.changeHandle}
        />

        <div className="content_section">
         {
          data.map(function(item,key){

            let postTime = item.ctime,
                cur_date = new Date().getTime(),
                time_sec = Math.floor(cur_date),
                _date=time_sec-postTime;
            let _time_show = self.timeHandle(_date);

            return (
              <div className="content_list" key={key}>
                <div className="title">
                  <span>频道：{item.chname}</span>
                </div>
                <div className="detail_section">
                  <div className="img_section">
                    <img src={item.purl} />

                    {self.TagSection(item,key)}
                  </div>

                  <Row className="dec">
                    <Col span="12" style={{textAlign:'left'}}>
                      <p><a href="javascript:;" onClick={self.linkTo}>{item.uname}</a></p>
                      <p>{item.likecount}赞</p>
                      <p>{item.commentcount}评论</p>
                    </Col>
                     <Col span="12" style={{textAlign:'right'}}>
                      <p>{_time_show}前</p>
                      <p><span id={item.tid} className={"small_btn "+item.recommend_class} onClick={self.recommend.bind(null,item.tid,key)}>推荐</span></p>
                      <p>
                          <span
                          id={"has_recommend"+item.tid}
                          className={"small_btn recommend_btn "+item.has_recommend_class}>已推荐</span>
                      </p>
                      <div className="more_section p_r">
                        <a href="javascript:;" onClick={self.showMore.bind(null,key)}>更多</a>
                        <div className={"more_content "+item.class_more}>
                          <p><a href="javascript:;" onClick={self.delItem.bind(null,item.tid)}>删除</a></p>
                          <p><a href="javascript:;" onClick={self.linkTo}>添加</a></p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )
          })
         }
        </div>

        <div className="u-mt-20 text_center">
          <span className="" onClick={this.pageNav.bind(null,'prev')} >&lt; 上一页</span>
          <span className="u-ml-20">{this.state.current_page}</span>
          <span className="u-ml-20" onClick={this.pageNav.bind(null,'next')}>下一页 &gt;</span>
        </div>

          <Modal title="视频/影片"
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}>
            <div className="video_play_modal">
              <video src={this.state.record} controls="controls">
              </video>
            </div>
          </Modal>
      </div>
    );
  }
});

module.exports = TagIndex;
