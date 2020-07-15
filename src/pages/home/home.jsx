import React from 'react'
import {Switch,Route} from 'react-router-dom'
import PropTypes from 'prop-types'
import HomeCommon from "./pages/home-common";
import HomeList from "./pages/home-list";
import NotFound from "../notFound/not-found";


export default class Home extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/home/common' component={HomeCommon} />
                <Route path='/home' component={HomeList} />
                <Route component={NotFound}/>
            </Switch>
        )
    }
}