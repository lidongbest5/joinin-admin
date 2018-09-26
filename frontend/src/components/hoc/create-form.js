import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import isPlainObject from "lodash/isPlainObject";

import { saveFields, resetForm } from "../../actions";
import { selectFormData } from "../../selectors";

function flatFields(ob) {
  let result = {};
  for (const p in ob) {
    const node = ob[p];
    if (isPlainObject(node)) {
      if ("name" in node && "value" in node) {
        // filed 节点
        result[node.name] = { ...node };
      } else {
        // nested data
        result = { ...result, ...flatFields(node) };
      }
    }
  }
  return result;
}

export default function CreateForm(formName) {
  @connect((state, props) => ({
    formData: selectFormData(state, formName)
  }))
  @Form.create({
    mapPropsToFields(props) {
      const data = props.formData || {};
      const fields = {};
      for (const p in data.fields) {
        fields[p] = Form.createFormField({ ...data.fields[p] });
      }
      return fields;
    },
    onFieldsChange(props, fields) {
      props.dispatch(saveFields(formName, flatFields(fields)));
    }
  })
  class BasicForm extends React.PureComponent {
    componentWillUnmount() {
      this.props.dispatch(resetForm(formName));
    }

    render() {
      const { children, ...rest } = this.props;

      var childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, { ...rest })
      );

      return <Fragment>{childrenWithProps}</Fragment>;
    }
  }

  return Component => props => {
    return (
      <BasicForm>
        <Component {...props} />
      </BasicForm>
    );
  };
}
