import React, {Component} from "react"
import {Switch, Route} from "react-router-dom"
import LiveList from "./pages/live-list";
import AddLive from "./pages/add-live";
import EditLive from './pages/edit-live'
import NotFound from './../notFound/not-found'


export default class Resource extends Component {
    render() {
        return (
            <Switch>
                <Route path={"/live/add-live"} component={AddLive}/>
                <Route path={"/live/edit-live"} component={EditLive}/>
                <Route path={"/live"} component={LiveList}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }
}