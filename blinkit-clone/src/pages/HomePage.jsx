import React from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import OfferTicker from '../components/OfferTicker';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';
import { products, getFeaturedProducts } from '../data/products';

const recommended = products.slice(0, 12);
const featured = getFeaturedProducts();
const topDeals = products.filter(p => p.discount >= 15);
const breakfast = products.filter(p => p.category === 'breakfast' || p.category === 'dairy');

const HomePage = ({ onCartClick }) => {
  return (
    <div className="home-page">
      <OfferTicker />
      <HeroBanner />
      <CategoryGrid />

      <ProductSection
        title="🔥 Bestsellers & Featured"
        products={featured}
        viewAllLink="/category/dairy"
      />

      <ProductSection
        title="💸 Top Deals"
        products={topDeals}
        viewAllLink="/category/snacks"
      />

      <ProductSection
        title="🌅 Breakfast Essentials"
        products={breakfast}
        viewAllLink="/category/breakfast"
      />

      <ProductSection
        title="✨ Recommended For You"
        products={recommended}
      />

      <Footer />
    </div>
  );
};

export default HomePage;
