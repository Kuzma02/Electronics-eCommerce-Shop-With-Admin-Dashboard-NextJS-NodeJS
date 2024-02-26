import React from "react";
import Checkbox from "./Checkbox";
import Range from "./Range";

const Filters = () => {
  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <Checkbox text="In stock" />
        <Checkbox text="Out of stock" />
      </div>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Brand</h3>
        <Checkbox text="Logitech" />
        <Checkbox text="Bosch" />
        <Checkbox text="Lenovo" />
        <Checkbox text="HP" />
        <Checkbox text="Samsung" />
        <Checkbox text="Huawei" />
        <Checkbox text="Apple" />
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price</h3>
        <Range min={0} max={3000} defaultValue={3000}  />
      </div>

    </div>
  );
};

export default Filters;
