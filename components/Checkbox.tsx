import React from "react";

const Checkbox = ({ text, stateValue, setStateValue } : { text: string, stateValue: any, setStateValue: any }) => {
  return (
    <div className="form-control">
      <label className="cursor-pointer flex items-center">
        <input
          type="checkbox"
          defaultChecked
          className="checkbox checkbox-warning"
        />
        <span className="label-text text-lg ml-2">{ text }</span>
      </label>
    </div>
  );
};

export default Checkbox;
