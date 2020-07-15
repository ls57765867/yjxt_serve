import React from 'react'
import PropTypes from 'prop-types'


import "../home.css"
import TopCard from '../components/top-card/top-card'
import SourceCount from '../components/source-count/source-count'
import BuyCount from '../components/buy-count/buy-count'

export default class HomeList extends React.Component {
    render() {
        return (
            <div className="home">
                <div className='home-top'>
                    <TopCard
                        pathLink='/home/common'
                        iconClassName='icon iconfont icon-hezuohuobanmiyueguanli'
                        bgColor={{background:'red'}}
                        CardMainTitle='通用配置'
                        CardSubTitle='客户端通用信息配置'
                    />

                    <TopCard
                        pathLink='/'
                        iconClassName='icon iconfont icon-shenjing'
                        bgColor={{background:'#1890ff'}}
                        CardMainTitle='系统说明'
                        CardSubTitle='系统使用说明'
                    />

                    <TopCard
                        pathLink='/'
                        iconClassName='icon iconfont icon-fuwudiqiu'
                        bgColor={{background:'purple'}}
                        CardMainTitle='管理员中心'
                        CardSubTitle='管理员管理'
                    />




                </div>
                <div className='home-content'>
                    <div className='home-content-card'>
                        <SourceCount />

                    </div>
                    <div className='home-content-card'>
                        <BuyCount/>
                    </div>
                </div>
            </div>
        )
    }
}