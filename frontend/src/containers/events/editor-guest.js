import React, { PureComponent, Fragment } from "react";
import { Table, Button, Input, message, Popconfirm, Divider, Upload, Icon } from "antd";
import { generateSalt } from '../../lib';

import styles from "./editor.module.less";

let img_url = "";

export default class GuestEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value || [],
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      this.setState({
        data: nextProps.value || []
      });
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      id: `NEW_TEMP_ID_${this.index}`,
      name: "",
      desc: "",
      photo: "",
      editable: true,
      isNew: true,
      key: Math.random()
    });
    this.index += 1;
    this.setState({ data: newData });
  };
  handleKeyPress(e, key) {
    if (e.key === "Enter") {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      target.photo = img_url;
      if (!target.name) {
        message.error("请填写嘉宾姓名");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false
      });
    }, 500);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  onHandleUpload(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      img_url = info.file.response.key;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: "25%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "name", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="姓名"
              />
            );
          }
          return text;
        }
      },
      {
        title: "介绍",
        dataIndex: "desc",
        key: "desc",
        width: "25%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "desc", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="介绍"
              />
            );
          }
          return text;
        }
      },
      {
        title: "图片",
        dataIndex: "photo",
        key: "photo",
        width: "25%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Upload
                name='file'
                action="https://up-z1.qiniup.com/"
                data={file => ({
                  token: this.props.uploadToken,
                  Domain: "joinin",
                  key: `${generateSalt(10)}-${file.name}`
                })}
                onChange={info => { this.onHandleUpload(info); }}
              >
                <Button>
                  <Icon type="upload" /> 点击上传图片
                </Button>
              </Upload>
            );
          }
          return text ? <img src={`http://static.joininevent.com/${text}`} style={{ maxHeight: 200 }} /> : '';
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];

    return (
      <Fragment>
        <Table
          rowKey="id"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : "";
          }}
        />
        <Button
          style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增嘉宾
        </Button>
      </Fragment>
    );
  }
}
