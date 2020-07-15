import React from 'react'
import {Switch, Route} from 'react-router-dom'

import ActivitiesList from './pages/activities-list'
import ActivitiesAdd from './pages/activities-add'
import EditActivities from './pages/activities-edit'
import NotFound from './../notFound/not-found'

export default class LifeJob extends React.Component{
    render() {
        return (
            <Switch>
                <Route path={"/activities/add-activities"} component={ActivitiesAdd}/>
                <Route path={"/activities/edit-activities"} component={EditActivities}/>
                <Route path={"/activities"} component={ActivitiesList}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }
}