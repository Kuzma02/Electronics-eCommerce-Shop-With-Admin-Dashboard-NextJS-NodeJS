// *********************
// Role of the component: Dynamic hero carousel displaying active ads
// Name of the component: Hero.tsx
// Developer: AI Assistant (Updated from Aleksandar Kuzmanovic)
// Version: 2.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Dynamic carousel hero showing active advertisements with fallback to default content
// *********************

"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import Link from "next/link";

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

const Hero = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch ads
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

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, ads.length]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % ads.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, ads.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentIndex]
  );

  // Auto-slide
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 6000); // Auto-slide every 6 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length, handleNext]);

  // Loading state
  if (loading) {
    return (
      <div className="h-[700px] w-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center max-lg:h-[500px]">
        <FaSpinner className="animate-spin text-white text-6xl" />
      </div>
    );
  }

  // Default fallback if no ads
  if (ads.length === 0) {
    return (
      <div className="h-[700px] w-full bg-gradient-to-br from-blue-500 to-blue-700 max-lg:h-[900px] max-md:h-[750px]">
        <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
          <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
            <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
              THE PRODUCT OF THE FUTURE
            </h1>
            <p className="text-white max-sm:text-sm">
              Discover our amazing collection of electronics. From cutting-edge
              laptops to professional cameras, find everything you need for your
              tech lifestyle.
            </p>
            <div className="flex gap-x-4 max-lg:flex-col max-lg:gap-y-3">
              <Link href="/shop">
                <button className="bg-white text-blue-600 font-bold px-12 py-3 rounded-lg max-lg:text-xl max-sm:text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl w-full">
                  SHOP NOW
                </button>
              </Link>
              <Link href="/shop">
                <button className="bg-transparent border-2 border-white text-white font-bold px-12 py-3 rounded-lg max-lg:text-xl max-sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 w-full">
                  LEARN MORE
                </button>
              </Link>
            </div>
          </div>
          <Image
            src="/watch for banner.png"
            width={400}
            height={400}
            alt="smart watch"
            className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    );
  }

  // Dynamic Ads Carousel
  return (
    <div className="relative w-full h-[700px] overflow-hidden max-lg:h-[600px] max-md:h-[500px]">
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ads.map((ad, index) => (
          <div key={ad.id} className="min-w-full h-full relative">
            {/* Background Image */}
            <Image
              src={ad.image}
              alt={ad.name}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent max-md:bg-black/70" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-screen-2xl mx-auto px-10 w-full max-md:px-6">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <div className="inline-block mb-4">
                    <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      {ad.name}
                    </span>
                  </div>

                  {/* Title with animation */}
                  <h1
                    className={`text-7xl font-bold text-white mb-6 leading-tight max-xl:text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-3xl ${
                      index === currentIndex ? "animate-fadeInUp" : ""
                    }`}
                  >
                    {ad.title}
                  </h1>

                  {/* Description */}
                  <p
                    className={`text-xl text-gray-200 mb-8 leading-relaxed max-md:text-lg max-sm:text-base ${
                      index === currentIndex ? "animate-fadeInUp" : ""
                    }`}
                    style={{ animationDelay: "0.2s" }}
                  >
                    {ad.desc}
                  </p>

                  {/* CTA Buttons */}
                  <div
                    className={`flex gap-4 max-sm:flex-col ${
                      index === currentIndex ? "animate-fadeInUp" : ""
                    }`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Link href="/shop">
                      <button className="px-10 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform max-sm:w-full">
                        Shop Now
                      </button>
                    </Link>
                    <Link href="/shop">
                      <button className="px-10 py-4 bg-white/20 backdrop-blur-md text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-all duration-200 border-2 border-white/50 max-sm:w-full">
                        Learn More
                      </button>
                    </Link>
                  </div>
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
            disabled={isTransitioning}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all duration-200 z-20 disabled:opacity-50 disabled:cursor-not-allowed group max-md:p-3 max-md:left-4"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-white text-2xl group-hover:scale-110 transition-transform max-md:text-xl" />
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all duration-200 z-20 disabled:opacity-50 disabled:cursor-not-allowed group max-md:p-3 max-md:right-4"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-white text-2xl group-hover:scale-110 transition-transform max-md:text-xl" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20 max-md:bottom-6">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "bg-white w-12 h-3"
                  : "bg-white/50 hover:bg-white/75 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {ads.length > 1 && (
        <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold z-20 max-md:top-6 max-md:right-6 max-md:text-sm">
          {currentIndex + 1} / {ads.length}
        </div>
      )}
    </div>
  );
};

export default Hero;
