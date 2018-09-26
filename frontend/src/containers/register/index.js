import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import { Link } from "react-router-dom";
import md5 from "md5";
import Result from '../../components/Result';

import { withLoginLayout } from "../login-layout";
import { register, sendSMS } from "../../actions";
import styles from "./index.module.less";

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const mapStateToProps = state => ({
  session: state.session
});

@withLoginLayout("JoinIn 活动 - 注册")
@connect(mapStateToProps)
@Form.create()
export default class Register extends React.Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);

    const { form } = this.props;
    this.props.dispatch(sendSMS({
      mobile: form.getFieldValue('mobile')
    }));
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };


  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.password = md5(values.password);
        this.props.dispatch(register(values));
      }
    });
  };

  render() {
    const { form, session } = this.props;
    const { getFieldDecorator } = form;
    const { submitting, regUser } = session;
    const { count, prefix, help, visible } = this.state;

    const actions = (
      <div className={styles.actions}>
        <Link to="/login">
          <Button size="large">登录</Button>
        </Link>
      </div>
    );

    return (
      <div>
        {regUser && <Result
          className={styles.registerResult}
          type="success"
          title={
            <div className={styles.title}>
              您的账户：{regUser.email} 注册成功
            </div>
          }
          description="感谢您的注册，请点击下方登录按钮使用您新注册的账户密码登录。"
          actions={actions}
          style={{ marginTop: 56 }}
        />}
        {!regUser && <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('mail', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱地址！',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误！',
                  },
                ],
              })(<Input size="large" placeholder="邮箱" />)}
            </FormItem>
            <FormItem help={help}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
              </Popover>
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input size="large" type="password" placeholder="确认密码" />)}
            </FormItem>
            <FormItem>
              <InputGroup compact>
                <Select
                  size="large"
                  value={prefix}
                  onChange={this.changePrefix}
                  style={{ width: '20%' }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                })(<Input size="large" style={{ width: '80%' }} placeholder="11位手机号" />)}
              </InputGroup>
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ],
                  })(<Input size="large" placeholder="验证码" />)}
                </Col>
                <Col span={8}>
                  <Button
                    size="large"
                    disabled={count}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
              <Link className={styles.login} to="/login">
                使用已有账户登录
              </Link>
            </FormItem>
          </Form>
        </div>}
      </div>
    );
  }
}
