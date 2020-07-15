import React, {Component} from "react"
import {Card, Form, Input, Select, message, Button, DatePicker} from 'antd'
import Moment from 'moment'

import UpLoadImg from './../../../components/upLoadImg'
import {editLive, getLivePerson, getLiveTheme} from '../../../api/liveApi'
import {getUser} from '../../../api/adminApi'

const {RangePicker} = DatePicker;
const {Option} = Select;


export default class EditLive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            live_img: '', // 资源封面
            focus_img: '', // 轮播图封面
            live_theme: [], // 直播主题数组
            live_person: [], // 直播适用人群数组
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        /*
        focus_img: ""
        id: 3
        is_focus: 0
        live_author: "阿萨"
        live_begin_time: "2020-06-01 22:54:43"
        live_end_time: "2020-08-01 22:54:43"
        live_img: "/upload/images/lives/1592319292267.png"
        live_person_id: 1
        live_person_name: "园长"
        live_price: 19999
        live_theme_id: 2
        live_theme_title: "园所理念"
        live_title: "大厦"
        live_url: "百度"
         */
        if (this.props.location.state.live) {
            const liveItem = this.props.location.state.live;
            if (liveItem) {
                this.formRef.current.setFieldsValue({
                    live_title: liveItem.live_title,
                    live_author: liveItem.live_author,
                    live_price: liveItem.live_price,
                    live_time: [Moment(liveItem.live_begin_time), Moment(liveItem.live_end_time)],
                    live_theme_id: liveItem.live_theme_id,
                    live_person_id: liveItem.live_person_id,
                    live_url: liveItem.live_url,

                })

                this.setState({
                    live_img: liveItem.live_img,
                    focus_img: liveItem.focus_img,
                    live_id: liveItem.id,
                    
                })
            }
        }


        console.log(this.props.location.state);
        // 1. 获取直播适用人群
        getLivePerson().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    live_person: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        // 2. 获取直播主题
        getLiveTheme().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    live_theme: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        })


    }

    formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 12},
    };

    render() {

        const onFinish = values => {
            console.log(values);
            const {live_img, focus_img, live_id} = this.state;
            if (!live_img) {
                message.warning('请上传直播课封面!');
                return;
            }

            // 开始时间和结束时间
            const live_begin_time = Moment(values.live_time[0]).format('YYYY-MM-DD HH:mm:ss');
            const live_end_time = Moment(values.live_time[1]).format('YYYY-MM-DD HH:mm:ss');


            // 调用接口
            // token, live_title, live_url, live_author, live_img, live_begin_time, live_end_time, live_price, live_person_id, live_theme_id, focus_img
            editLive(getUser().token, live_id, values.live_title, values.live_url, values.live_author, live_img, live_begin_time, live_end_time, values.live_price, values.live_person_id, values.live_theme_id, focus_img).then((result) => {
                if (result && result.status === 1) {
                    message.success(result.msg);
                    this.props.history.goBack();
                }
            }).catch(() => {
                message.error('添加直播课失败!');
            })

        };

        const {live_theme, live_person, live_img, focus_img} = this.state;
        return (
            <Card title="新增直播课">
                <Form {...this.formItemLayout} onFinish={onFinish} ref={this.formRef}>
                    <Form.Item
                        label="直播课名称"
                        name="live_title"
                        rules={[{required: true, message: '请输入直播课名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="直播课作者"
                        name="live_author"
                        rules={[{required: true, message: '请输入直播课作者!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="直播课价格"
                        name="live_price"
                        rules={[{required: true, message: '请输入直播课价格!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="直播课时间"
                        name="live_time"
                        rules={[{required: true, message: '请输入直播课时间!'}]}
                    >
                        <RangePicker showTime/>
                    </Form.Item>
                    <Form.Item
                        label="适用人群"
                        name="live_person_id"
                        rules={[{required: true, message: '请选择适用人群!'}]}
                    >
                        <Select placeholder={"请选择适用人群"} style={{width: 150}}>
                            {
                                live_person.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.live_person_name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="内容主题"
                        name="live_theme_id"
                        rules={[{required: true, message: '请选择内容主题!'}]}
                    >
                        <Select placeholder={"请选择内容主题"} style={{width: 150}}>
                            {
                                live_theme.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.live_theme_title}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="直播课地址"
                        name="live_url"
                        rules={[{required: true, message: '请输入直播课地址!'}]}
                    >
                        <Input placeholder="请输入直播课的地址"/>
                    </Form.Item>
                    <Form.Item
                        label="直播课封面图"
                        name="live_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传封面图"}
                            imgName={"live_img"}
                            img_icon={live_img}
                            upLoadAction={"/api/auth/live/upload_live"}
                            upLoadCallBack={(name) => {
                                message.success('直播课程封面上传成功!');
                                this.setState({
                                    live_img: name
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="首页轮播图"
                        name="focus_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传焦点图"}
                            imgName={"live_img"}
                            img_icon={focus_img}
                            upLoadAction={"/api/auth/live/upload_live"}
                            upLoadCallBack={(name) => {
                                message.success('直播课焦点图上传成功!');
                                this.setState({
                                    focus_img: name
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 24}}
                    >
                        <div style={{textAlign: 'center', marginTop: 30}}>
                            <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
                                保存
                            </Button>
                            <Button onClick={() => {
                                this.props.history.goBack()
                            }}>
                                取消
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}