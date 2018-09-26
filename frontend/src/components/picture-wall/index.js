import React from "react";
import { Upload, Icon, Modal } from "antd";

import { generateSalt } from "../../lib";

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ file, fileList }) => {
    this.props.onUpload(file.status);
    this.props.onChange(fileList);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { token, bucket, server, photos } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          multiple
          action={server}
          listType="picture-card"
          fileList={photos || []}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={file => ({
            token,
            Domain: bucket,
            key: `bestnovo/${generateSalt(10)}/${file.name}`
          })}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
