'use client';

import React, { useState, useRef } from 'react';
import '@/Styles/topAttraction.css'

export interface CarouselItem {
   imageUrl: string;
   title: string;
   description: string;
   link?: string;
}

export interface ImageCarouselProps {
   items: CarouselItem[];
   className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items, className = '' }) => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const slideRef = useRef<HTMLDivElement>(null);

   const handleNext = () => {
      if (slideRef.current) {
         const items = slideRef.current.querySelectorAll('.carousel-item');
         const firstItem = items[0];
         if (firstItem) {
            slideRef.current.appendChild(firstItem);
         }
         setCurrentIndex((prev) => (prev + 1) % items.length);
      }
   };

   const handlePrev = () => {
      if (slideRef.current) {
         const items = slideRef.current.querySelectorAll('.carousel-item');
         const lastItem = items[items.length - 1];
         if (lastItem) {
            slideRef.current.prepend(lastItem);
         }
         setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      }
   };

   return (
      <div className={`carousel-container ${className}`}>
         <div className="carousel-slide" ref={slideRef}>
            {items.map((item, index) => (
               <div
                  key={index}
                  className="carousel-item"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
               >
                  <div className="carousel-overlay"></div>

                  <div className="carousel-content">
                     <div className="carousel-title">{item.title}</div>
                     <div className="carousel-description">{item.description}</div>
                     
                  </div>
               </div>
            ))}
         </div>
         <div className="carousel-controls">
            <button className="carousel-prev" onClick={handlePrev}>
               ◁
            </button>
            <button className="carousel-next" onClick={handleNext}>
               ▷
            </button>
         </div>
      </div>
   );
};

export default ImageCarousel;