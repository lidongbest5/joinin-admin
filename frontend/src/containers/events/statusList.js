import React from "react";
import { connect } from "react-redux";
import { Form, Spin, Table, Button, Tag, Input, Modal } from "antd";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { getEventsStatus, changeEventsStatus } from "../../actions";

const { TextArea } = Input;

const mapStateToProps = state => ({
  events: state.events,
  session: state.session
});

@connect(mapStateToProps)
@Form.create()
export default class StatusPage extends React.Component {
  state = {
    data: {},
    record: {},
    visible: false,
    value: ""
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const { list } = this.props.events;
      const { user } = this.props.session;
      const dataList = list.filter(item => item.id = id);
      if (dataList.length) {
        const data = dataList[0];
        this.setState({
          data
        });
        this.props.dispatch(getEventsStatus({
          id,
          user_id: user.id
        }));
      } else {
        this.props.dispatch(push("/events/"));
      }
    }
  }

  onApprove(record) {
    console.log(record);
    this.props.dispatch(changeEventsStatus({
      id: record.id,
      status: 1
    }));
  }

  onDecline(record) {
    this.setState({
      record,
      visible: true
    });
  }

  handleOk = (e) => {
    const { record, value } = this.state;

    this.setState({
      visible: false
    });

    this.props.dispatch(changeEventsStatus({
      id: record.id,
      status: 2,
      reply_reason: value
    }));
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  }

  onChangeInput= e => {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    const { statusList, statusFetched, statusChangeFetched } = this.props.events;
    const { data, visible, value } = this.state;
    
    
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '学校',
      dataIndex: 'school',
      key: 'school'
    }, {
      title: '专业',
      dataIndex: 'major',
      key: 'major'
    }, {
      title: '入学时间',
      key: 'schoolTime',
      dataIndex: 'schoolTime'
    }, {
      title: '自我介绍',
      key: 'intro',
      dataIndex: 'intro'
    },{
      title: '申请理由',
      dataIndex: 'inviteReason',
      key: 'inviteReason'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        console.log(record);
        return (
          <div>
            {text === 0 && <Tag color="blue">未处理</Tag>}
            {text === 1 && <Tag color="green">通过</Tag>}
            {text === 2 && <div>
              <Tag color="red">拒绝</Tag>{record.replyReason}
            </div>}
          </div>
        )
      },
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="primary" loading={statusChangeFetched} onClick={() => { this.onApprove(record); }} style={{ marginRight: 10 }}>通过</Button>
          <Button loading={statusChangeFetched} type="danger" onClick={() => { this.onDecline(record); }}>拒绝</Button>
        </div>
      ),
    }];

    return (
      <div>
        {statusFetched && <div>
          <h3>{data.title}</h3>
          <Table columns={columns} dataSource={statusList} rowKey={"id"} />
          <Modal
            title="拒绝理由"
            visible={visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
          >
            <TextArea rows={4} placeholder="拒绝理由，可为空" onChange={(e) => { this.onChangeInput(e); }} />
          </Modal>
        </div>}
        {!statusFetched && <div style={{ textAlign: "center", padding: "25px 0" }}>
          <Spin size="large"/>
        </div>}
      </div>
    );
  }
}
