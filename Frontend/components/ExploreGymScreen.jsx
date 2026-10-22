import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import CachedImage from './CachedImage'; 

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const API_URL = 'https://fit-nadu-backend.onrender.com/api';

const tnData = {
  "Ariyalur": ["Ariyalur", "Sendurai", "Udayarpalayam", "Andimadam"],
  "Chengalpattu": ["Chengalpattu", "Cheyyur", "Madurantakam", "Pallavaram", "Tambaram", "Thiruporur", "Tirukalukundram", "Vandalur"],
  "Chennai": ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Madhavaram", "Madhuravoyal", "Mambalam", "Manali", "Mylapore", "Perambur", "Purasawalkam", "Royapuram", "Sholinganallur", "Thiruvottiyur", "Tondiarpet", "Velachery"],
  "Coimbatore": ["Anamalai", "Annur", "Coimbatore North", "Coimbatore South", "Kinathukadavu", "Madukkarai", "Mettupalayam", "Perur", "Pollachi", "Sulur", "Valparai"],
  "Cuddalore": ["Bhuvanagiri", "Chidambaram", "Cuddalore", "Kattumannarkoil", "Kurinjipadi", "Panruti", "Srimushnam", "Tittakudi", "Vriddhachalam"],
  "Dharmapuri": ["Dharmapuri", "Harur", "Karimangalam", "Nallampalli", "Palacode", "Pappireddipatti", "Pennagaram"],
  "Dindigul": ["Athoor", "Dindigul East", "Dindigul West", "Kodaikanal", "Natham", "Nilakottai", "Oddanchatram", "Palani", "Vedasandur"],
  "Erode": ["Anthiyur", "Bhavani", "Erode", "Gobichettipalayam", "Modakkurichi", "Nambiyur", "Perundurai", "Sathyamangalam", "Thalavadi"],
  "Kallakurichi": ["Chinnasalem", "Kallakurichi", "Kalrayan Hills", "Sankarapuram", "Tirukoilur", "Ulundurpet"],
  "Kanchipuram": ["Kanchipuram", "Kundrathur", "Sriperumbudur", "Uthiramerur", "Walajabad"],
  "Kanyakumari": ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"],
  "Karur": ["Aravakurichi", "Kadavur", "Karur", "Krishnarayapuram", "Kulithalai", "Manmangalam", "Pugalur"],
  "Krishnagiri": ["Anchetty", "Bargur", "Denkanikottai", "Hosur", "Krishnagiri", "Pochampalli", "Shoolagiri", "Uthangarai"],
  "Madurai": ["Kottaampatti", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Melur", "Peraiyur", "Thirumangalam", "Thirupparankundram", "Usilampatti", "Vadipatti"],
  "Mayiladuthurai": ["Mayiladuthurai", "Kuthalam", "Sirkali", "Tharangambadi"],
  "Nagapattinam": ["Kilvelur", "Nagapattinam", "Thirukkuvalai", "Vedaranyam"],
  "Namakkal": ["Kolli Hills", "Kumarapalayam", "Mohanur", "Namakkal", "Paramathi Velur", "Rasipuram", "Senthamangalam", "Tiruchengode"],
  "Nilgiris": ["Coonoor", "Gudalur", "Kundah", "Kotagiri", "Pandalur", "Ooty"],
  "Perambalur": ["Alathur", "Perambalur", "Kunnam", "Veppanthattai"],
  "Pudukottai": ["Alangudi", "Aranthangi", "Avur", "Gandarvakottai", "Iluppur", "Karambakudi", "Manamelkudi", "Ponnamaravathi", "Pudukottai", "Thirumayam", "Tiruvarankulam"],
  "Ramanathapuram": ["Kadaladi", "Kamuthi", "Mudukulathur", "Paramakudi", "Ramanathapuram", "Rameswaram", "Thiruvadanai"],
  "Ranipet": ["Arakkonam", "Arcot", "Kalavai", "Nemili", "Ranipet", "Walajah"],
  "Salem": ["Attur", "Edappadi", "Gangavalli", "Kadaiyampatti", "Mettur", "Omalur", "Pethanaickenpalayam", "Salem", "Salem South", "Salem West", "Sangagiri", "Yercaud"],
  "Sivaganga": ["Devakkottai", "Ilayankudi", "Kalaiyarkoil", "Manamadurai", "Sivaganga", "Singampunari", "Thirupathur", "Tirupuvanam"],
  "Tenkasi": ["Alangulam", "Kadayanallur", "Sankarankovil", "Shenkottai", "Sivagiri", "Tenkasi", "Thiruvengadam", "V.K. Pudur"],
  "Thanjavur": ["Budalur", "Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Peravurani", "Thanjavur", "Thiruvaiyaru", "Thiruvidaimarudur"],
  "Theni": ["Aundipatti", "Bodinayakanur", "Periyakulam", "Theni", "Uthamapalayam"],
  "Thoothukudi": ["Eral", "Kovilpatti", "Ottapidaram", "Srivaikundam", "Sathankulam", "Tiruchendur", "Thoothukudi", "Vilathikulam", "Kadambur"],
  "Tiruchirappalli": ["Lalgudi", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thuraiyur", "Trichy East", "Trichy West", "Thiruverumbur", "Manachanallur"],
  "Tirunelveli": ["Ambasamudram", "Cheranmahadevi", "Nanguneri", "Radhapuram", "Manur", "Palayamkottai", "Tirunelveli", "Thisayanvilai"],
  "Tirupattur": ["Ambur", "Natrampalli", "Tirupattur", "Vaniyambadi"],
  "Tiruppur": ["Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Tiruppur North", "Tiruppur South", "Udumalaipettai", "Uthukuli"],
  "Tiruvallur": ["Ambattur", "Gummidipoondi", "Pallipattu", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruvallur", "Tiruttani", "Uthukottai"],
  "Tiruvannamalai": ["Arani", "Cheyyar", "Chengam", "Gepil", "Kilpennathur", "Polur", "Thandrampet", "Tiruvannamalai", "Vandavasi", "Jawadhu Hills"],
  "Tiruvarur": ["Kudavasal", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Tiruvarur", "Valangaiman"],
  "Vellore": ["Anaicut", "Gudiyatham", "Katpadi", "KV Kuppam", "Vellore"],
  "Villupuram": ["Gingee", "Kallakurichi", "Kandachipuram", "Marakkanam", "Melmalaiyanur", "Tindivanam", "Vanur", "Vikravandi", "Villupuram"],
  "Virudhunagar": ["Aruppukottai", "Kariyapatti", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Virudhunagar"]
};

export default function ExploreGymScreen({ navigation }) {
  const [selectedDistrict, setSelectedDistrict] = useState('Select district');
  const [selectedTaluka, setSelectedTaluka] = useState('Select Thaluka');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [currentTalukas, setCurrentTalukas] = useState([]);

  const [gymsList, setGymsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const districtsList = Object.keys(tnData);

  useEffect(() => {
    fetchGyms();
  }, [selectedDistrict, selectedTaluka]);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/gyms/admin/all`;
      const response = await axios.get(url);
      
      if (response.data.success) {
        let fetchedGyms = response.data.gyms;

        if (selectedDistrict !== 'Select district') {
          fetchedGyms = fetchedGyms.filter(gym => gym.city && gym.city.toLowerCase() === selectedDistrict.toLowerCase());
        }

        if (selectedTaluka !== 'Select Thaluka') {
          fetchedGyms = fetchedGyms.filter(gym => gym.taluk && gym.taluk.toLowerCase() === selectedTaluka.toLowerCase());
        }

        const formattedGyms = fetchedGyms.map(gym => ({
          id: gym._id,
          title: gym.name,
          subtitle: `${gym.type || 'Strength & Fitness'}\n${gym.taluk}, ${gym.city}`,
          image: (gym.images && gym.images.length > 0) ? gym.images[0] : (gym.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500')
        }));

        setGymsList(formattedGyms);
      }
    } catch (error) {
      console.error('Error fetching gyms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type) => {
    if (type === 'taluka' && selectedDistrict === 'Select district') {
      return; 
    }
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelectItem = (item) => {
    if (modalType === 'district') {
      setSelectedDistrict(item);
      setSelectedTaluka('Select Thaluka');
      setCurrentTalukas(tnData[item] || []);
    } else {
      setSelectedTaluka(item);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationHeaderText}>SELECT YOUR LOCATION</Text>
          </View>
          
          <View style={styles.locationBody}>
            <Ionicons name="location-outline" size={26} color="#DC2626" style={styles.pinIcon} />
            
            <TouchableOpacity 
              style={styles.selectorBlock} 
              activeOpacity={0.7}
              onPress={() => handleOpenModal('district')}
            >
              <View style={styles.selectorTextWrap}>
                <Text style={styles.selectorTitle} numberOfLines={1}>{selectedDistrict}</Text>
                <Text style={styles.selectorSubtitle}>Tap to choose</Text>
              </View>
              <Feather name="chevron-down" size={16} color="#DC2626" />
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity 
              style={[styles.selectorBlock, selectedDistrict === 'Select district' && { opacity: 0.5 }]} 
              activeOpacity={0.7}
              onPress={() => handleOpenModal('taluka')}
            >
              <View style={styles.selectorTextWrap}>
                <Text style={styles.selectorTitle} numberOfLines={1}>{selectedTaluka}</Text>
                <Text style={styles.selectorSubtitle}>Tap to choose</Text>
              </View>
              <Feather name="chevron-down" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Gyms Near You</Text>

        {gymsList.length > 0 ? (
          <View style={styles.gridContainer}>
            {gymsList.map((gym, index) => (
              <View key={gym.id || index} style={[styles.gymCard, { width: cardWidth }]}>
                {/* Normal Image tag-ku pathila CachedImage use panniyachu */}
                <CachedImage source={gym.image} style={styles.cardImage} resizeMode="cover" />
                <Text style={styles.cardTitle} numberOfLines={1}>{gym.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>{gym.subtitle}</Text>
                
                <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('GymDetails', { gymId: gym.id })}
                >
                  <Text style={styles.exploreButtonText}>Explore</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#71717A', fontSize: 14 }}>No gyms found for this location.</Text>
          </View>
        )}

      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'district' ? 'Select District' : 'Select Taluka'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={modalType === 'district' ? districtsList : currentTalukas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Footer activeTab="ExploreGym" />
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
  locationCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#A00000',
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  locationHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingVertical: 12,
    alignItems: 'center',
  },
  locationHeaderText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  locationBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pinIcon: {
    marginRight: 16,
  },
  selectorBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorTextWrap: {
    flex: 1,
  },
  selectorTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  selectorSubtitle: {
    fontSize: 11,
    color: '#71717A',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#27272A',
    marginHorizontal: 16,
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
  gymCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.15)',
    justifyContent: 'space-between',
    minHeight: 210, 
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#A1A1AA',
    lineHeight: 15,
    marginBottom: 10,
  },
  exploreButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#27272A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  modalItemText: {
    fontSize: 15,
    color: '#E4E4E7',
    fontWeight: '500',
  },
});