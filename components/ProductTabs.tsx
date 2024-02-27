"use client";

import React, { useState } from "react";

const ProductTabs = () => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);
  return (
    <div className="px-5">
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 0 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(0)}
        >
          Description
        </a>
        <a
          role="tab"
          className={`tab text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 1 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(1)}
        >
          Additional info
        </a>
        <a
          role="tab"
          className={`tab text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 2 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(2)}
        >
          Reviews
        </a>
      </div>
      <div className="pt-5">
        {currentProductTab === 0 && (
          <p className="text-lg max-sm:text-base max-sm:text-sm">
            Desc - Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Laborum ad illo recusandae eveniet nulla dignissimos, asperiores
            vero aliquid nemo ab excepturi dolores? Commodi quas vitae,
            laboriosam unde distinctio fugiat reprehenderit!
          </p>
        )}

        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="table text-xl text-center max-[500px]:text-base">
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>Vendor:</th>
                  <td>Lenovo</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>Category:</th>
                  <td>Laptop</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>Color:</th>
                  <td>Silver, LightSlateGray, Blue</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
