import React from "react";
import { connect } from "react-redux";
import { Form, List, Spin, Popconfirm, Button, Icon } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { getEventsList, deleteEvent } from "../../actions";

const mapStateToProps = state => ({
  events: state.events,
  session: state.session
});

@connect(mapStateToProps)
@Form.create()
export default class EventList extends React.Component {
  state = {
    
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getListData();
  }

  getListData() {
    const { user } = this.props.session;

    this.props.dispatch(getEventsList({
      id: user.id
    }));
  }


  onDeleteEvent(id) {
    const { user } = this.props.session;

    this.props.dispatch(deleteEvent({
      id,
      user: user.id
    }));
  }

  cancel() {

  }

  render() {
    const { list, fetched } = this.props.events;

    return (
      <div>
        {fetched && <div>
          <div className="clearfix">
            <Link to="/events/new"><Button type="primary" style={{ float: "right" }}>新建活动</Button></Link>
          </div>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 10,
            }}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.title}
                className="joinin-list-item"
                actions={[<Link to={`/events/edit/${item.id}`}>编辑</Link>, <Link to={`/events/status/${item.id}`}>审核列表</Link>, <a>参会列表</a>, <Popconfirm title={`确定删除${item.title}?`} onConfirm={() => { this.onDeleteEvent(item.id); }} onCancel={this.cancel} okText="Yes" cancelText="No">
                <a href="#" style={{ color: "#f5222d" }}>删除</a>
              </Popconfirm>]}
                extra={<img height={96} alt="banner" src={item.image ? `http://static.joininevent.com/${item.image}` : item.banner ? `http://static.joininevent.com/${item.banner}` : 'http://static.joininevent.com/sample1.png'} />}
              >
                <List.Item.Meta
                  title={item.title}
                  description={<div><Icon type="calendar" theme="outlined" />{moment(item.startTime).format("YYYY-MM-DD HH:mm")} - {moment(item.endTime).format("YYYY-MM-DD HH:mm")} <Icon type="environment" theme="outlined" className="icon-place" />{item.district} {item.place}</div>}
                />
              </List.Item>
            )}
          />  
        </div>}
        {!fetched && <div style={{ textAlign: "center", padding: "25px 0" }}>
          <Spin size="large"/>
        </div>}
      </div>
    );
  }
}
