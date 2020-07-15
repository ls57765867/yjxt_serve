import React from 'react'
import {Card, Form, Input, Select, Upload, message, Button} from 'antd'
import {InboxOutlined} from '@ant-design/icons';
import UpLoadImg from "../../../components/upLoadImg";
import {getResourceCategory,getResourceClasses,getResourceArea,getResourceFormat,getResourceMeta,addResource} from '../../../api/resourceApi'
import Moment from "moment";
import {getUser} from "../../../api/adminApi";

const {Option} = Select;


export default class AddResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            focusImgUrl:'',
            dragFileList: [], // 存放上传的文件
            resource_classes: [],
            resource_meta: [],
            resource_format: [],
            resource_category: [],
            resource_area: [],
        }
    }

    componentDidMount() {
        getResourceClasses().then((result) => {
            console.log(result);
            if (result && result.status === 1) {
                this.setState({
                    resource_classes: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceArea().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_area: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceCategory().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_category: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceFormat().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_format: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceMeta().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_meta: result.data
                },()=>{
                    console.log(this.state.resource_meta);
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 2}
            },
            wrapperCol: {
                xs: {span: 12}
            },
        };

        const {resource_category,resource_classes,resource_meta,resource_format,resource_area} = this.state;

        const onFinish = values => {
            const {imageUrl, focusImgUrl, dragFileList} = this.state;
            if(!imageUrl){
                message.warning('请上传资源封面!');
                return;
            }

            // 1. 生成创建日期
            const resource_publish_time = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');


            // 2. 上传资源
            /*
              token, resource_name, resource_author, resource_publish_time, resource_content, resource_category_id, resource_classes_id, resource_area_id, resource_meta_id, resource_format_id, resource_img, resource_price,  focusImgUrl
            */
            addResource(getUser().token, values.resource_name, values.resource_author, resource_publish_time, dragFileList, values.resource_category_id, values.resource_classes_id, values.resource_area_id,values.resource_meta_id, values.resource_format_id, imageUrl, values.resource_price,  focusImgUrl).then((result)=>{
                if(result && result.status === 1){
                    message.success(result.msg);
                    this.props.history.goBack();
                }
            }).catch(()=>{
                message.error('添加直播课失败!');
            })
        };

        return (
            <Card title="新增幼教资源">
                <Form  {...formItemLayout} onFinish={onFinish}>
                    <Form.Item
                        label={"资源名称"}
                        name="resource_name"
                        rules={[{required: true, message: '请输入资源名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={"资源作者"}
                        name="resource_author"
                        rules={[{required: true, message: '请输入作者姓名!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="所属分类"
                        name="resource_category_id"
                        rules={[{required: true, message: '请选择所属分类!'}]}
                    >
                        <Select placeholder={"请选择学前所属分类"} style={{width: 200}}>
                            {
                                resource_category && resource_category.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.category_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所属班级"
                        name="resource_classes_id"
                        rules={[{required: true, message: '请选择所属班级!'}]}
                    >
                        <Select placeholder={"请选择所属班级"} style={{width: 90}}>

                            {
                                resource_classes && resource_classes.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.classes_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所属领域"
                        name="resource_area_id"
                        rules={[{required: true, message: '请选择所属领域!'}]}
                    >
                        <Select placeholder={"请选择所属领域"} style={{width: 90}}>
                            {
                                resource_area && resource_area.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.area_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="素材选择"
                        name="resource_meta_id"
                        rules={[{required: true, message: '请选择素材!'}]}
                    >
                        <Select  placeholder={"请选择素材"} style={{width: 120}}>
                            {
                                resource_meta && resource_meta.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.mate_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="素材格式"
                        name="resource_format_id"
                        rules={[{required: true, message: '请选择素材格式!'}]}
                    >
                        <Select placeholder={"请选择素材格式"} style={{width: 120}}>
                            {
                                resource_format && resource_format.map((item, index) => {
                                    return <Option value={item.id} key={item.id}>{item.format_name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"资源价格"}
                        name="resource_price"
                        rules={[{required: true, message: '请输入资源的价格!'}]}
                    >
                        <Input style={{width: 120}}/>
                    </Form.Item>

                    <Form.Item
                        label={"资源封面图"}
                        name="resource_img"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传资源封面"}
                            imgName={"resource_upload_img"}
                            upLoadAction={"/api/auth/resource/upload_resource"}
                            upLoadCallBack={(imgUrl) => {
                                message.success('上传成功!');
                                this.setState({
                                    imageUrl:imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"首页轮播图"}
                        name="focusImgUrl"
                    >
                        <UpLoadImg
                            upLoadBtnTitle={"上传资源轮播图"}
                            imgName={"resource_upload_img"}
                            upLoadAction={"/api/auth/resource/upload_resource"}
                            upLoadCallBack={(imgUrl) => {
                                message.success('上传成功!');
                                this.setState({
                                    focusImgUrl:imgUrl
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"幼教资源"}
                        name="resource_content"
                    >
                        <Upload.Dragger
                            name={'resource_file'}
                            multiple={true}
                            action={'/api/auth/resource/upload_many_file'}
                            onChange={(info) => {
                                const {status} = info.file;
                                if (status !== 'uploading') {
                                    // console.log(info.file, info.fileList);
                                }
                                if (status === 'done') {
                                    if (info.file.response && info.file.response.status === 1) {
                                        /*
                                        console.log(`-----------------`);
                                        console.log(info.file.response.data);
                                        console.log(`-----------------`);
                                        */

                                        let tempArr = this.state.dragFileList;
                                        tempArr.push(info.file.response.data);
                                        this.setState({
                                            dragFileList: tempArr
                                        }, () => {
                                            console.log(this.state.dragFileList);
                                        })
                                    }
                                    message.success(`${info.file.name} 文件上传成功!`);
                                } else if (status === 'error') {
                                    message.error(`${info.file.name} 文件上传失败!`);
                                }
                            }}
                            onRemove={(file) => {
                                console.log(file);
                                let tempArr = this.state.dragFileList;
                                let newTempArr = [];
                                for (let i = 0; i < tempArr.length; i++) {
                                    if (tempArr[i].uid !== file.response.data.uid) {
                                        newTempArr.push(tempArr[i]);
                                    }
                                }
                                // 更新状态
                                this.setState({
                                    dragFileList: newTempArr
                                }, () => {
                                    console.log(this.state.dragFileList);
                                })
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">单击或者拖到文件到此区域上传</p>
                            <p className="ant-upload-hint">支持单个或多上文件上传</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 16}}
                    >
                        <div style={{textAlign: ' center', marginTop: 30}}>
                            <Button type={"primary"} htmlType={'submit'} style={{marginRight: 15}}>保存</Button>
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