"use client";
import React, { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import Range from "./Range";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [inputCategory, setInputCategory] = useState<any>({
    box1: { text: "logitech", isChecked: true },
    box2: { text: "bosch", isChecked: true },
    box3: { text: "lenovo", isChecked: true },
    box4: { text: "hp", isChecked: true },
    box5: { text: "samsung", isChecked: true },
    box6: { text: "huawei", isChecked: true },
    box7: { text: "apple", isChecked: true },
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });

  useEffect(() => {
    const params = new URLSearchParams();

    // params.set("logitech", inputCategory.box1.isChecked);
    // params.set("womenNewEdition", inputCategory.box2.isChecked);
    params.set("rating", inputCategory.ratingFilter.value);
    params.set("price", inputCategory.priceFilter.value);
    replace(`${pathname}?${params}`);
  }, [inputCategory]);

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Out of stock</span>
          </label>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Manufacturer</h3>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box1.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box1: {
                    text: "logitech",
                    isChecked: !inputCategory.box1.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Logitech</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box2.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box2: {
                    text: "bosch",
                    isChecked: !inputCategory.box2.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Bosch</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box3.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box3: {
                    text: "lenovo",
                    isChecked: !inputCategory.box3.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Lenovo</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box4.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box4: {
                    text: "hp",
                    isChecked: !inputCategory.box4.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">HP</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box5.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box5: {
                    text: "samsung",
                    isChecked: !inputCategory.box5.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Samsung</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box6.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box6: {
                    text: "huawei",
                    isChecked: !inputCategory.box6.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Huawei</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.box7.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  box7: {
                    text: "apple",
                    isChecked: !inputCategory.box7.isChecked,
                  },
                })
              }
              className="checkbox checkbox-warning"
            />
            <span className="label-text text-lg ml-2">Apple</span>
          </label>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price</h3>
        <div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range range-warning"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: e.target.value,
                },
              })
            }
          />
          <span>{`Max price: $${inputCategory.priceFilter.value}`}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="text-xl mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: e.target.value },
            })
          }
          className="range range-warning"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
