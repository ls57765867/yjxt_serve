import React from 'react'
import {Button, Card, Divider, message, Modal, notification, Switch, Table} from "antd";
import {getUserMember} from '../../../api/adminApi'
import config from "../../../config/config";

export default class MemberCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_list:[],
            user_list_count:0,
        }
    }
    componentDidMount() {
        this.loadListData()
    }

    loadListData(){
        getUserMember().then((result)=>{
            this.setState({
                user_list:result.data.user_list,
                user_list_count:result.data.user_list_count,
            })
        })
    }


    columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 50, align: 'center'},
        {title: '用户名称', dataIndex: 'user_name', key: 'user_name', align: 'center'},
        {title: '用户手机号', dataIndex: 'user_phone', key: 'user_phone', align: 'center'},
        {title: '用户余额', dataIndex: 'user_count_money', key: 'user_count_money', align: 'center'},
        {
            title: '用户头像', dataIndex: 'user_icon', key: 'user_icon', align: 'center',
            render: (text, record) => {
                return (
                    record.user_icon ? <img src={config.database_URL + record.user_icon} alt="人生封面" width={100}/> : <span>用户没有上传头像</span>
                )
            }
        }
    ];

    render() {
        const {user_list,user_list_count}= this.state
        return (
            <Card title={"会员统计"}>
                <Table
                    columns={this.columns}
                    dataSource={user_list}
                    rowKey={"id"}
                    pagination={{
                        total: user_list_count,
                        pageSize: 6,
                    }}
                />
            </Card>
        )
    }
}