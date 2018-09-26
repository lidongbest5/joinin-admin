import React from "react";
import { connect } from "react-redux";
import { Tabs, Button, Form, Input, DatePicker, Select, Upload, Icon, Modal, Radio, Card, Spin } from "antd";
import { push } from "react-router-redux";

import { saveAccounts, getAccounts } from "../../actions";

const { TextArea } = Input;

const mapStateToProps = state => ({
  events: state.events,
  session: state.session
});

@connect(mapStateToProps)
@Form.create()
export default class Accounts extends React.Component {
  state = {
    htmlContent: '',
    responseList: '',
    fileList1: [],
    fileList2: [],
    previewVisible: false,
    previewImage: '',
    color: "#000000",
    radioValue: 1,
    data: {}
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(getAccounts({
      id: this.props.session.user.id
    }));
  }

  handleSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { user } = this.props.session;

    validateFields((err, values) => {
      if (!err) {
        values.id = user.id;
        this.props.dispatch(saveAccounts(values));
      }
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { getFieldDecorator } = this.props.form;
    const { account = {}, accountGetFetching, accountSaveFetching } = this.props.session;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    }
    
    return (
      <div>
        {accountGetFetching && <div style={{ textAlign: "center", padding: "25px 0" }}>
          <Spin size="large"/>
        </div>}
        {!accountGetFetching && <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item 
              {...formItemLayout} 
              label="登录名"
            >
              {getFieldDecorator("username", {
                initialValue: account.username,
                rules: []
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="邮箱"
            >
              {getFieldDecorator("email", {
                initialValue: account.email,
                rules: []
              })(
                <Input disabled={true} />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="手机"
            >
              {getFieldDecorator("mobile", {
                initialValue: account.mobile,
                rules: []
              })(
                <Input disabled={true} />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="主办方名称"
            >
              {getFieldDecorator("name", {
                initialValue: account.name,
                rules: []
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="主办方介绍"
            >
              {getFieldDecorator("intro", {
                initialValue: account.intro,
                rules: []
              })(
                <TextArea rows={3} />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="主办方标签"
            >
              {getFieldDecorator("label", {
                initialValue: account.label,
                rules: []
              })(
                <Input placeholder="逗号分隔" />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="主办方微信"
            >
              {getFieldDecorator("wechat", {
                initialValue: account.wechat,
                rules: []
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              {...formItemLayout} 
              label="主办方微博"
            >
              {getFieldDecorator("weibo", {
                initialValue: account.weibo,
                rules: []
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" loading={accountSaveFetching}>保存</Button>
            </Form.Item>
          </Form>
        </div>}
      </div>
    );
  }
}
