'use strict';

import {Icon, Menu} from 'antd';
const SubMenu = Menu.SubMenu;

let SideBar = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {current: null};
  },
  handleMenu(item) {
    this.context.router.push(item.key);
    this.setState({current: item.key});
  },
  render() {
    let menus = [
      {
        title: '运营中心',
        subMenus: [
          {
            title: '标签功能',
            icon: 'tags-o',
            items: [
              {
                name: '标签管理',
                path: '/tag/index'
              }, {
                name: '用户标签管理',
                path: '/tag/user'
              }, {
                name: '频道标签管理',
                path: '/tag/channel'
              }, {
                name: '内容标签管理',
                path: '/tag/content'
              }
            ]
          },
          {
            title: '内容推荐管理',
            icon: 'folder',
            items: [
              {
                name: '内容推荐筛选',
                path: '/content/index'
              }, {
                name: '用户推荐筛选',
                path: '/content/user'
              }, {
                name: '内容举报管理',
                path: '/content/limit'
              }
            ]
          },
          {
            title: '权限管理',
            icon: 'lock',
            items: [
              {
                name: '账号列表',
                path: '/permission/index'
              }
            ]
          },
        ]
      }
    ];
    return (
      <aside className="aside-container">
        {menus.map(function (menu, index) {
          return (
            <div key={'menu-' + index}>
              <h4 className="aside-title">{menu.title}</h4>
              <Menu mode="inline"
                    onClick={this.handleMenu}
                    selectedKeys={[this.state.current]}
                    defaultOpenKeys={['sub-menu-0']}
                    >
                {menu.subMenus.map(function (subMenu, subIndex) {
                  return (
                    <SubMenu key={'sub-menu-' + subIndex} title={<span><Icon type={subMenu.icon}/>{subMenu.title}</span>}>
                      {subMenu.items.map(function (item) {
                        return <Menu.Item key={item.path}>{item.name}</Menu.Item>;
                      })}
                    </SubMenu>
                  );
                })}
              </Menu>
            </div>
          );
        }.bind(this))}
      </aside>
    );
  }
});

module.exports = SideBar;
