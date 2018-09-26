import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";

import { withBasicLayout } from "../basic-layout";
import AccountsPage from "./accounts";

const mapStateToProps = state => ({});

@withBasicLayout("JoinIn 活动")
@connect(mapStateToProps)
export default class Accounts extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/accounts" component={AccountsPage} />
      </Switch>
    );
  }
}
