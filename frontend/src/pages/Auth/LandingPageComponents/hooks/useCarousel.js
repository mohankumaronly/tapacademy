import { useState, useCallback, useEffect } from 'react';

export const useCarousel = (itemsLength, autoPlayInterval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsLength);
  }, [itemsLength]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + itemsLength) % itemsLength);
  }, [itemsLength]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);

  return {
    currentIndex,
    direction,
    nextSlide,
    prevSlide,
    goToSlide
  };
};