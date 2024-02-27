import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";

const SingleReview = () => {
  return (
    <article className="w-[900px] mx-auto py-10 max-[1000px]:w-[700px] max-[750px]:w-[90%]">
      <div className="flex items-center mb-4">
        <Image
        width={40}
        height={40}
          className="w-10 h-10 me-4 rounded-full"
          src="/randomuser.jpg"
          alt="user image"
        />
        <div className="font-medium dark:text-white">
          <p>
            Jese Leos{" "}
            <time className="block text-sm text-gray-500 dark:text-gray-400">
              Joined on August 2014
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center mb-1 rtl:space-x-reverse">
        <FaStar className="text-custom-yellow text-lg" />
        <FaStar className="text-custom-yellow text-lg" />
        <FaStar className="text-custom-yellow text-lg" />
        <FaStar className="text-custom-yellow text-lg" />
        <FaStar className="text-custom-yellow text-lg" />
        <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
          Thinking to buy another one!
        </h3>
      </div>
      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Reviewed in the United Kingdom on <time>March 3, 2017</time>
        </p>
      </footer>
      <p className="mb-2 text-gray-500 dark:text-gray-400 max-[400px]:text-sm">
        This is my third Invicta Pro Diver. They are just fantastic value for
        money. This one arrived yesterday and the first thing I did was set the
        time, popped on an identical strap from another Invicta and went in the
        shower with it to test the waterproofing.... No problems.
      </p>
      <p className="mb-3 text-gray-500 dark:text-gray-400">
        It is obviously not the same build quality as those very expensive
        watches. But that is like comparing a Citroën to a Ferrari. This watch
        was well under £100! An absolute bargain.
      </p>
      <a
        href="#"
        className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
      >
        Read more
      </a>
      <aside>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          19 people found this helpful
        </p>
        <div className="flex items-center mt-3">
          <a
            href="#"
            className="px-2 py-1.5 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Helpful
          </a>
          <a
            href="#"
            className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
          >
            Report abuse
          </a>
        </div>
      </aside>
    </article>
  );
};

export default SingleReview;
