import React, {Component} from "react";
import './right-header.css';
import {Layout, Button,message,Modal} from 'antd';
import propTypes from 'proptypes'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ExclamationCircleOutlined,

} from '@ant-design/icons';
import {withRouter} from 'react-router-dom'

import Ajax from "../../../../api";
import {checkLogout,removeUser} from '../../../../api/adminApi'
import {getWebSiteMsg} from '../../../../api/homeApi'
import './right-header.css'
import PropTypes from "prop-types";
import ajax from "../../../../api";

const { confirm } = Modal
const {Header} = Layout;


class RightHeader extends Component {
    static propTypes = {
        collapsed:PropTypes.bool,
        toggle:PropTypes.func
    }

    state = {
        picURL:'',
        notice:'',
        city:'',
        web_site_msg:[],

    }

    constructor() {
        super();

    }

    componentDidMount() {
        this._weather()
        getWebSiteMsg().then((result)=>{
            this.setState({
                web_site_msg:result.data[0]
            })
        })
    }


    _weather(){
        //获取城市
        Ajax('/baidu/location/ip?ak=yYYPAzeYP1VNtEdaCqgz6mPhGdWbrfE2&coor=bd09ll').then((resolve)=>{
            const city =  resolve.content.address
            const KEY = 'KnHVOML3NCoHEjn8SsDESlKnGsexhhr7';
            const url = `/baidu_api/weather?location=${city}&output=json&ak=${KEY}`;
            Ajax(url).then((data)=>{
                if(data.error === 0){
                    // onClick={()=> this.props.history.push({pathname:'/login'})}
                    let result = data.results[0].weather_data[0];
                    //console.log(result);
                    let picURL = result.nightPictureUrl;
                    let notice = result.weather + '  ' + result.temperature;
                    // 更新状态
                    this.setState({
                        picURL,
                        notice,
                        city
                    });

                }
            }).catch((error)=>{
                console.log(error);
                message.error('网络异常:' + error)
            });
        })
    }

    _logout(){
        confirm({
            title: '确定要退出吗?',
            icon: <ExclamationCircleOutlined />,
            content: '请先保存已编辑的数据，退出后为保存的数据可能会被清空！',
            okText: '确定',
            cancelText:'取消',
            onOk:()=> {
                //checkLogout 等于执行ajax请求退出接口 获得值为1时成功
                checkLogout().then((result)=>{
                    if(result.status === 1){
                        message.success('退出登录成功!');
                        //删除本地缓存
                        removeUser()
                        this.props.history.replace('/login')
                    }else {
                        message.error('退出失败,您以处于退出状态,服务器status=0!')
                    }
                }).catch((err)=>{
                    message.error('退出时服务器发生错误!')
                })
            },
            onCancel() {},
        });
    }

    render() {
        const {collapsed,toggle} = this.props
        const {web_site_msg}= this.state
        return (
            <Header className="header" style={{padding: 0}}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: ()=>{toggle()},
                })}
                <div className='header-content'>
                    <span className='header-title'>{web_site_msg.site_name}</span>

                    <div className="header-right">
                        <span className='pr10'>{this.state.city}</span>
                        <img className='pr10' src={this.state.picURL} alt=""/>
                        <span className='pr100'>{this.state.notice}</span>
                        <Button type='danger' className='header-button' onClick={()=>{this._logout()}}>退出</Button>
                    </div>
                </div>
            </Header>
        );
    }
}

export default withRouter(RightHeader)