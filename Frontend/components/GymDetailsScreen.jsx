import React, { useState, useEffect } from 'react';

import {

StyleSheet,

Text,

View,

ScrollView,

Image,

TouchableOpacity,

Dimensions,

ActivityIndicator,

Linking,

} from 'react-native';

import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import axios from 'axios';



import Header from './Header';

import Footer from './Footer';



const { width } = Dimensions.get('window');

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;



export default function GymDetailsScreen({ route, navigation }) {

const { gymId } = route.params || {};

const [gym, setGym] = useState(null);

const [loading, setLoading] = useState(true);



useEffect(() => {

if (gymId) {

fetchGymDetails();

} else {

setLoading(false);

}

}, [gymId]);



const fetchGymDetails = async () => {

try {

setLoading(true);

const response = await axios.get(`${API_BASE_URL}/gyms/details/${gymId}`);

if (response.data && response.data.success) {

setGym(response.data.gym);

} else {

setGym(response.data);

}

} catch (error) {

console.error(error);

} finally {

setLoading(false);

}

};



const openMapLocation = () => {

if (gym && gym.latitude && gym.longitude) {

const url = `https://www.google.com/maps/search/?api=1&query=${gym.latitude},${gym.longitude}`;

Linking.openURL(url).catch(err => console.error(err));

} else {

alert("Location coordinates are not available for this gym.");

}

};



const makeCall = () => {

if (gym && gym.contact) {

const phoneNumber = gym.contact.replace(/[^0-9+]/g, '');

Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error(err));

} else {

alert("Contact number not available for this gym.");

}

};



if (loading) {

return (

<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>

<ActivityIndicator size="large" color="#DC2626" />

</View>

);

}



if (!gym) {

return (

<View style={styles.container}>

<Header />

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

<Text style={{ color: '#A1A1AA', fontSize: 16 }}>Gym details not found.</Text>

<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>

<Text style={{ color: '#DC2626', fontSize: 16, fontWeight: 'bold' }}>Go Back</Text>

</TouchableOpacity>

</View>

<Footer activeTab="ExploreGym" />

</View>

);

}



const gymImages = (gym.images && gym.images.length > 0) ? gym.images : (gym.image ? [gym.image] : ['https://placehold.co/600x400/18181B/FFFFFF?text=No+Image']);

const displayAddress = gym.address || `${gym.taluk || ''}, ${gym.city || ''}`;



return (

<View style={styles.container}>

<Header />



<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


<View style={styles.imageSliderContainer}>

<ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>

{gymImages.map((img, index) => (

<Image

key={index}

source={{ uri: img }}

style={styles.gymImage}

resizeMode="cover"

/>

))}

</ScrollView>

{gymImages.length > 1 && (

<View style={styles.paginationDots}>

{gymImages.map((_, i) => (

<View key={i} style={styles.dot} />

))}

</View>

)}

</View>



<Text style={styles.gymNameTitle}>{gym.name}</Text>



<View style={styles.infoCard}>

<View style={styles.infoRow}>

<Ionicons name="location-outline" size={24} color="#DC2626" style={styles.infoIcon} />

<Text style={styles.infoText}>{displayAddress}</Text>

</View>


<TouchableOpacity style={styles.directLocationBtn} onPress={openMapLocation} activeOpacity={0.8}>

<Ionicons name="navigate" size={14} color="#FFFFFF" />

<Text style={styles.directLocationText}>Direct Location</Text>

</TouchableOpacity>



<View style={[styles.infoRow, { marginTop: 20 }]}>

<Feather name="clock" size={20} color="#DC2626" style={styles.infoIcon} />

<Text style={styles.infoText}>

Mon – Sat: 5:00 AM – 10:00 PM{"\n"}Sunday: 6:00 AM – 12:00 PM

</Text>

</View>

</View>



<Text style={styles.sectionTitle}>Facilities & Amenities</Text>

<View style={styles.facilitiesCard}>

{gym.facilities && gym.facilities.length > 0 ? (

gym.facilities.map((fac, idx) => (

<View key={idx} style={styles.facilityBadge}>

<Ionicons name="checkmark-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />

<Text style={styles.facilityText}>{fac}</Text>

</View>

))

) : (

<Text style={{ color: '#A1A1AA', fontSize: 13, padding: 10 }}>No facilities listed.</Text>

)}

</View>



<Text style={styles.sectionTitle}>Gym Information</Text>

<View style={styles.gymInfoCard}>


<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<MaterialCommunityIcons name="weight-lifter" size={18} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Gym name</Text>

</View>

<Text style={styles.infoValue}>{gym.name}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<Ionicons name="checkmark-circle-outline" size={16} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Gym type</Text>

</View>

<Text style={styles.infoValue}>{gym.type || 'Strength & Fitness'}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<Feather name="phone-call" size={14} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Contact</Text>

</View>

<Text style={styles.infoValue}>{gym.contact || 'N/A'}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<Feather name="mail" size={14} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Email</Text>

</View>

<Text style={styles.infoValue}>{gym.email || 'N/A'}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<Ionicons name="time-outline" size={16} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Established</Text>

</View>

<Text style={styles.infoValue}>{gym.established || 'N/A'}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<Ionicons name="people-outline" size={16} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Total members</Text>

</View>

<Text style={styles.infoValue}>{gym.membersCount || '0'}+</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<FontAwesome5 name="walking" size={14} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Total trainers</Text>

</View>

<Text style={styles.infoValue}>{gym.trainersCount || '0'}</Text>

</View>



<View style={styles.infoLine}>

<View style={styles.labelContainer}>

<FontAwesome5 name="dumbbell" size={12} color="#DC2626" style={styles.lineIcon} />

<Text style={styles.infoLabel}>Equipments</Text>

</View>

<Text style={styles.infoValue}>{gym.equipmentsCount || '0'}+</Text>

</View>



</View>



<TouchableOpacity style={styles.contactBtn} onPress={makeCall} activeOpacity={0.8}>

<Feather name="phone-call" size={18} color="#FFFFFF" />

<Text style={styles.contactBtnText}>Direct Contact</Text>

</TouchableOpacity>



</ScrollView>



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

paddingBottom: 110,

},

