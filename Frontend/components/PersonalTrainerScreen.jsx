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
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

const API_URL = 'https://fit-nadu-backend.onrender.com/api';

export default function PersonalTrainerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainersList, setTrainersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/trainers/admin/all`);
      
      if (response.data.success) {
        const fetchedTrainers = response.data.trainers.map(trainer => ({
          id: trainer._id,
          name: trainer.name,
          location: `${trainer.city} / ${trainer.taluk}`,
          experience: trainer.experience || 'Experienced',
          image: trainer.image || 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=500',
        }));
        setTrainersList(fetchedTrainers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainersList.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.searchCardWrapper}>
          <View style={styles.searchCard}>
            <Text style={styles.searchHeaderLabel}>SEARCH PERSONAL TRAINER</Text>
            
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#DC2626" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter Trainer Name"
                placeholderTextColor="#A1A1AA"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular Trainers</Text>

        {filteredTrainers.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredTrainers.map((trainer) => (
              <View key={trainer.id} style={[styles.trainerCard, { width: cardWidth }]}>
                
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: trainer.image }} style={styles.avatarImage} resizeMode="cover" />
                </View>
                
                <Text style={styles.trainerName} numberOfLines={1}>{trainer.name}</Text>
                
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#DC2626" />
                  <Text style={styles.locationText} numberOfLines={1}>{trainer.location}</Text>
                </View>
                
                <Text style={styles.experienceText}>{trainer.experience}</Text>
                
                <TouchableOpacity 
                  style={styles.contactButton} 
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("Navigating to Trainer:", trainer.id);
                    navigation.navigate('TrainerDetails', { trainerId: trainer.id });
                  }}
                >
                  <Text style={styles.contactButtonText}>View Trainer</Text>
                </TouchableOpacity>
                
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#71717A', fontSize: 14 }}>No trainers found.</Text>
          </View>
        )}

      </ScrollView>

      <Footer activeTab="Trainer" />
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
  trainerCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#A00000',
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#27272A',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  trainerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 10,
    color: '#71717A',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#DC2626',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});