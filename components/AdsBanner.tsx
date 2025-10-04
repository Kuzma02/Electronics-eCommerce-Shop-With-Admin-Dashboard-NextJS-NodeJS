// *********************
// Role of the component: Display active advertisements banner
// Name of the component: AdsBanner.tsx
// Developer: AI Assistant
// Version: 1.0
// Component call: <AdsBanner />
// Input parameters: no input parameters
// Output: Carousel/Banner of active advertisements
// *********************

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Ad {
  id: string;
  image: string;
  name: string;
  title: string;
  desc: string;
  startDate: string;
  endDate: string;
  isShow: boolean;
}

const AdsBanner = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAds = async () => {
      try {
        const response = await fetch("/api/ads?active=true");
        if (!response.ok) throw new Error("Failed to fetch ads");
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAds();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  if (loading || ads.length === 0) {
    return null; // Don't show anything if no active ads
  }

  return (
    <div className="relative w-full h-[400px] max-w-screen-2xl mx-auto overflow-hidden rounded-xl shadow-2xl my-8 max-md:h-[300px]">
      {/* Ads Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="min-w-full h-full relative">
            <Image
              src={ad.image}
              alt={ad.name}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-12 max-md:px-6">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-bold text-white mb-4 animate-fadeIn max-md:text-3xl">
                  {ad.title}
                </h2>
                <p className="text-xl text-gray-200 mb-6 max-md:text-base">
                  {ad.desc}
                </p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Shop Now
                  </button>
                  <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-3 rounded-full hover:bg-white/50 transition-all duration-200 z-10"
          >
            <FaChevronLeft className="text-white text-xl" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-3 rounded-full hover:bg-white/50 transition-all duration-200 z-10"
          >
            <FaChevronRight className="text-white text-xl" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsBanner;
