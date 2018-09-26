import React from "react";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";
import GlobalFooter from "../components/global-footer";
import logo from "../assets/logo.png";

import styles from "./login-layout.module.less";

const links = [
  {
    key: "help",
    title: "帮助",
    href: ""
  },
  {
    key: "privacy",
    title: "隐私",
    href: ""
  },
  {
    key: "terms",
    title: "条款",
    href: ""
  }
];

export class LoginLayout extends React.PureComponent {
  render() {
    const { children, title } = this.props;
    return (
      <DocumentTitle title={title || "JoinIn"}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  {/* <span className={styles.title}>JoinIn</span> */}
                </Link>
              </div>
              <div className={styles.desc}>让世界更懂你</div>
            </div>
            <div className={styles.main}>{children}</div>
          </div>
          <GlobalFooter links={links}/>
        </div>
      </DocumentTitle>
    );
  }
}

export const withLoginLayout = title => Component => {
  return props => (
    <LoginLayout title={title}>
      <Component {...props} />
    </LoginLayout>
  );
};
