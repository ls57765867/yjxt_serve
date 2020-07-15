import React from 'react';
import {connect} from 'react-redux'
import './App.css';
import {Button} from 'antd'
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Lgoin from "./pages/login/login.jsx";
import Admin from "./pages/admin/admin.jsx";


class App extends React.Component {
    render() {
        return (
            <Router >
                <Switch>
                    <Route exact path='/login' component={Lgoin}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
