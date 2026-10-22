import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

const API_URL = 'http://192.168.31.86:5000/api';

export default function BuySupplementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [brandsList, setBrandsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/supplements/admin/all`);
      
      if (response.data.success) {
        const fetchedBrands = response.data.supplements.map(brand => ({
          id: brand._id,
          brandName: brand.name,
          description: brand.description || 'Shop directly from official store. 100% genuine products.',
          rating: 5,
          image: brand.image || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500',
          websiteUrl: brand.websiteUrl
        }));
        setBrandsList(fetchedBrands);
      }
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brandsList.filter(brand =>
    brand.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBrand = (url) => {
    if (url) {
      let formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(formattedUrl).catch(err => console.error("Couldn't load page", err));
    } else {
      alert("Official website link not available.");
    }
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i < rating ? "star" : "star-outline"} 
          size={12} 
          color="#FACC15"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.searchCardWrapper}>
          <View style={styles.searchCard}>
            <Text style={styles.searchHeaderLabel}>SEARCH SUPPLEMENT BRAND</Text>
            
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#DC2626" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter Brand Name"
                placeholderTextColor="#A1A1AA"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular Brands</Text>

        {filteredBrands.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredBrands.map((brand) => (
              <View key={brand.id} style={[styles.brandCard, { width: cardWidth }]}>
                
                <View style={styles.brandImageContainer}>
                  <Image source={{ uri: brand.image }} style={styles.brandImage} resizeMode="cover" />
                </View>
                
                <View style={styles.ratingRow}>
                  <View style={styles.starsContainer}>
                    {renderStars(brand.rating)}
                  </View>
                  <View style={styles.certifiedContainer}>
                    <Ionicons name="shield-checkmark" size={10} color="#A1A1AA" />
                    <Text style={styles.certifiedText} numberOfLines={1}>{brand.brandName}</Text>
                  </View>
                </View>

                <Text style={styles.brandName} numberOfLines={1}>{brand.brandName}</Text>
                
                <Text style={styles.descriptionText} numberOfLines={4}>
                  {brand.description}
                </Text>
                
                {/* ALIGNMENT CHANGE PANNA BUTTON 👇 */}
                <TouchableOpacity 
                  style={styles.openButton} 
                  activeOpacity={0.8}
                  onPress={() => handleOpenBrand(brand.websiteUrl)}
                >
                  <Text style={styles.openButtonText}>Open</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" style={styles.arrowIcon} />
                </TouchableOpacity>
                
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#71717A', fontSize: 14 }}>No supplement brands found.</Text>
          </View>
        )}

      </ScrollView>

      <Footer activeTab="Supplements" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  searchCardWrapper: {
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  searchCard: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A00000',
    overflow: 'hidden',
  },
  searchHeaderLabel: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    letterSpacing: 0.5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09090B',
    margin: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // CARD HEIGHT FIX PANNIRUKKEN
  brandCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    minHeight: 250, // Fixed min height so cards look even
    justifyContent: 'space-between', // Pushes content evenly
  },
  brandImageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  certifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 4,
  },
  certifiedText: {
    fontSize: 8,
    color: '#71717A',
    marginLeft: 2,
  },
  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  // DESCRIPTION HEIGHT FIX PANNIRUKKEN
  descriptionText: {
    fontSize: 10,
    color: '#A1A1AA',
    marginBottom: 14,
    lineHeight: 14,
    fontStyle: 'italic',
    minHeight: 56, // Entha text irunthalum ithu fixed height edukkum
  },
  // BUTTON ALIGNMENT UPDATE PANNIRUKKEN (Gym screen maari Pill shape)
  openButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 'auto', // Always bottom mela push aagum
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 4,
  },
});