import React, { useState, useEffect } from 'react';

import {

StyleSheet,

Text,

View,

ScrollView,

Image,

TouchableOpacity,

Dimensions,

ActivityIndicator

} from 'react-native';

import { Feather } from '@expo/vector-icons';

import axios from 'axios';

import { Linking } from 'react-native';



import Header from './Header';

import Footer from './Footer';



const { width } = Dimensions.get('window');

const cardWidth = width * 0.52;



const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';



export default function HomeScreen({ navigation }) {

const [featuredGyms, setFeaturedGyms] = useState([]);

const [supplements, setSupplements] = useState([]);

const [featuredTrainers, setFeaturedTrainers] = useState([]);

const [loading, setLoading] = useState(true);



// My Fitness states

const [todayWorkout, setTodayWorkout] = useState('');

const [consumedStats, setConsumedStats] = useState({ kcal: 0, protein: 0, carbs: 0, fibre: 0 });

const [waterStatus, setWaterStatus] = useState({ filled: 0, goal: 0 });

const [progressPercentage, setProgressPercentage] = useState(0);



const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const todayName = daysOfWeek[new Date().getDay()];



useEffect(() => {

const fetchHomeData = async () => {

try {

const [gymsRes, suppsRes, trainersRes, fitnessRes] = await Promise.all([

axios.get(`${API_BASE_URL}/gyms/featured`),

axios.get(`${API_BASE_URL}/supplements/featured`),

axios.get(`${API_BASE_URL}/trainers/featured`),

axios.get(`${API_BASE_URL}/fitness`)

]);


setFeaturedGyms(gymsRes.data.gyms || []);

setSupplements(suppsRes.data.supplements || []);

setFeaturedTrainers(trainersRes.data.trainers || []);



if (fitnessRes.data && fitnessRes.data.success && fitnessRes.data.fitness) {

const fitData = fitnessRes.data.fitness;


// Workout today

if (fitData.workoutPlan && fitData.workoutPlan.length > 0) {

const todayPlan = fitData.workoutPlan.find(plan => plan.day === todayName);

if (todayPlan && todayPlan.workout) {

setTodayWorkout(todayPlan.workout);

} else {

setTodayWorkout('Rest Day');

}

} else {

setTodayWorkout('Add datas');

}



// Macros and Progress

if (fitData.nutrition) {

setWaterStatus({

filled: fitData.nutrition.waterIntake || 0,

goal: fitData.nutrition.waterGoal || 0

});



let totalKcal = 0;

let totalProtein = 0;

let totalCarbs = 0;

let totalFibre = 0;



if (fitData.nutrition.foodDiary) {

fitData.nutrition.foodDiary.forEach(food => {

totalKcal += food.kcal || 0;

totalProtein += food.protein || 0;

totalCarbs += food.carbs || 0;

totalFibre += food.fibre || 0;

});

}



setConsumedStats({

kcal: Math.round(totalKcal),

protein: Math.round(totalProtein),

carbs: Math.round(totalCarbs),

fibre: Math.round(totalFibre)

});



const targetKcal = fitData.nutrition.target?.kcal || 0;

if (targetKcal > 0) {

let percent = Math.round((totalKcal / targetKcal) * 100);

if (percent > 100) percent = 100;

setProgressPercentage(percent);

} else {

setProgressPercentage(0);

}

}

}



} catch (error) {

console.error("Error fetching home screen data: ", error);

} finally {

setLoading(false);

}

};



fetchHomeData();

}, []);



const SectionHeader = ({ title, onPress }) => (

<View style={styles.sectionHeader}>

<Text style={styles.sectionTitle}>{title}</Text>

<TouchableOpacity onPress={onPress}>

<Text style={styles.seeAllText}>See all</Text>

</TouchableOpacity>

</View>

);



const ItemCard = ({ item, type }) => {
    const imageUrl = item.image || (item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/150x150/18181B/FFFFFF?text=No+Image');
    const displayTitle = item.title || item.name || 'Unknown Item';
    
    let displaySubtitle = item.subtitle || '';
    if (!displaySubtitle) {
      if (item.city && item.taluk) {
        displaySubtitle = `${item.city}, ${item.taluk}`;
      } else if (item.specialization) {
        displaySubtitle = item.specialization;
      } else if (item.type) {
        displaySubtitle = item.type;
      } else if (item.description) {
        displaySubtitle = item.description;
      } else {
        displaySubtitle = 'Featured';
      }
    }

    return (
      <TouchableOpacity 
        style={[styles.itemCard, { width: cardWidth }]} 
        activeOpacity={0.8}
        onPress={() => {
          if (type === 'gym') {
            // FIX 1: Object-ku pathila gymId anuppurom
            navigation.navigate('GymDetails', { gymId: item._id || item.id });
          } else if (type === 'trainer') {
            // FIX 2: trainerId anuppurom
            navigation.navigate('TrainerDetails', { trainerId: item._id || item.id });
          } else if (type === 'supplement') {
            // FIX 3: Supplement Link safe open
            let url = item.websiteUrl || item.link;
            if (url) {
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
              }
              Linking.openURL(url).catch(err => console.error("URL Error:", err));
            } else {
              navigation.navigate('Supplements');
            }
          }
        }}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        <Text style={styles.cardTitle} numberOfLines={1}>{displayTitle}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{displaySubtitle}</Text>
      </TouchableOpacity>
    );
  };



return (

<View style={styles.container}>

<Header />



<ScrollView

contentContainerStyle={styles.scrollContent}

showsVerticalScrollIndicator={false}

>


{/* 1. Featured Near You */}

<SectionHeader title="Popular Near You" onPress={() => navigation.navigate('ExploreGym')} />

{loading ? (

<ActivityIndicator size="small" color="#DC2626" style={{ marginVertical: 20 }} />

) : featuredGyms.length > 0 ? (

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>

{featuredGyms.map((item) => <ItemCard key={item._id || item.id} item={item} type="gym" />)}

</ScrollView>

) : (

<Text style={{ color: '#A1A1AA', fontSize: 12, paddingHorizontal: 20, marginBottom: 20 }}>No featured gyms found.</Text>

)}



{/* 2. Popular Supplements */}

<SectionHeader title="Popular Supplements" onPress={() => navigation.navigate('Supplements')} />

{loading ? (

<ActivityIndicator size="small" color="#DC2626" style={{ marginVertical: 20 }} />

) : supplements.length > 0 ? (

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>

{supplements.map((item) => <ItemCard key={item._id || item.id} item={item} type="supplement" />)}

</ScrollView>

) : (

<Text style={{ color: '#A1A1AA', fontSize: 12, paddingHorizontal: 20, marginBottom: 20 }}>No supplements found.</Text>

)}



{/* 3. Popular Trainers */}

<SectionHeader title="Popular Trainers" onPress={() => navigation.navigate('Trainer')} />

{loading ? (

<ActivityIndicator size="small" color="#DC2626" style={{ marginVertical: 20 }} />

) : featuredTrainers.length > 0 ? (

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>

{featuredTrainers.map((item) => <ItemCard key={item._id || item.id} item={item} type="trainer" />)}

</ScrollView>

) : (

<Text style={{ color: '#A1A1AA', fontSize: 12, paddingHorizontal: 20, marginBottom: 20 }}>No popular trainers found.</Text>

)}



{/* 4. My Fitness Dynamic Integration */}

<SectionHeader title="My Fitness" onPress={() => navigation.navigate('Fitness')} />


<View style={styles.fitnessContainer}>

<View style={styles.fitnessLeft}>

<Text style={styles.fitnessBoxTitle}>Workout plan</Text>


<View style={[styles.workoutRow, { marginTop: 8 }]}>

<Text style={[styles.workoutTextBold, { fontSize: 15 }]}>{todayName}</Text>

</View>

<View style={styles.workoutRow}>

<Text style={[styles.workoutTextLight, { color: '#DC2626', fontWeight: 'bold' }]}>

{todayWorkout}

</Text>

</View>



{/* Added Water Data Here */}

<View style={{ marginTop: 25 }}>

<Text style={styles.waterStatusText}>Water: {waterStatus.filled}/{waterStatus.goal} L</Text>

</View>

</View>



<View style={styles.verticalDivider} />



<View style={styles.fitnessRight}>

<Text style={styles.fitnessBoxTitle}>Daily nutrition</Text>


<View style={styles.nutritionContent}>

<View style={styles.nutritionLabels}>

<Text style={styles.nutritionLabelText}>Kcal: <Text style={{color: '#E4E4E7', fontWeight: 'normal'}}>{consumedStats.kcal}</Text></Text>

<Text style={styles.nutritionLabelText}>Protine: <Text style={{color: '#E4E4E7', fontWeight: 'normal'}}>{consumedStats.protein}g</Text></Text>

<Text style={styles.nutritionLabelText}>Carbs: <Text style={{color: '#E4E4E7', fontWeight: 'normal'}}>{consumedStats.carbs}g</Text></Text>

<Text style={styles.nutritionLabelText}>Fiber: <Text style={{color: '#E4E4E7', fontWeight: 'normal'}}>{consumedStats.fibre}g</Text></Text>

</View>



<View style={styles.progressRingWrapper}>

<View style={[styles.progressRing, { borderTopColor: progressPercentage >= 50 ? '#DC2626' : '#FFFFFF', borderLeftColor: progressPercentage >= 75 ? '#DC2626' : '#FFFFFF' }]}>

<View style={styles.progressTextContainer}>

<Text style={styles.progressPercentage}>{progressPercentage} %</Text>

</View>

</View>

</View>

</View>

</View>

</View>



<Text style={[styles.sectionTitle, { marginBottom: 16, marginTop: 10, paddingHorizontal: 20 }]}>Quick actions</Text>

<View style={styles.quickActionsContainer}>

<TouchableOpacity

style={styles.quickActionCard}

activeOpacity={0.8}

onPress={() => navigation.navigate('ExploreGym')}

>

<View style={styles.actionIconCircle}>

<Feather name="map-pin" size={16} color="#FFFFFF" />

</View>

<Text style={styles.actionTitle}>Find gyms</Text>

<Text style={styles.actionSubtitle}>Browse nearby studios</Text>

</TouchableOpacity>



<TouchableOpacity

style={styles.quickActionCard}

activeOpacity={0.8}

onPress={() => navigation.navigate('Supplements')}

>

<View style={styles.actionIconCircle}>

<Feather name="shopping-bag" size={16} color="#FFFFFF" />

</View>

<Text style={styles.actionTitle}>Shop supplements</Text>

<Text style={styles.actionSubtitle}>Browse nutrition essentials</Text>

</TouchableOpacity>

</View>



<View style={styles.bannerContainer}>

<View style={styles.bannerLeft}>

<Image

source={require('../assets/pt.png')}

style={styles.bannerImage}

resizeMode="contain"

/>

</View>

<View style={styles.bannerRight}>

<Text style={styles.bannerTitle}>Unlock Your Potential</Text>

<Text style={styles.bannerSubtitle}>Get a personalised fitness plan from our industry expert Trainer</Text>

<TouchableOpacity

style={styles.bannerButton}

activeOpacity={0.9}

onPress={() => navigation.navigate('Trainer')}

>

<Text style={styles.bannerButtonText}>Get a Contact</Text>

</TouchableOpacity>

</View>

</View>



</ScrollView>



<Footer activeTab="Home" />

</View>

);

}



