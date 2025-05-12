// Файл: Home.jsx
import React from 'react';
import BannerSlider from '../../components/BannerSlider/BannerSlider';
import CatalogSection from '../../components/CatalogSection/CatalogSection';

function Home() {
  return (
    <div>
      <BannerSlider />
      <CatalogSection />
    </div>
  );
}

export default Home;
