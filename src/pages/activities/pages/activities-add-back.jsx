import React from 'react'
import {Card, Form, Input, Button, DatePicker} from 'antd'
import LikeTag from './../../../components/like-tag'



export default class ActivitiesAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imageUrl: ''
        }
    }


    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 12 }
            },
        };

        return (
            <Card title="新增活动">
                <Form  {...formItemLayout}>
                    <Form.Item
                        label={"活动日期"}
                        name = "job_name"
                        rules={[{ required: true, message: '请输入职场人生名称!' }]}
                    >
                       <DatePicker/>
                       <LikeTag tagsCallBack={()=>{

                       }} />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 16}}
                    >
                        <div style={{textAlign: 'center', marginTop: 30}}>
                            <Button type={"primary"} style={{marginRight: 15}}>保存</Button>
                            <Button onClick={()=>{this.props.history.goBack()}}>取消</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}