const styles = StyleSheet.create({

container: { flex: 1, backgroundColor: '#09090B' },

scrollContent: { paddingTop: 10, paddingBottom: 110 },

sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10, paddingHorizontal: 20 },

sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },

seeAllText: { fontSize: 13, color: '#DC2626', fontWeight: '600' },

gridContainer: { flexDirection: 'row', gap: 15, paddingLeft: 20, paddingRight: 20, marginBottom: 20 },


itemCard: {

backgroundColor: '#18181B',

borderRadius: 14,

padding: 12,

borderWidth: 1,

borderColor: '#27272A',

height: 185

},

cardImage: {

width: '100%',

height: 115,

borderRadius: 10,

marginBottom: 10

},


cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },

cardSubtitle: { fontSize: 11, color: '#A1A1AA', lineHeight: 14 },


fitnessContainer: { flexDirection: 'row', backgroundColor: '#18181B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272A', marginHorizontal: 20, marginBottom: 24 },

fitnessLeft: { flex: 1, paddingRight: 10 },

fitnessRight: { flex: 1, paddingLeft: 10 },

verticalDivider: { width: 1, backgroundColor: '#3F3F46', marginVertical: 4 },

fitnessBoxTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16, textAlign: 'center' },

workoutRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },

workoutTextBold: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

