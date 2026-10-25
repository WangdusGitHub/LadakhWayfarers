import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DriverConfig, TourPackage, GalleryItem, Review, ReviewFormData } from '../types';
import { DRIVER_CONFIG } from '../data/config';
import { TOURS_DATA } from '../data/toursData';
import { GALLERY_DATA } from '../data/galleryData';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import {
  fetchDriverConfig,
  fetchTours,
  fetchGallery,
  fetchReviews,
  submitReview,
  incrementHelpful,
  checkSystemStatus
} from '../services/apiService';

interface DataContextType {
  driverConfig: DriverConfig;
  tours: TourPackage[];
  gallery: GalleryItem[];
  reviews: Review[];
  isLoading: boolean;
  isMongoConnected: boolean;
  isCloudinaryConfigured: boolean;
  refreshData: () => Promise<void>;
  addReview: (formData: ReviewFormData) => Promise<Review>;
  upvoteReview: (reviewId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [driverConfig, setDriverConfig] = useState<DriverConfig>(DRIVER_CONFIG as DriverConfig);
  const [tours, setTours] = useState<TourPackage[]>(TOURS_DATA);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_DATA);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [isCloudinaryConfigured, setIsCloudinaryConfigured] = useState<boolean>(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configData, toursData, galleryData, reviewsData, status] = await Promise.all([
        fetchDriverConfig(),
        fetchTours(),
        fetchGallery(),
        fetchReviews(),
        checkSystemStatus()
      ]);

      if (configData) setDriverConfig(configData);
      if (toursData && toursData.length > 0) setTours(toursData);
      if (galleryData && galleryData.length > 0) setGallery(galleryData);
      if (reviewsData && reviewsData.length > 0) setReviews(reviewsData);

      setIsMongoConnected(Boolean(status?.mongodb?.connected));
      setIsCloudinaryConfigured(Boolean(status?.cloudinary?.configured));
    } catch (err) {
      console.warn('Error loading database data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleAddReview = async (formData: ReviewFormData): Promise<Review> => {
    const created = await submitReview(formData);
    setReviews(prev => [created, ...prev.filter(r => r.id !== created.id)]);
    return created;
  };

  const handleUpvoteReview = (reviewId: string): number => {
    const newCount = incrementHelpful(reviewId);
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, helpfulCount: newCount } : r))
    );
    return newCount;
  };

  return (
    <DataContext.Provider
      value={{
        driverConfig,
        tours,
        gallery,
        reviews,
        isLoading,
        isMongoConnected,
        isCloudinaryConfigured,
        refreshData: loadAllData,
        addReview: handleAddReview,
        upvoteReview: handleUpvoteReview
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
