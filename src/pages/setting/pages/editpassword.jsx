import React from 'react'
import {Modal, Form, Input, Button, message,} from 'antd'
import {saveUser, uploadImgIcon, changeAdminPwd, getUser, removeUser} from "../../../api/adminApi";
import PubSub from "pubsub-js";
import md5 from 'blueimp-md5';
import config from "../../../config/config";
import {withRouter} from 'react-router-dom'


 class EditPassword extends React.Component {


    render() {
        const layout = {
            labelCol: {span: 0},
            wrapperCol: {span: 16},
        };

        const onFinish = values => {
            //判断两次输入密码是否相同
            if (values.new_password !== values.temp_password) {
                return message.warning('两次输入的密码不一致!')
            }
            const old_password = md5(values.old_password, config.key);
            const new_password = md5(values.new_password, config.key);
            const token = getUser().token;
            changeAdminPwd(token, old_password, new_password).then((result) => {
                if (result && result.status === 1) {
                    message.success(result.msg)
                    removeUser();
                    this.props.history.replace('/login');
                } else if (result && result.status === 0){
                    message.error(result.msg)
                }else {
                    message.error('服务器内部错误!')
                }
            }).catch((err) => {
                message.error(err)
            })
            // message.warning('别闹')
        };


        return (
            <Modal
                title="修改密码"
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                footer={null}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="请输入要修改的密码"
                        name="old_password"
                        rules={[{required: true, message: '请输入旧的密码!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        label="请输入要修改的密码"
                        name="new_password"
                        rules={[{required: true, message: '请输入新的密码!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        label="请再次输入修改密码"
                        name="temp_password"
                        rules={[{required: true, message: '请再次输入密码!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default withRouter(EditPassword);