workoutTextLight: { fontSize: 12, color: '#D4D4D8' },


waterStatusText: { fontSize: 14, color: '#ffffff', textAlign: 'left', fontWeight: '600' },



nutritionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },

nutritionLabels: { justifyContent: 'space-between', height: 90 },

nutritionLabelText: { fontSize: 11, color: '#DC2626', fontWeight: 'bold', marginBottom: 4 },


progressRingWrapper: { alignItems: 'center', justifyContent: 'center' },

progressRing: {

width: 66,

height: 66,

borderRadius: 33,

borderWidth: 8,

borderColor: '#DC2626',

borderRightColor: '#FFFFFF',

borderBottomColor: '#FFFFFF',

justifyContent: 'center',

alignItems: 'center',

transform: [{ rotate: '45deg' }]

},

progressTextContainer: {

transform: [{ rotate: '-45deg' }],

backgroundColor: '#FFFFFF',

width: 50,

height: 50,

borderRadius: 25,

justifyContent: 'center',

alignItems: 'center'

},

progressPercentage: { fontSize: 14, fontWeight: '900', color: '#000000' },


quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },

quickActionCard: { flex: 1, backgroundColor: '#18181B', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#27272A', marginHorizontal: 5 },

actionIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DC2626', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },

actionTitle: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },

actionSubtitle: { fontSize: 11, color: '#A1A1AA', lineHeight: 14 },


bannerContainer: {

flexDirection: 'row',

backgroundColor: '#6D0104',

borderRadius: 20,

padding: 16,

marginHorizontal: 20,

alignItems: 'center',

minHeight: 130

},

bannerLeft: {

width: 90,

height: 110,

alignItems: 'center',

justifyContent: 'center'

},

bannerImage: {

width: '100%',

height: '100%'

},

bannerRight: { flex: 1, paddingLeft: 12 },

bannerTitle: {

fontSize: 16,

fontWeight: '900',

color: '#FFFFFF',

marginBottom: 6,

textShadowColor: 'rgba(0, 0, 0, 0.75)',

textShadowOffset: { width: -1, height: 1 },

textShadowRadius: 10

},

bannerSubtitle: { fontSize: 11, color: '#E4E4E7', lineHeight: 15, marginBottom: 14 },

bannerButton: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'flex-start' },

bannerButtonText: { color: '#A00000', fontSize: 13, fontWeight: 'bold' },

});