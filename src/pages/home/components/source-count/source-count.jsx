import React from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'
import {getSourceCount} from  '../../../../api/homeApi'




export default class SourceCount extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[],
        }
    }

    componentDidMount() {
        this._loadData()
    }

    _loadData = ()=>{
        getSourceCount().then((result)=>{
            let tempArr = [];
            for(let key in result.data){
                tempArr.push(result.data[key])
            }
            this.setState({
                data:tempArr
            })
        })
    }

    getOption = ()=>{
        return {
            xAxis: {
                type: 'category',
                data: ['幼教', '职场', '活动', '直播']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: this.state.data,
                type: 'bar',
                itemStyle:{
                    color:'#59c4e6'
                }
            }],

        }
    };

    render() {
        return (
            <Card title="各版块资源总数量统计">
                <ReactEcharts option={this.getOption()} />
            </Card>
        )
    }
}