import React from 'react'
import {Card, Form, Input, Button, Upload, message} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {getUser, saveUser} from '../../../api/adminApi'
import EditPassword from './editpassword';
import {uploadImgIcon} from '../../../api/adminApi';
import config from "../../../config/config";
import PubSub from 'pubsub-js'
import UpLoadImg from "../../../components/upLoadImg";

export default class AccountSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            account_newIcon: false,
            visible: false,
            account: '',
            account_name: '',
            account_icon: '',
            token: '',
        }

        this.fromRef = React.createRef()
    }

    componentDidMount() {
        this.setState({
            account: getUser().account,
            account_name: getUser().account_name,
            account_icon: getUser().account_icon,
            token: getUser().token,
        }, () => {
            this.fromRef.current.setFieldsValue({
                account: this.state.account,
                account_name: this.state.account_name,
            })
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };


    //上传头像格式和大小的验证
    // beforeUpload(file) {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('上传格式错误,支持JPG/PNG格式!');
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('请上传小于2MB的图片!');
    //     }
    //     return isJpgOrPng && isLt2M;
    // }


    // handleChange = info => {
    //     console.log(info);
    //     if (info.file.status === 'uploading') {
    //         this.setState({loading: true});
    //         return;
    //     }
    //     if (info.file.status === 'done' && info.file.response.status === 1) {
    //         message.success('头像上传成功');
    //         const name = info.file.response.data.name
    //         const url = config.database_URL;
    //         this.setState({
    //             loading: false,
    //             account_icon: url + name,
    //         });
    //
    //     }
    // };

    render() {
        const layout = {
            wrapperCol: {span: 8},
        };


        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div className="ant-upload-text">上传头像</div>
            </div>
        );

        const onFinish = values => {

            const {token, account_icon} = this.state;
            // 调用修改管理员信息接口
            uploadImgIcon(token, values.account_name, account_icon).then((result) => {
                if (result && result.status === 1) {
                    // 更新管理员信息
                    saveUser(result.data);
                    message.success(result.msg);
                    // 告知外界管理员信息修改成功
                    PubSub.publish('changeAdminMsg', {})
                }
            }).catch((error) => {
                message.error('管理员信息修改失败!')
            });
        };


        return (
            <Card title="个人账户设置">
                <Form
                    ref={this.fromRef}
                    {...layout}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="您的账号名"
                        name="account"
                    >
                        <Input value='asd' disabled/>
                    </Form.Item>

                    <Form.Item
                        label="账号名称"
                        name="account_name"
                        rules={[{required: true, message: '账户名不能为空!'}]}
                    >
                        <Input placeholder='请输入管理员名称'/>
                    </Form.Item>

                    <Form.Item name="account_icon" label="管理员头像">

                        <UpLoadImg
                            img_icon={this.state.account_icon}
                            imgAlt={'头像图片'}
                            imgName={'admin_avatar'}
                            upLoadCallBack={(name) => {
                                this.setState({
                                    account_icon: name
                                })
                            }}
                            upLoadAction="/api/auth/admin/upload_admin_icon"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;或者&nbsp;&nbsp;<a onClick={this.showModal}>修改密码</a>
                    </Form.Item>
                </Form>
                <EditPassword visible={this.state.visible} handleCancel={this.handleCancel} handleOK={this.handleOk}/>

            </Card>
        )
    }
}