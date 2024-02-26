import React from "react";

const Pagination = () => {
  return (
    <div className="join flex justify-center py-16">
      <button className="join-item btn btn-lg bg-custom-yellow text-black hover:bg-black hover:text-custom-yellow">«</button>
      <button className="join-item btn btn-lg bg-custom-yellow text-black hover:bg-black hover:text-custom-yellow">Page 1</button>
      <button className="join-item btn btn-lg bg-custom-yellow text-black hover:bg-black hover:text-custom-yellow">»</button>
    </div>
  );
};

export default Pagination;
