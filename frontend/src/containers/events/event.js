import React from "react";
import { connect } from "react-redux";
import { Tabs, Button, Form, Input, DatePicker, Select, Upload, Icon, Modal, Radio, Card } from "antd";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import moment from "moment";
import LzEditor from 'react-lz-editor';
import { SwatchesPicker } from 'react-color';
import { generateSalt } from '../../lib';

import { saveEvent, getQiniu } from "../../actions";
import GuestEditor from "./editor-guest";
import SponsorEditor from "./editor-sponsor";

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
  events: state.events,
  session: state.session
});

@connect(mapStateToProps)
@Form.create()
export default class Events extends React.Component {
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
    const { id } = this.props.match.params;

    if (id) {
      const { list } = this.props.events;
      const dataList = list.filter(item => item.id = id);
      if (dataList.length) {
        const data = dataList[0];


        this.setState({
          data,
          htmlContent: data.description,
          responseList: data.description,
          color: data.color,
          fileList1: data.banner ? [{
            uid: '1',
            name: data.banner,
            status: 'done',
            url: `http://static.joininevent.com/${data.banner}`,
          }] : [],
          fileList2: data.image ? [{
            uid: '1',
            name: data.image,
            status: 'done',
            url: `http://static.joininevent.com/${data.image}`,
          }] : [],
        })
      } else {
        this.props.dispatch(push("/events/"));
      }
    }

