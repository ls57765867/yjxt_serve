import React from 'react'
import {Card, Button, Table, Switch, Divider, Modal, message, notification} from 'antd'
import {getActivitiesList, setFocusActivities, deleteActivities} from "../../../api/activitiesApi";
import config from "../../../config/config";
import {setFocusLive} from "../../../api/liveApi";

export default class ActivitiesList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            resourceList: [],
            totalSize: 0,
            pageSize: 4
        }
    }

    componentDidMount() {
        this._loadData()
    }

    _loadData = (page_num = 1, page_size = 4) => {
        getActivitiesList(page_num, page_size).then((result) => {
            if (result && result.status === 1) {
                message.success(result.msg);
                this.setState({
                    totalSize: result.data.activities_count,
                    resourceList: result.data.activities_list,
                },()=>{
                    console.log(this.state.totalSize);
                })
            }
        }).catch(() => {
            message.error('获取直播课程失败!');
        })
    };
    // 列的配置信息
    columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 50, align: 'center'},
        {title: '活动名称', dataIndex: 'activities_name', key: 'activities_name', align: 'center'},
        {title: '开始时间', dataIndex: 'activities_time', key: 'activities_time', align: 'center'},
        {
            title: '活动封面', dataIndex: 'activities_img', key: 'activities_img', align: 'center',
            render: (text, record) => {
                return (
                    <img src={config.database_URL + record.activities_img} alt="活动封面" width={100}/>
                )
            }
        },
        {title: '活动价格', dataIndex: 'activities_price', key: 'activities_price', align: 'center'},
        {title: '活动天数', dataIndex: 'activities_bus_day_id', key: 'activities_bus_day_id', align: 'center'},
        {
            title: '首页焦点', dataIndex: 'is_focus', key: 'is_focus', align: 'center',
            render: (text, record) => {
                return (
                    <Switch
                        checkedChildren="是"
                        unCheckedChildren={record.focus_img ? '否' : '无'}
                        defaultChecked={record.is_focus === 1}
                        disabled={!record.focus_img}
                        onChange={(checked) => {
                            let _is_focus = checked ? 1 : 0
                            setFocusActivities(record.id, _is_focus).then((result) => {
                                if (result && result.status === 1) {
                                    notification["success"]({
                                        message: `活动:${record.activities_name}`,
                                        description: _is_focus ? `设置为焦点图` : `取消设置为焦点图`,
                                    });
                                } else {
                                    message.error(result.msg)
                                }
                            }).catch((err) => {
                                console.log(err);
                                message.error('更新失败123!')
                            })
                        }}
                    />
                )
            }
        },
        {
            title: '操作', align: 'center',
            render: (text, record) => {
                return (
                    <div>
                        <Button onClick={() => {
                            this.props.history.push({
                                pathname: '/activities/edit-activities',
                                state: {
                                    activities: record,
                                }
                            })
                        }}>编辑活动</Button>
                        <Divider type="vertical"/>
                        <Button onClick={() => {
                            Modal.confirm({
                                title: '确认删除吗?',
                                content: '删除此资源,所有关联的内容都会被删除',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    deleteActivities(record.id).then((result) => {
                                        if (result && result.status === 1) {
                                            message.success(result.msg)
                                            this._loadData()
                                        } else {
                                            message.error(result.msg)
                                        }
                                    }).catch((err) => {
                                        message.error('删除失败!')
                                    })
                                }
                            });
                        }}>删除活动</Button>
                    </div>
                )
            }
        },
    ];

    render() {
        // 添加按钮
        let addBtn = (
            <Button type={"primary"} onClick={() => {
                this.props.history.push('/activities/add-activities');
            }}>
                添加活动
            </Button>
        );

        return (
            <Card title={"活动列表"} extra={addBtn}>
                <Table
                    columns={this.columns}
                    dataSource={this.state.resourceList}
                    rowKey={"id"}
                    pagination={{
                        total: this.state.totalSize,
                        pageSize: this.state.pageSize,
                        onChange: (pageNum, pageSize) => {
                            this._loadData(pageNum,pageSize)
                        }
                    }}
                />
            </Card>
        )
    }
}