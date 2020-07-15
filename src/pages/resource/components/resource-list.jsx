import React from 'react'
import {Card, Button, Table, Switch, Divider, Modal, message, notification} from 'antd'
import {getResourceList, setFocusResource, deleteResource} from "../../../api/resourceApi";
import config from "../../../config/config";

export default class ResourceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resourceList: [],
            totalSize: 0,
            pageSize: 4
        }
    }

    componentDidMount() {
        // 加载列表数据
        this._loadData();
    }

    _loadData = (page_num=1, page_size=4)=>{
        getResourceList(page_num, page_size).then((result)=>{
            if(result && result.status === 1){
                console.log(result);
                message.success(result.msg);
                this.setState({
                    totalSize: result.data.resource_count,
                    resourceList: result.data.resource_list
                })
            }
        }).catch(()=>{
            message.error('获取资源列表失败!');
        })
    };

    // 列的配置信息
    columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 50, align: 'center'},
        {title: '幼教标题', dataIndex: 'resource_name', key: 'resource_name',align: 'center'},
        {
            title: '幼教封面', dataIndex: 'resource_img', key: 'resource_img',align: 'center',
            render: (text, record) => {
                return (
                    <img src={config.database_URL + record.resource_img} alt="课程封面" width={100}/>
                )
            }
        },
        {title: '所属作者', dataIndex: 'resource_author', key: 'resource_author',align: 'center'},
        {title: '所属分类', dataIndex: 'category_name',key: 'category_name', align: 'center'},
        {
            title: '首页焦点', dataIndex: 'is_focus', key: 'is_focus',align: 'center',
            render: (text, record) => {
                return (
                    <Switch
                        checkedChildren="是"
                        unCheckedChildren= "否"
                        disabled={record.focus_img.length === 0}
                        defaultChecked={record.is_focus === 1}
                        onChange={(checked)=>{
                            setFocusResource(record.id, checked ? 1 : 0).then((result)=>{
                                if(result && result.status === 1){
                                    notification["success"]({
                                        message: `课程: ${record.resource_name}`,
                                        description: `${checked ? '设置为' : '取消'}焦点活动!`
                                    });
                                }
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
                        <Button onClick={()=>{
                            this.props.history.push({
                                pathname: '/resource/edit-resource',
                                state:{
                                    resource: record
                                }
                            });
                        }}>编辑</Button>
                        <Divider type="vertical" />
                        <Button onClick={()=>{
                            Modal.confirm({
                                title: '确认删除吗?',
                                content: '删除此资源,所有关联的内容都会被删除',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: ()=> {
                                    deleteResource(record.id).then(result=>{
                                        if(result && result.status === 1){
                                            message.success(result.msg);
                                            this._loadData();
                                        }else {
                                            message.error('删除失败!');
                                        }
                                    }).catch(()=>{
                                        message.error('删除失败!');
                                    })
                                }
                            });
                        }}>删除</Button>
                    </div>
                )
            }
        },
    ];

    render() {
        // 添加按钮
        let addBtn = (
            <Button type={"primary"} onClick={() => {
                this.props.history.push('/resource/add-resource');
            }}>
                添加幼教资源
            </Button>
        );

        return (
            <Card title={"幼教资源列表"} extra={addBtn}>
                <Table
                    columns={this.columns}
                    dataSource={this.state.resourceList}
                    rowKey={"id"}
                    pagination={{
                        total: this.state.totalSize,
                        pageSize: this.state.pageSize,
                        onChange: (pageNum, pageSize)=>{
                            console.log('需要加载' + pageNum, pageSize);
                            this._loadData(pageNum, pageSize)
                        }
                    }}
                />
            </Card>
        )
    }
}