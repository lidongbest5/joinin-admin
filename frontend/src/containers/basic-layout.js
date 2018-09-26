import React from "react";
import { connect } from "react-redux";
import { Layout, Menu, Icon, Dropdown, Avatar } from "antd";
import DocumentTitle from "react-document-title";
import { Link } from "react-router-dom";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import { enquireScreen } from "enquire-js";
import { logout } from "../actions";
import GlobalFooter from "../components/global-footer";

import logo from "../assets/logo1.png";

import styles from "./basic-layout.module.less";

const { Header, Sider, Content } = Layout;
const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200
  }
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

const mapStateToProps = state => ({
  session: state.session
});
@connect(mapStateToProps)
export class BasicLayout extends React.PureComponent {
  state = {
    isMobile,
    collapsed: true
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    enquireScreen(mobile => {
      this.setState({
        isMobile: mobile
      });
    });
  }

  onMenuClick(value) {
    if (value.key === "logout") {
      this.props.dispatch(logout());
    }
  }

  render() {
    const { children, title, session } = this.props;

    const path = this.props.children.props.match.path;

    console.log(path);

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    const layout = (
      <Layout style={{ height: '100vh' }}>
        <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
          <img src={logo} className="joinin-logo" alt="" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[path]}>
            <Menu.Item key="/events">
              <Link to="/events">
                <Icon type="bars" />
                <span>我的活动</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/statistics">
              <Link to="/statistics">
                <Icon type="area-chart" />
                <span>我的统计</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/accounts">
              <Link to="/accounts">
                <Icon type="setting" />
                <span>我的账户</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ height: '100vh', marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }}>
            <div className={styles.right}>
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} icon="user" />
                  <span className={styles.name}>{session.user.email}</span>
                </span>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial', padding: 24, background: '#fff' }}>
            {children}
          </Content>
          <GlobalFooter />
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={title || "JoinIn 活动"}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export const withBasicLayout = title => Component => {
  return props => (
    <BasicLayout title={title}>
      <Component {...props} />
    </BasicLayout>
  );
};