    this.props.dispatch(getQiniu());
  }

  receiveHtml(content) {
    this.setState({ responseList: content });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { user } = this.props.session;
    const { id } = this.props.match.params;
    const { fileList1, fileList2 } = this.state;

    validateFields((err, values) => {
      if (!err) {
        const { responseList, color } = this.state;
        values.start_time = moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss");
        values.end_time = moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss");
        values.price = parseInt(values.price, 10);
        values.desc = responseList;
        if (fileList2.length) {
          values.image = fileList2[0].response ? fileList2[0].response.key : fileList2[0].name;
        }

        if (fileList1.length) {
          values.banner = fileList1[0].response ? fileList1[0].response.key : fileList1[0].name;
        }

        values.color = color;

        values.guest = JSON.stringify(values.guest);
        values.sponsor = JSON.stringify(values.sponsor);
        values.user_id = user.id;

        if (id) {
          values.id = id;
        }

        this.props.dispatch(saveEvent(values));
      }
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChangeUpload1 = ({ fileList }) => this.setState({ fileList1: fileList });
  handleChangeUpload2 = ({ fileList }) => this.setState({ fileList2: fileList });
  handleChangeUpload3 = ({ fileList }) => {
    fileList.forEach(item => {
      if (item.response) {
        item.url = `http://static.joininevent.com/${item.response.key}`;
      }
    });
    this.setState({ fileList3: fileList });
  }

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.match.params;
    const { uploadToken } = this.props.events;

    const { previewVisible, previewImage, fileList1, fileList2, fileList3, color, radioValue, data } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const operations = <Button type="primary" htmlType="submit">保存活动</Button>;

    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    const uploadProps = {
      name: "file",
      action: "https://up-z1.qiniup.com/",
      listType: "picture",
      fileList: fileList3,
      onChange: this.handleChangeUpload3.bind(this),
      data: (file) => ({
        token: uploadToken,
        Domain: "joinin",
        key: `${generateSalt(10)}-${file.name}`
      })
    };
    
    return (
      <div>
        {((id && data.title) || !id) && <div>
          <Form onSubmit={this.handleSubmit}>
            <Tabs tabBarExtraContent={operations}>
              <TabPane tab="基本信息" key="1">
                <Form.Item 
                  {...formItemLayout} 
                  label="活动名称"
                >
                  {getFieldDecorator("title", {
                    initialValue: data.title,
                    rules: [{ required: true, message: "请输入活动名称!" }]
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动时间"
                >
                  {getFieldDecorator('time', {
                    initialValue: id ? [moment(data.startTime), moment(data.endTime)] : [],
                    rules: [{ type: 'array', required: true, message: '请选择时间!' }],
                  })(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动城市"
                >
                  {getFieldDecorator('district', {
                    initialValue: data.district,
                    rules: [
                      { required: true, message: '请选择城市!' },
                    ],
                  })(
                    <Select placeholder="请选择城市">
                      <option value="北京">北京</option><option value="上海">上海</option><option value="广州">广州</option><option value="深圳">深圳</option><option value="杭州">杭州</option><option value="成都">成都</option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item 
                  {...formItemLayout} 
                  label="活动地点"
                >
                  {getFieldDecorator("place", {
                    initialValue: data.place,
                    rules: [{ required: true, message: "请输入活动地点!" }]
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动类型"
                >
                  {getFieldDecorator('category', {
                    initialValue: data.category && data.category.split(","),
                    rules: [
                      { required: true, message: '请选择类型!' },
                    ],
                  })(
                    <Select placeholder="请选择类型" mode="multiple">
                      <option value="创业">创业</option><option value="公益">公益</option><option value="科技">科技</option><option value="运动">运动</option><option value="互联网">互联网</option><option value="教育">教育</option><option value="职场">职场</option><option value="健康">健康</option><option value="文艺">文艺</option><option value="心理">心理</option><option value="户外">户外</option><option value="金融">金融</option><option value="旅行">旅行</option><option value="读书">读书</option><option value="电商">电商</option><option value="时尚">时尚</option><option value="设计">设计</option><option value="游戏">游戏</option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动门票"
                >
                  {getFieldDecorator('price', {
                    initialValue: data.price || "0",
                    rules: [
                      { required: true, message: '请选择门票!' },
                    ],
                  })(
                    <Select placeholder="请选择门票">
                      <option value="0">免费</option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动介绍"
                >
                  {getFieldDecorator('desc', {
                    rules: [],
                  })(
                    <LzEditor 
                      active={true}
                      lang={"zh-CN"}
                      importContent={this.state.htmlContent}
                      cbReceiver={this.receiveHtml.bind(this)}
                      video={false}
                      audio={false}
                      fullScreen={false}
                      uploadProps={uploadProps}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="自定义活动图片"
                >
                  {getFieldDecorator('image', {
                    rules: [],
                  })(
                    <Upload
                      name="file"
                      action="https://up-z1.qiniup.com/"
                      listType="picture-card"
                      fileList={fileList2}
                      onPreview={this.handlePreview.bind(this)}
                      onChange={this.handleChangeUpload2.bind(this)}
                      data={file => ({
                        token: uploadToken,
                        Domain: "joinin",
                        key: `${generateSalt(10)}-${file.name}`
                      })}
                    >
                      {fileList2.length >= 1 ? null : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="活动首屏图片"
                >
                  {getFieldDecorator('banner', {
                    rules: [],
                  })(
                    <Upload
                      name="file"
                      action="https://up-z1.qiniup.com/"
                      listType="picture-card"
                      fileList={fileList1}
                      onPreview={this.handlePreview.bind(this)}
                      onChange={this.handleChangeUpload1.bind(this)}
                      data={file => ({
                        token: uploadToken,
                        Domain: "joinin",
                        key: `${generateSalt(10)}-${file.name}`
                      })}
                    >
                      {fileList1.length >= 1 ? null : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
              </TabPane>
              <TabPane tab="活动模板" key="2">
                <Form.Item
                  {...formItemLayout}
                  label="页面主题颜色"
                >
                  {getFieldDecorator('color', {
                    rules: [],
                  })(
                    <SwatchesPicker
                      color={ color }
                      onChangeComplete={ this.handleChangeComplete.bind(this) }
                    />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="小程序页面模板"
                >
                  {getFieldDecorator('template', {
                    initialValue: data.template || 1,
                    rules: [],
                  })(
                    <RadioGroup value={radioValue}>
                      <Radio value={1}>默认</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </TabPane>
              <TabPane tab="活动嘉宾" key="3">
                <Form.Item>
                  {getFieldDecorator('guest', {
                    initialValue: data.guest ? JSON.parse(data.guest) : [],
                    rules: [],
                  })(
                    <GuestEditor uploadToken={uploadToken} />
                  )}
                </Form.Item>
              </TabPane>
              <TabPane tab="活动赞助商" key="4">
                <Form.Item>
                  {getFieldDecorator('sponsor', {
                    initialValue: data.sponsor ? JSON.parse(data.sponsor) : [],
                    rules: [],
                  })(
                    <SponsorEditor uploadToken={uploadToken} />
                  )}
                </Form.Item>
              </TabPane>
            </Tabs>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>}
      </div>
    );
  }
}
