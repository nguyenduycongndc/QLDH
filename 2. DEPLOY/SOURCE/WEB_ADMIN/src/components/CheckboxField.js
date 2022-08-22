import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";
import { Radio, Checkbox } from "antd";

CheckboxField.propTypes = {};

CheckboxField.defaultProps = {};

function CheckboxField(props) {
  const { field, label, placeholder, disabled, type, form, options } = props;
  const { name, value } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];

  const handleCheckbox = (e) => {
    const changeEvent = {
      target: {
        name: name,
        value: e.target.checked,
      },
    };
    field.onChange(changeEvent);
  };

  return (
    <FormGroup>
      <Checkbox
        name={name}
        id={name}
        checked={value}
        onChange={handleCheckbox}
        style={{
          marginBottom: "14px",
          marginTop: "6px",
        }}
      >
        <a className="text-danger">{label}</a>
      </Checkbox>
    </FormGroup>
  );
}

export default CheckboxField;
