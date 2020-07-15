import React, {Component} from "react";
import {withRouter, Link} from 'react-router-dom'
import './left-nav.css';
import {Layout, Menu} from 'antd';
import './fonts/iconfont.css'
import logo from './images/logo.jpg';
import menuList from './config/navConfig.json';
import PropTypes from 'prop-types'
import {getUser} from '../../../../api/adminApi'
import Pubsub from 'pubsub-js';
import config from "../../../../config/config";
import UpLoadImg from "../../../../components/upLoadImg";

const {SubMenu, Item} = Menu;
const {Sider} = Layout;


class LeftNav extends Component {
    //获取config中的json加入state
    state = {
        menuList,
        account_icon: getUser().account_icon ,
        account_name: getUser().account_name,
    }
    static propTypes = {
        collapsed: PropTypes.bool.isRequired
    };

    componentDidMount() {
        //订阅管理员信息
        Pubsub.subscribe('changeAdminMsg', (msg) => {
            if (msg === 'changeAdminMsg') {
                this.setState({
                    account_icon: getUser().account_icon,
                    account_name: getUser().account_name,
                })
            }
        })
    }

    //根据json初始化侧边栏
    navInit = (menuList) => {

        return menuList.map((menu) => {
            // 取出一级菜单
            if (!menu.children) {
                return (
                    <Item key={menu._key} className='left-nav'>
                        <Link to={menu._key}>
                            <span className={menu.icon} style={this.props.collapsed ? {fontSize: "25px"} : {}}/>
                            <span style={this.props.collapsed ? {display: 'none'} : {}}>{menu.title}</span>
                        </Link>
                    </Item>
                )
            } else {
                return (
                    <SubMenu key={menu._key} title={<span><span className={menu.icon}
                                                                style={this.props.collapsed ? {fontSize: "25px"} : {}}/> <span
                        style={this.props.collapsed ? {display: 'none'} : {}}>{menu.title}</span></span>}>
                        {
                            this.navInit(menu.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    //设置初始展开的 SubMenu
    _defaultOpenKeys = (menuList) => {
        const path = this.props.location.pathname;
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].children) {
                if (menuList[i].children.find(menuchildrenList => path === menuchildrenList._key)) {
                    return menuList[i]._key
                }
            }
        }
        return '';
    }


    render() {
        const {account_icon, account_name} = this.state
        const path = this.props.location.pathname
        //父标签地址 解决/resource/addresource情况下左侧list选择丢失 ?? 突然变了 - -????
        const pPath = path.substr(0,path.indexOf('/',1)) ? path.substr(0,path.indexOf('/',1)) : path;
        const collapsed = this.props.collapsed;
        // console.log(account_icon);
        return (
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className='logo'>
                    <div className="avatar" style={collapsed ? {width: 40, height: 40} : {}}>
                        <img src={account_icon ? config.database_URL + account_icon : logo} alt="头像"/>
                    </div>
                    <h4>{account_name ? account_name : '管理员01'}</h4>
                </div>
                <Menu
                    theme="dark" mode="inline"
                    defaultSelectedKeys={[path]}
                    selectedKeys={[path,pPath]}
                    defaultOpenKeys={[this._defaultOpenKeys(this.state.menuList)]}
                >
                    {
                        this.navInit(this.state.menuList)
                    }
                </Menu>
            </Sider>
        );
    }
}

export default withRouter(LeftNav)