imageSliderContainer: {

height: 220,

width: '100%',

position: 'relative',

marginBottom: 20,

backgroundColor: '#FFFFFF',

borderBottomLeftRadius: 20,

borderBottomRightRadius: 20,

overflow: 'hidden'

},

gymImage: {

width: width,

height: 220,

},

paginationDots: {

position: 'absolute',

bottom: 10,

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

gymNameTitle: {

fontSize: 22,

fontWeight: 'bold',

color: '#FFFFFF',

paddingHorizontal: 20,

marginBottom: 16,

},

infoCard: {

backgroundColor: '#18181B',

borderRadius: 16,

padding: 20,

marginHorizontal: 20,

marginBottom: 24,

},

infoRow: {

flexDirection: 'row',

alignItems: 'flex-start',

},

infoIcon: {

marginRight: 12,

marginTop: 2,

},

infoText: {

color: '#FFFFFF',

fontSize: 13,

lineHeight: 20,

fontWeight: '500',

flex: 1,

},

directLocationBtn: {

backgroundColor: '#DC2626',

flexDirection: 'row',

alignItems: 'center',

alignSelf: 'center',

paddingVertical: 8,

paddingHorizontal: 16,

borderRadius: 20,

marginTop: 15,

},

directLocationText: {

color: '#FFFFFF',

fontSize: 12,

fontWeight: 'bold',

marginLeft: 6,

},

sectionTitle: {

fontSize: 18,

fontWeight: 'bold',

color: '#FFFFFF',

paddingHorizontal: 20,

marginBottom: 12,

},

facilitiesCard: {

backgroundColor: '#18181B',

borderRadius: 16,

padding: 16,

marginHorizontal: 20,

marginBottom: 24,

flexDirection: 'row',

flexWrap: 'wrap',

gap: 10,

},

facilityBadge: {

backgroundColor: '#09090B',

flexDirection: 'row',

alignItems: 'center',

paddingVertical: 8,

paddingHorizontal: 12,

borderRadius: 8,

borderWidth: 1,

borderColor: '#27272A',

},

facilityText: {

color: '#FFFFFF',

fontSize: 12,

fontWeight: '500',

},

gymInfoCard: {

backgroundColor: '#18181B',

borderRadius: 16,

padding: 20,

marginHorizontal: 20,

marginBottom: 24,

},

infoLine: {

flexDirection: 'row',

alignItems: 'center',

marginBottom: 20,

},

labelContainer: {

flexDirection: 'row',

alignItems: 'center',

width: 140,

},

lineIcon: {

width: 20,

textAlign: 'center',

marginRight: 10,

},

infoLabel: {

color: '#71717A',

fontSize: 14,

fontWeight: '600',

},

infoValue: {

color: '#FFFFFF',

fontSize: 14,

fontWeight: 'bold',

flex: 1,

},

contactBtn: {

backgroundColor: '#DC2626',

flexDirection: 'row',

alignItems: 'center',

justifyContent: 'center',

paddingVertical: 14,

borderRadius: 16,

marginHorizontal: 20,

marginBottom: 20,

},

contactBtnText: {

color: '#FFFFFF',

fontSize: 16,

fontWeight: 'bold',

marginLeft: 10,

},

});