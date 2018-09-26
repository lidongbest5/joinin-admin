import React from "react";
import { Spin } from "antd";

import styles from "./style.module.less";

export default () => (
  <div className={styles.example}>
    <Spin />
  </div>
);
