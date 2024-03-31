import React from "react";

const Pagination = () => {
  return (
    <div className="join flex justify-center py-16">
      <button className="join-item btn btn-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500">«</button>
      <button className="join-item btn btn-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500">Page 1</button>
      <button className="join-item btn btn-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500">»</button>
    </div>
  );
};

export default Pagination;
