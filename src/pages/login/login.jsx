import React, {Component} from 'react'
import {connect} from 'react-redux'
import xl from './images/xiaoliao.png'
import md5 from 'blueimp-md5';

import {Form, Input, Button, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

import './css/login.css'
import {checkLogin,saveUser} from '../../api/adminApi'
import config from './../../config/config';



class Login extends Component {

    render() {
        const onFinish = values => {
            //console.log('表单提交的数据: ', values);
            const md5_pwd = md5(values.password, config.key)
            checkLogin(values.account, md5_pwd).then((result) => {
                if(result && result.status === 1){
                    message.success(result.msg);
                    saveUser(result.data);
                    this.props.history.replace('/');
                }else if(result && result.status === 0){
                    alert('尊敬的面试官您好!客户端的地址为: 47.93.12.59:3000 \n此项目已连通数据库,由于个人无法随时对数据库回滚,为了其他人的体验,请您不要做修改密码、大量删除数据等行为- -十分感谢您的支持！\n账号:admin\n密码:321')
                    //message.warning('登录失败,账号或密码错误!');
                }else{
                    message.error('网络出现一点小错误,接受不到json')
                }
            }).catch((err) => {
                message.error('服务器错误!')
            })
        };

        return (
            <div className="login">
                <div className="login-wrap">
                    {/*头像*/}
                    <div className="avatar">
                        <img src={xl} alt=""/>
                    </div>
                    <div className="content">
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="account"
                                rules={[{required: true, message: '账户名不能为空!'}]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="请输入账户名"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{required: true, message: '密码不能为空!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="请输入密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(Login);