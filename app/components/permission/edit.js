import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Popconfirm,Popover,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;
var Tree = antd.Tree;
var TreeNode = Tree.TreeNode;


var RoleEdit = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {source: {}, checkedKeys: []};
  },
  componentDidMount: function () {

    let self = this;
    let id = this.props.params.id;

    if (id !== 'create') {
      webapi.privilege.getRolesDetail(+ id, {}).then(function (res) {
        if (res && !res.code) {
          SP.message.success('获取数据成功');
          self.setState({source: res.data});

          let checkedKeys = self.state.checkedKeys;
          let _data = res.data;
          let _group = _data.resource_group || [];

          _group.forEach(function (item, index) {

            item.resources = item.resources || [];
            item.resources.forEach(function (_item, _index) {
              if (_item.role_has_privilege) {
                checkedKeys.push('node-' + _item.id);
              }
            });

          });

          self.setState({checkedKeys: checkedKeys});

        } else {
          SP.message.error(res.msg);
        }
      });
    }
    if (id === 'create') {
      webapi.privilege.getRoleResources({}).then(function (res) {
        if (res && !res.code) {
          SP.message.success('获取权限列表成功');
          self.setState({
            source: {
              resource_group: res.data
            }
          });
        } else {
          SP.message.error(res.msg);
        }
      });
    }
  },

  /*input 或 textarea change*/
  changHandle: function (e) {

    let val = e.target.value,
      index = e.target.id;
    let source = this.state.source;

    source[index] = val;

    this.setState({source: source});

  },
  handleCheck(info) {

    let self = this;

    let checkedKeys = this.state.checkedKeys;
    let _key = info.node.props.eventKey;
    var index = checkedKeys.indexOf(_key);

    let _is_tree = info.node.props.eventKey;
    let _ind = _is_tree.indexOf('tree');

    if (_ind > -1) {
      let _s_arr = _is_tree.split('-');

      let _data = self.state.source;
      let _group = _data.resource_group || [];

      _group.forEach(function (item, index) {
        if (item.id === _s_arr[1]) {

          item.resources = item.resources || [];
          /*判断是否全选*/
          let _log = true;
          item.resources.forEach(function (_t_item, _t_index) {
            if (!_t_item.role_has_privilege) {
              _log = false;
            }
          });
          console.log(_log, '9999');

          item.resources.forEach(function (_item, _index) {
            let _s_index = checkedKeys.indexOf('node-' + _item.id);
            if (_log) {
              if (_s_index > -1) {
                checkedKeys.splice(_s_index, 1);
              }
            } else {
              if (_s_index = -1) {
                checkedKeys.push('node-' + _item.id);
              }
            }
            _item.role_has_privilege = !_log;

          });
        }

      });

    } else {
      if (index > -1) {
        checkedKeys.splice(index, 1);
      } else {
        checkedKeys.push(_key);
      }
    }

    this.setState({checkedKeys: checkedKeys});
  },

  getTreeNode: function (_item) {

    let self = this;
    let this_node = null;

    let treeNodeArr = _item.resources || [];

    if (treeNodeArr.length > 0) {

      this_node = treeNodeArr.map(function (item, index) {

        return (
          <TreeNode title={item.name} key={'node-' + item.id}></TreeNode>
        );
      });

    }
    return (
      <TreeNode title={_item.name} key={'tree-' + _item.id}>
        {this_node}
      </TreeNode>
    );
  },

  saveHandle: function () {

    let self = this;
    var source = this.state.source;
    let checkedKeys = this.state.checkedKeys;
    let ids_arr = [];
    checkedKeys.forEach(function (item, index) {
      let str_arr = item.split('-');
      ids_arr.push(str_arr[1]);
    });
    let id = self.props.params.id;
    let data = {
      name: source.name,
      remark: source.remark,
      resource_ids: ids_arr
    };

    if (id !== 'create') {
      webapi.privilege.updatePrivilegeRoles(+ id, data).then(function (res) {
        if (res && !res.code) {
          SP.message.success('更新数据成功');
        } else {
          SP.message.error(res.msg);
        }
      });
    }
    if (id === 'create') {
      webapi.privilege.addPrivilegeRoles(data).then(function (res) {
        if (res && !res.code) {
          SP.message.success('添加数据成功');
          self.context.router.push('/privilege/roles');
        } else {
          SP.message.error(res.msg);
        }
      });
    }

  },

  render: function () {

    let self = this;
    var source = this.state.source;
    source.resource_group = source.resource_group || [];

    return (
      <div className="ant-form-horizontal">
        <h3>角色信息</h3>
        <h4 className="ant-form-item">
          <label htmlFor="title" className="col-2" required={true}>角色名称：</label>
          <div className="col-14">
            <textarea className="ant-input" id="name" placeholder="" value={source.name} onChange={self.changHandle}></textarea>
          </div>
        </h4>
        <h4 className="ant-form-item">
          <label htmlFor="dec" className="col-2">角色描述：</label>
          <div className="col-14">
            <textarea className="ant-input" id="remark" placeholder="" value={source.remark} onChange={self.changHandle}></textarea>
          </div>
        </h4>
        <h3>权限列表</h3>
        <div className="ant-form-item">
          <label htmlFor="dec" className="col-1"></label>
          <div className="col-14">
            {source.resource_group.map(function (item) {

              item.resources = item.resources || [];

              return (

                <Tree
                  defaultExpandAll={true}
                  checkable={true}
                  key={'tree-' + item.id}
                  onCheck={self.handleCheck}
                  checkedKeys={self.state.checkedKeys}
                  multiple={true}>
                  {self.getTreeNode(item)
                  }
                </Tree>
              );
            })
          }
          </div>
        </div>

        <div className='u-mt-30' style={{
          textAlign: 'center'
        }}>
          <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={self.saveHandle}>保存</button>
        </div>

      </div>
    );
  }
});

module.exports = RoleEdit;
