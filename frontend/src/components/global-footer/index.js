import React, { Fragment } from "react";
import classNames from "classnames";
import { Icon } from "antd";
import styles from "./index.module.less";

export default ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a
              key={link.key}
              target={link.blankTarget ? "_blank" : "_self"}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      <div className={styles.copyright}>
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 JoinIn活动 苏ICP备18041889号
        </Fragment>
      </div>
    </div>
  );
};
