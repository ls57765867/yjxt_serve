import React, {Component} from 'react'
import {connect} from 'react-redux';
import './admin.css';
import LeftNav from './components/left-nav/left-nav';
import RightHeader from './components/right-header/right-header';
import {Layout, Modal} from 'antd';
import {Switch, Route, Redirect} from 'react-router-dom';
//判断是否已经登录的api
import {isLogin} from '../../api/adminApi';
import Home from './../home/home';
import Activities from './../activities/activities';
import Lifejob from './../lifejob/life-job';
import Lives from './../lives/lives';
import NotFound from './../notFound/not-found';
import Resource from './../resource/resource';
import Setting from './../setting/setting';
import PubSub from "pubsub-js";
import {getWebSiteMsg} from "../../api/homeApi";



const {Content, Footer} = Layout;

class Admin extends Component {
    state = {
        collapsed: false,
        web_site_msg:[]
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    componentDidMount() {
        // 去订阅token失效信息
        PubSub.subscribe('tokenOut', (msg, data)=>{
            if(msg === 'tokenOut'){
                Modal.warning({
                    title: '登录信息已经失效',
                    content: (
                        <div>
                            <p>请重新登录后再操作!</p>
                        </div>
                    ),
                    onOk:()=>{
                        this.props.history.replace('/login');
                    }
                });

            }
        });

        getWebSiteMsg().then((result)=>{
            this.setState({
                web_site_msg:result.data[0]
            })
        })
    }

    // componentWillUpdate(nextProps, nextState, nextContext) {
    //     let {web_site_msg} = this.state
    //     if(web_site_msg.site_copy !== nextState.web_site_msg.site_copy){
    //         console.log(1);
    //         getWebSiteMsg().then((result)=>{
    //             this.setState({
    //                 web_site_msg:result.data[0]
    //             })
    //         })
    //     }
    // }

    componentWillUnmount() {
        PubSub.unsubscribe('tokenOut');
    }

    render() {
        if(!isLogin()){
            return (<Redirect to='/login'/>)
        }
        const {web_site_msg} = this.state
        return (
            <Layout className='admin-pane'>
                {/*左边*/}
                <LeftNav collapsed={this.state.collapsed}/>
                {/*右边*/}
                <Layout>
                    {/*右边头部*/}
                    <RightHeader collapsed={this.state.collapsed} toggle={this.toggle}/>
                    {/*右边内容*/}
                    <Content className="admin-content" style={{height:'100%'}}>
                        <Switch>
                            <Redirect from='/' to='/home' exact/>
                            <Route path='/home' component={Home}/>
                            <Route path='/resource' component={Resource}/>
                            <Route path='/lifejob' component={Lifejob}  />
                            <Route path='/activities' component={Activities}/>
                            <Route path='/live' component={Lives}/>
                            <Route path='/setting' component={Setting}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    {/*右边底部*/}

                    <Footer style={{padding: "12px 50px", textAlign: "center"}}>
                        {web_site_msg.site_copy}
                    </Footer>
                </Layout>
            </Layout>

        );
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Admin);