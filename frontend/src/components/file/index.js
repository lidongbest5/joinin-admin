import React from "react";
import { Upload, Icon, Button } from "antd";
import { generateSalt } from "../../lib";

export default class File extends React.Component {
  handleChange = info => {
    this.props.onUpload(info.file.status);
    this.props.onChange(info);
  };

  render() {
    const { token, bucket, server } = this.props;

    return (
      <div className="clearfix">
        <Upload
          name="file"
          action={server}
          listType="picture"
          onChange={this.handleChange}
          data={file => ({
            token,
            Domain: bucket,
            key: `bestnovo/${generateSalt(10)}/${file.name}`
          })}
        >
          <Button>
            <Icon type="upload" /> 上传 PDF 文件
          </Button>
        </Upload>
      </div>
    );
  }
}
