import React from 'react'
import {Card, Form, Input, Select, Button, message} from 'antd'

import UpLoadImg from '../../../components/upLoadImg'
import {getJobPre, getJobFamily, addJob, editJob} from '../../../api/lifejobApi'
import RichTextEdit from "./../../../components/rich-text-editor";
import Moment from "moment";
import {getUser} from '../../../api/adminApi'
import {getObj} from "../../../tools/cache-tools";

const {Option} = Select;

export default class AddEditLife extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '', // 资源封面
            focusImgUrl: '', // 轮播图封面
            job_id: '',
            job_content: '',
            job_pre: [],
            job_family: [],
        }
        this.lifeJob_ref = React.createRef()
        this.lifeJobFrom_ref = React.createRef()
    }

    componentDidMount() {
        if (!this.props.location.state && getObj('life_job_tag') === 'edit') {
            this.props.history.goBack()
        }

        //1.接收之前传递的数据
        if (this.props.location.state) {
            let jobItem = this.props.location.state.job
            if (jobItem) {
                this.lifeJobFrom_ref.current.setFieldsValue(jobItem)
                this.setState({
                    imageUrl: jobItem.job_img, // 资源封面
                    focusImgUrl: jobItem.focus_img, // 轮播图封面
                    job_id: jobItem.id,
                    job_content: jobItem.job_content,
                },()=>{
                    console.log(jobItem);
                })
            }
        }
        getJobPre().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    job_pre: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getJobFamily().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    job_family: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

    }


    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 3}
            },
            wrapperCol: {
                xs: {span: 12}
            },
        };


        const onFinish = values => {
            const {imageUrl, focusImgUrl, job_id} = this.state;
            if (!imageUrl) {
                message.warning('请上传活动封面!');
                return;
            }
            // 1. 活动时间
            const job_time = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            //  2. 获取富文本输入框中的内容
            let job_content = this.lifeJob_ref.current.getContent();

            // 4. 调用接口

            if (job_id) {
                editJob(getUser().token, job_id, values.job_name, imageUrl, values.job_author, job_time, job_content, values.job_pre_edu_id, values.job_family_edu_id, focusImgUrl).then((result) => {
                    if (result && result.status === 1) {
                        message.success(result.msg);
                        this.props.history.goBack();
                    }
                }).catch(() => {
                    message.error('修改人生失败!');
                })
            } else {
                addJob(getUser().token, values.job_name, imageUrl, values.job_author, job_time, job_content, values.job_pre_edu_id, values.job_family_edu_id, focusImgUrl).then((result) => {
                    if (result && result.status === 1) {
                        message.success(result.msg);
                        this.props.history.goBack();
                    }
                }).catch(() => {
                    message.error('添加人生失败!');
                })
            }

        };


        const {job_pre, job_family, imageUrl, focusImgUrl, job_content} = this.state
        return (

            <Card title={getObj('life_job_tag') === 'edit' ? '修改人生资源' : "新增人生资源"}>
                <Form  {...formItemLayout} onFinish={onFinish} ref={this.lifeJobFrom_ref}>
                    <Form.Item
                        label={"人生名称"}
                        name="job_name"
                        rules={[{required: true, message: '请输入职场人生名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={"人生作者"}
                        name="job_author"
                        rules={[{required: true, message: '请输入作者姓名!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="学前所属分类"
                        name="job_pre_edu_id"
                        rules={[{required: true, message: '请选择学前所属分类!'}]}
                    >
                        <Select placeholder={"请选择学前所属分类"} style={{width: 200}}>
                            {
                                job_pre && job_pre.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.pre_edu_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所属家园分类"
                        name="job_family_edu_id"
                        rules={[{required: true, message: '请选择所属家园分类!'}]}
                    >
                        <Select placeholder={"请选择所属家园分类"} style={{width: 200}}>
                            {
                                job_family && job_family.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.job_family_name}</Option>
                                })
                            }

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="人生封面图"
                        name="job_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传封面图"}
                            imgName={"job_img"}
                            img_icon={imageUrl}
                            upLoadAction={"/api/auth/lifejob/upload_life_job"}
                            upLoadCallBack={(imgUrl) => {
                                message.success('上传成功!');
                                this.setState({
                                    imageUrl: imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="焦点图"
                        name="focus_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传焦点图"}
                            imgName={"job_img"}
                            img_icon={focusImgUrl}
                            upLoadAction={"/api/auth/lifejob/upload_life_job"}
                            upLoadCallBack={(imgUrl) => {
                                this.setState({
                                    focusImgUrl: imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="职场人生内容"
                        name="job_content"
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEdit
                            imgName={"job_img"}
                            htmlContent={job_content}
                            upLoadAction={"/api/auth/lifejob/upload_life_job"}
                            ref={this.lifeJob_ref}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 16}}
                    >
                        <div style={{textAlign: 'center', marginTop: 30}}>
                            <Button type={"primary"} htmlType="submit"
                                    style={{marginRight: 15}}>{getObj('life_job_tag') === 'edit' ? '修改' : '添加'}</Button>
                            <Button onClick={() => {
                                this.props.history.goBack()
                            }}>取消</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}