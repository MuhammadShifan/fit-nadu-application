import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import CachedImage from './CachedImage';

const { width } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';

export default function TrainerDetailsScreen({ route, navigation }) {
  const { trainerId } = route.params || {};
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trainerId) {
      fetchTrainerDetails();
    } else {
      setLoading(false);
    }
  }, [trainerId]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/trainers/details/${trainerId}`);
      if (response.data && response.data.success) {
        setTrainer(response.data.trainer);
      } else {
        setTrainer(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openInstagram = () => {
    if (trainer && trainer.instagram) {
      const username = trainer.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${username}`).catch(err => console.error(err));
    } else {
      alert("Instagram ID not available for this trainer.");
    }
  };

  const openEmail = () => {
    if (trainer && trainer.email) {
      Linking.openURL(`mailto:${trainer.email}`).catch(err => console.error(err));
    } else {
      alert("Email not available for this trainer.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  if (!trainer) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#A1A1AA', fontSize: 16 }}>Trainer details not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#DC2626', fontSize: 16, fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <Footer activeTab="PersonalTrainer" />
      </View>
    );
  }

  const trainerImages = trainer.images && trainer.images.length > 0 ? trainer.images : (trainer.image ? [trainer.image] : ['https://placehold.co/600x600/18181B/FFFFFF?text=No+Image']);
  const displayLocation = trainer.taluk && trainer.city ? `${trainer.taluk}/${trainer.city}` : (trainer.city || 'N/A');

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Personal Trainer</Text>

        <View style={styles.imageSliderContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {trainerImages.map((img, index) => (
              /* Normal Image tag-ku pathila CachedImage use panniyachu */
              <CachedImage
                key={index}
                source={img}
                style={styles.trainerImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {trainerImages.length > 1 && (
            <View style={styles.paginationDots}>
              {trainerImages.map((_, i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Trainer Information</Text>

        <View style={styles.trainerInfoCard}>
          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Trainer name</Text>
            <Text style={styles.infoValue}>{trainer.name}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{trainer.age || 'N/A'}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{trainer.gender || 'N/A'}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{displayLocation}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Experience</Text>
            <Text style={styles.infoValue}>{trainer.experience || '0+'}</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity onPress={openInstagram} activeOpacity={0.8}>
                {/* Social icons-kum CachedImage use panniyachu */}
                <CachedImage
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384063.png' }}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={openEmail} activeOpacity={0.8}>
                <CachedImage
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968534.png' }}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingBottom: 110,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  imageSliderContainer: {
    height: 400,
    width: width - 40,
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden'
  },
  trainerImage: {
    width: width - 40,
    height: 400,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#18181B',
    marginHorizontal: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  trainerInfoCard: {
    backgroundColor: '#18181B',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoLabel: {
    color: '#71717A',
    fontSize: 15,
    fontWeight: '700',
    width: 130,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  contactSection: {
    marginTop: 10,
    alignItems: 'center',
  },
  contactTitle: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginBottom: 10,
  },
  socialIcon: {
    width: 45,
    height: 45,
  }
});