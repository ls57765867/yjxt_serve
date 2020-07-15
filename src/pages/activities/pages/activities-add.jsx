import React, {Component} from "react"
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    DatePicker, message
} from 'antd'
import Moment from 'moment';

// 引入日期中国化
import locale from 'antd/es/date-picker/locale/zh_CN';
// 引入富文本编辑器
import RichTextEdit from "./../../../components/rich-text-editor"
// 引入tag选择
import ActivitiesTag from './../../../components/like-tag'
import UpLoadImg from './../../../components/upLoadImg'
import {getActivitiesAddress, getActivitiesBus, getActivitiesObject,addActivities} from '../../../api/activitiesApi'
import {getUser} from "../../../api/adminApi";


const {Option} = Select;


export default class AddActivities extends Component {

    constructor(props) {
        super(props);
        this.activities_intro_ref = React.createRef();
        this.activities_trip_ref = React.createRef();
        this.activities_days_ref = React.createRef();
        this.activities_notice_ref = React.createRef();


        this.state = {
            imageUrl: '', // 资源封面
            focusImgUrl: '', // 轮播图封面

            activities_bus: [], //
            activities_object: [], //
            activities_address: [], //
            activities_tag:[],
        }
    }

    componentDidMount() {

        getActivitiesAddress().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    activities_address: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getActivitiesBus().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    activities_bus: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getActivitiesObject().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    activities_object: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }


    formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 12},
    };

    render() {
        const {activities_address, activities_bus, activities_object} = this.state;

        const onFinish = values => {
            // console.log(111);
            const {imageUrl, focusImgUrl, activities_tag} = this.state;
            if(!imageUrl){
                message.warning('请上传活动封面!');
                return;
            }

            // 1. 活动时间
            const activities_time = Moment(values.activities_time).format('YYYY-MM-DD HH:mm:ss');

            // 2. 处理活动的tag ['海上', '天上'] ---> 海上,天上
            let tagStr = activities_tag.join(',');


            //  3. 获取各个富文本输入框中的内容
            let activities_intro = this.activities_intro_ref.current.getContent();
            let activities_trip = this.activities_trip_ref.current.getContent();
            let activities_days = this.activities_days_ref.current.getContent();
            let activities_notice = this.activities_notice_ref.current.getContent();

            // 4. 调用接口
            /*
               token, activities_name, activities_time, activities_img, activities_price, activities_tag, activities_address_id, activities_object_id, activities_bus_day_id, activities_intro, activities_trip, activities_days, activities_notice, focus_img
            */
            addActivities(getUser().token, values.activities_name, activities_time, imageUrl, values.activities_price, tagStr, values.activities_address_id, values.activities_object_id, values.activities_bus_day_id, activities_intro, activities_trip, activities_days, activities_notice, focusImgUrl).then((result)=>{
                if(result && result.status === 1){
                    message.success(result.msg);
                    this.props.history.goBack();
                }
            }).catch(()=>{
                message.error('添加活动失败!');
            })

        };



        return (
            <Card title="新增活动">
                <Form {...this.formItemLayout} onFinish={onFinish}>
                    <Form.Item
                        label="活动标题"
                        name="activities_name"
                        rules={[{required: true, message: '请输入活动标题!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="activities_time"
                        label="活动日期"
                        rules={[{type: 'object', required: true, message: '请选择活动时间!'}]}
                    >
                        <DatePicker placeholder="请选择日期" locale={locale}/>
                    </Form.Item>
                    <Form.Item
                        label="活动价格"
                        name="activities_price"
                        rules={[{required: true, message: '请输入活动的价格!'}]}
                        wrapperCol={{span: 6}}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="活动地点"
                        name="activities_address_id"
                        rules={[{required: true, message: '请选择活动地点!'}]}
                        wrapperCol={{span: 6}}
                    >
                        <Select placeholder="请选择活动地点">
                            {
                                activities_address && activities_address.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.activities_address}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="招生对象"
                        name="activities_object_id"
                        rules={[{required: true, message: '请选择招生对象!'}]}
                        wrapperCol={{span: 6}}
                    >
                        <Select placeholder="请选择招生对象!">
                            {
                                activities_object && activities_object.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.activities_object}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="选择营期"
                        name="activities_bus_day_id"
                        rules={[{required: true, message: '请选择营期!'}]}
                        wrapperCol={{span: 6}}
                    >
                        <Select placeholder="请选择营期!">
                            {
                                activities_bus && activities_bus.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.activities_bus_day}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="添加活动标签"
                        name="activities_tag"
                    >
                        <ActivitiesTag tagsCallBack={(tags) => {
                            this.setState({
                                activities_tag:tags
                            })
                        }}/>
                    </Form.Item>
                    <Form.Item
                        label="活动封面图"
                        name="activities_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传活动封面"}
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            upLoadCallBack={(imgUrl) => {
                                message.success('上传成功!');
                                this.setState({
                                    imageUrl:imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="首页轮播图"
                        name="focus_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传首页轮播图"}
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            upLoadCallBack={(imgUrl) => {
                                this.setState({
                                    focusImgUrl:imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="活动介绍"
                        name="activities_intro"
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEdit
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            ref={this.activities_intro_ref}
                        />
                    </Form.Item>
                    <Form.Item
                        label="行程安排"
                        name="activities_trip"
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEdit
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            ref={this.activities_trip_ref}
                        />
                    </Form.Item>
                    <Form.Item
                        label="开营日期"
                        name="activities_days"
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEdit
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            ref={this.activities_days_ref}
                        />
                    </Form.Item>
                    <Form.Item
                        label="报名须知"
                        name="activities_notice"
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEdit
                            imgName={"activities_img"}
                            upLoadAction={"/api/auth/activities/upload_activities"}
                            ref={this.activities_notice_ref}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{span: 24}}
                    >
                        <div style={{textAlign: 'center'}}>
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