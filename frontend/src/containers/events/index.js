import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router";

import { withBasicLayout } from "../basic-layout";
import ListPage from "./lists";
import EventPage from "./event";
import StatusPage from "./statusList";

const mapStateToProps = state => ({});

@withBasicLayout("JoinIn 活动")
@connect(mapStateToProps)
export default class Events extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/events/list" component={ListPage} />
        <Route path="/events/new" component={EventPage} />
        <Route path="/events/edit/:id" component={EventPage} />
        <Route path="/events/status/:id" component={StatusPage} />
        <Redirect to="/events/list" />
      </Switch>
    );
  }
}
