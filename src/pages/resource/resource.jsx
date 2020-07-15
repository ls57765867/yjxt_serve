import React from 'react'
import {Switch, Route} from "react-router-dom";
import AddResource from "./components/add-resource";
import ResourceList from "./components/resource-list";
import EditResource from "./components/edit-resource";
import NotFound from "../notFound/not-found";

export default class Resource extends React.Component {
    render() {
        return (
            <div style={{backgroundColor: 'green'}}>
                <Switch>
                    <Route path='/resource/add-resource' component={AddResource}/>
                    <Route path='/resource/edit-resource' component={EditResource}/>
                    <Route path={'/resource'} component={ResourceList} exact/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        )
    }
}