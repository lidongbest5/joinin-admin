import React from "react";
import { connect } from "react-redux";

import { withBasicLayout } from "../basic-layout";

const mapStateToProps = state => ({});

@withBasicLayout("JoinIn 活动")
@connect(mapStateToProps)
export default class Events extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>即将上线，尽请期待</div>
    );
  }
}
