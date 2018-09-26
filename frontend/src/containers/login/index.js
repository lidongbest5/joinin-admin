import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import md5 from "md5";

import { withLoginLayout } from "../login-layout";
import { login } from "../../actions";
import styles from "./index.module.less";

const mapStateToProps = state => ({
  session: state.session
});

@withLoginLayout("JoinIn 活动 - 登录")
@connect(mapStateToProps)
@Form.create()
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.getFieldDecorator = props.form.getFieldDecorator;
    this.validateFields = props.form.validateFields;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.validateFields((err, values) => {
      if (!err) {
        let { username, password } = values;
        password = md5(password);
        this.props.dispatch(login(username, password));
      }
    });
  };

  fileds = {
    UserName: ({ name, placeholder }) => (
      <Form.Item>
        {this.getFieldDecorator(name, {
          rules: [{ required: true, message: "请输入用户名!" }]
        })(
          <Input
            size="large"
            prefix={<Icon type="user" className={styles.prefixIcon} />}
            placeholder={placeholder}
          />
        )}
      </Form.Item>
    ),

    Password: ({ name, placeholder }) => (
      <Form.Item>
        {this.getFieldDecorator(name, {
          rules: [{ required: true, message: "请输入密码!" }]
        })(
          <Input
            size="large"
            type="password"
            prefix={<Icon type="lock" className={styles.prefixIcon} />}
            placeholder={placeholder}
          />
        )}
      </Form.Item>
    ),

    Submit: ({ ...rest }) => (
      <Form.Item>
        <Button size="large" className={styles.submit} type="primary" htmlType="submit" {...rest} />
      </Form.Item>
    )
  };

  render() {
    const { UserName, Password, Submit } = this.fileds;
    const { loading } = this.props.session;

    return (
      <div className={styles.login}>
        <Form onSubmit={this.handleSubmit}>
          <UserName name="username" placeholder="邮箱/手机/用户名" />
          <Password name="password" placeholder="密码" />
          <div>
            <Checkbox checked={true} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: "right" }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={loading}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/register">
              注册账户
            </Link>
          </div>
        </Form>
      </div>
    );
  }
}
