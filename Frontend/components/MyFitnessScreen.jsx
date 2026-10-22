import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function MyFitnessScreen({ navigation }) {
  const [foodName, setFoodName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingFood, setIsFetchingFood] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [loggedFoods, setLoggedFoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waterGoal, setWaterGoal] = useState(0);
  const [filledGlasses, setFilledGlasses] = useState(0);

  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: '',
  });

  const [nutritionTarget, setNutritionTarget] = useState({
    kcal: '',
    protein: '',
    carbs: '',
    fibre: '',
  });

  const [tempPlan, setTempPlan] = useState({ ...weeklyPlan });
  const [tempWeight, setTempWeight] = useState('');
  const [tempHeight, setTempHeight] = useState('');
  const [tempWaterGoal, setTempWaterGoal] = useState('');
  const [tempKcal, setTempKcal] = useState('');
  const [tempProtein, setTempProtein] = useState('');
  const [tempCarbs, setTempCarbs] = useState('');
  const [tempFibre, setTempFibre] = useState('');

  useEffect(() => {
    fetchMyFitnessData();
  }, []);

  const fetchMyFitnessData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/fitness`);
      if (response.data && response.data.success) {
        const data = response.data.fitness;

        if (data.profile) {
          setWeight(data.profile.weight ? String(data.profile.weight) : '');
          setHeight(data.profile.height ? String(data.profile.height) : '');
        }

        if (data.nutrition) {
          setFilledGlasses(data.nutrition.waterIntake || 0);
          setWaterGoal(data.nutrition.waterGoal || 0);

          if (data.nutrition.target) {
            setNutritionTarget({
              kcal: data.nutrition.target.kcal ? String(data.nutrition.target.kcal) : '',
              protein: data.nutrition.target.protein ? String(data.nutrition.target.protein) : '',
              carbs: data.nutrition.target.carbs ? String(data.nutrition.target.carbs) : '',
              fibre: data.nutrition.target.fibre ? String(data.nutrition.target.fibre) : '',
            });
          }

          if (data.nutrition.foodDiary) {
            setLoggedFoods([...data.nutrition.foodDiary].reverse());
          }
        }

        if (data.workoutPlan && data.workoutPlan.length > 0) {
          const planObj = {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: '',
          };
          data.workoutPlan.forEach(item => {
            if (item.day) {
              planObj[item.day] = item.workout || '';
            }
          });
          setWeeklyPlan(planObj);
        }
      }
    } catch (error) {
      console.error("Error fetching fitness data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasDatasAdded = Boolean(
    weight ||
    height ||
    waterGoal > 0 ||
    nutritionTarget.kcal ||
    nutritionTarget.protein ||
    nutritionTarget.carbs ||
    nutritionTarget.fibre ||
    Object.values(weeklyPlan).some(val => val && val.trim() !== '')
  );

  const handleOpenModal = () => {
    setTempPlan({ ...weeklyPlan });
    setTempWeight(weight);
    setTempHeight(height);
    setTempWaterGoal(waterGoal > 0 ? String(waterGoal) : '');
    setTempKcal(nutritionTarget.kcal);
    setTempProtein(nutritionTarget.protein);
    setTempCarbs(nutritionTarget.carbs);
    setTempFibre(nutritionTarget.fibre);
    setModalVisible(true);
  };

  const handleSaveNewPlan = async () => {
    const cleanWeight = tempWeight.trim();
    const cleanHeight = tempHeight.trim();
    const parsedWater = parseInt(tempWaterGoal, 10);
    const validWaterGoal = !isNaN(parsedWater) && parsedWater > 0 ? parsedWater : 0;

    const updatedTarget = {
      kcal: tempKcal.trim(),
      protein: tempProtein.trim(),
      carbs: tempCarbs.trim(),
      fibre: tempFibre.trim(),
    };

    setWeeklyPlan({ ...tempPlan });
    setWeight(cleanWeight);
    setHeight(cleanHeight);
    setWaterGoal(validWaterGoal);
    if (filledGlasses > validWaterGoal) {
      setFilledGlasses(validWaterGoal);
    }
    setNutritionTarget(updatedTarget);
    setModalVisible(false);

    const formattedWorkoutPlan = DAYS_OF_WEEK.map(day => ({
      day,
      workout: tempPlan[day] ? tempPlan[day].trim() : '',
    }));

    try {
      await axios.put(`${API_BASE_URL}/fitness/profile`, {
        weight: parseFloat(cleanWeight) || 0,
        height: parseFloat(cleanHeight) || 0,
        waterGoal: validWaterGoal,
        workoutPlan: formattedWorkoutPlan,
        target: {
          kcal: parseFloat(updatedTarget.kcal) || 0,
          protein: parseFloat(updatedTarget.protein) || 0,
          carbs: parseFloat(updatedTarget.carbs) || 0,
          fibre: parseFloat(updatedTarget.fibre) || 0,
        },
      });
    } catch (error) {
      console.error("Error updating fitness data:", error);
    }
  };

  const toggleGlass = async (index) => {
    let newAmount = 0;
    if (index < filledGlasses) {
      newAmount = index;
    } else {
      newAmount = index + 1;
    }
    setFilledGlasses(newAmount);

    try {
      await axios.put(`${API_BASE_URL}/fitness/water`, {
        waterIntake: newAmount
      });
    } catch (error) {
      console.error("Error updating water:", error);
    }
  };

  const consumedMacros = loggedFoods.reduce((acc, food) => {
    return {
      kcal: acc.kcal + (food.kcal || food.calories || 0),
      protein: acc.protein + (food.protein || food.protein_g || 0),
      carbs: acc.carbs + (food.carbs || food.carbohydrates_total_g || 0),
      fibre: acc.fibre + (food.fibre || food.fiber_g || 0),
    };
  }, { kcal: 0, protein: 0, carbs: 0, fibre: 0 });

  const handleFoodSearch = async (text) => {
    setFoodName(text);
    if (text.trim().length > 0) {
      setIsSearching(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/fitness/search-food`, {
          params: { q: text.trim() }
        });
        if (response.data && response.data.found) {
          const list = response.data.foods || (response.data.food ? [response.data.food] : []);
          setSearchResults(list);
          setShowDropdown(list.length > 0);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Search Error: ", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const selectFoodFromDropdown = (food) => {
    setFoodName(food.name);
    setShowDropdown(false);
  };

  const handleAddFood = async () => {
    if (!foodName.trim() || !foodWeight.trim()) {
      alert("Please enter a valid food name and weight in grams.");
      return;
    }

    setIsFetchingFood(true);
    const weightMultiplier = parseFloat(foodWeight) / 100;

    try {
      const localResponse = await axios.get(`${API_BASE_URL}/fitness/search-food`, {
        params: { q: foodName.trim() }
      });

      if (localResponse.data && localResponse.data.found && localResponse.data.food) {
        const dbFood = localResponse.data.food;
        const calories = Math.round(dbFood.kcal * weightMultiplier);
        const protein = Math.round((dbFood.protein * weightMultiplier) * 10) / 10;
        const carbs = Math.round((dbFood.carbs * weightMultiplier) * 10) / 10;
        const fiber = Math.round((dbFood.fibre * weightMultiplier) * 10) / 10;

        const response = await axios.post(`${API_BASE_URL}/fitness/food`, {
          name: dbFood.name,
          weight: parseFloat(foodWeight),
          kcal: calories,
          protein: protein,
          carbs: carbs,
          fibre: fiber
        });

        if (response.data && response.data.success && response.data.fitness) {
          setLoggedFoods([...response.data.fitness.nutrition.foodDiary].reverse());
        }

        setFoodName('');
        setFoodWeight('');
        setShowDropdown(false);

      } else {
        alert(`No exact match found in our database for "${foodName}".`);
      }
    } catch (error) {
      console.error("API Error: ", error);
      alert("Failed to fetch data or save. Check connection.");
    } finally {
      setIsFetchingFood(false);
    }
  };

  // PUTHIYA DELETE FUNCTION
  const handleDeleteFood = (foodId) => {
    Alert.alert(
      "Delete Food",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_BASE_URL}/fitness/food/${foodId}`);
              if (response.data && response.data.success) {
                setLoggedFoods([...response.data.fitness.nutrition.foodDiary].reverse());
              }
            } catch (error) {
              console.error("Delete Error: ", error);
              alert("Failed to delete food. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        <View style={styles.pageHeaderRow}>
          <View>
            <Text style={styles.pageTitle}>My Fitness</Text>
            <Text style={styles.pageSubtitle}>Your workouts. Your nutrition. Your goal.</Text>
          </View>
          <TouchableOpacity 
            style={styles.redPillButton}
            onPress={handleOpenModal}
          >
            <Text style={styles.redPillText}>{hasDatasAdded ? 'Edit datas' : '+ Add datas'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.topLeftEditBtn}>
            <Text style={styles.settingsLinkText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Your profile</Text>
              <Text style={styles.cardSubtitle}>Personal metrics</Text>
            </View>
          </View>

          <View style={styles.profileDataRow}>
            <View style={styles.profileBox}>
              <Text style={styles.profileLabel}>Weight</Text>
              <Text style={styles.profileValue}>{weight ? `${weight} kg` : 'Add datas'}</Text>
            </View>
            <View style={styles.profileBox}>
              <Text style={styles.profileLabel}>Height</Text>
              <Text style={styles.profileValue}>{height ? `${height} cm` : 'Add datas'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.topLeftEditBtn}>
            <Text style={styles.settingsLinkText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Workout plan</Text>
              <Text style={styles.cardSubtitle}>Active Schedule</Text>
            </View>
          </View>

          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeader, { flex: 1.5 }]}>DAY</Text>
            <Text style={[styles.tableHeader, { flex: 2, textAlign: 'right' }]}>SCHEDULED WORKOUT</Text>
          </View>

          {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={styles.exerciseRow}>
              <Text style={[styles.exerciseName, { flex: 1.5 }]}>{day}</Text>
              <Text style={[styles.exerciseStat, { flex: 2, textAlign: 'right', color: '#DC2626', fontWeight: 'bold' }]}>
                {weeklyPlan[day] && weeklyPlan[day].trim() !== '' ? weeklyPlan[day] : 'Add datas'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.topLeftEditBtn}>
            <Text style={styles.settingsLinkText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Food diary</Text>
            <Text style={styles.demoText}>{loggedFoods.length} foods logged</Text>
          </View>

          <View style={{ position: 'relative', zIndex: 10 }}>
            <View style={styles.foodInputRow}>
              <View style={[styles.inputContainer, { flex: 2.5, marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Food name (e.g. Idli, Soya chunks)"
                  placeholderTextColor="#71717A"
                  value={foodName}
                  onChangeText={handleFoodSearch}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="100 g"
                  placeholderTextColor="#71717A"
                  value={foodWeight}
                  onChangeText={setFoodWeight}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.addFoodButton} onPress={handleAddFood} disabled={isFetchingFood}>
                {isFetchingFood ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.addFoodButtonText}>+ Add</Text>
                )}
              </TouchableOpacity>
            </View>

            {showDropdown && searchResults.length > 0 && (
              <View style={styles.dropdownContainer}>
                <ScrollView 
                  nestedScrollEnabled={true} 
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                >
                  {searchResults.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.dropdownItem}
                      onPress={() => selectFoodFromDropdown(item)}
                    >
                      <Text style={styles.dropdownText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {loggedFoods.length > 0 ? (
            loggedFoods.map((food, idx) => (
              <View key={food._id || food.id || idx} style={styles.loggedFoodItem}>
                <View style={styles.loggedFoodHeader}>
                  <View>
                    <Text style={styles.foodItemName}>{food.name}</Text>
                    <Text style={[styles.foodItemMacros, { marginTop: 4 }]}>
                      {food.kcal || food.calories || 0} kcal  •  {food.protein || food.protein_g || 0} g protein
                    </Text>
                    <Text style={styles.foodItemMacros}>
                      {food.carbs || food.carbohydrates_total_g || 0} g carbs  •  {food.fibre || food.fiber_g || 0} g fibre
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.demoText}>{food.weight} g</Text>
                    <TouchableOpacity onPress={() => handleDeleteFood(food._id)} style={{ marginTop: 8 }}>
                      <Ionicons name="trash-outline" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.loggedFoodItem}>
              <View style={styles.loggedFoodHeader}>
                <Text style={styles.foodItemName}>Add datas</Text>
                <Text style={styles.demoText}>Add datas</Text>
              </View>
              <Text style={styles.foodItemMacros}>Add datas</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.topLeftEditBtn}>
            <Text style={styles.settingsLinkText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Daily nutrition</Text>
            <Text style={styles.demoText}>
              {waterGoal > 0 ? `Water: ${filledGlasses}/${waterGoal} L` : 'Water: Add datas'}
            </Text>
          </View>

          {waterGoal > 0 ? (
            <View style={styles.waterTrackerRow}>
              {[...Array(waterGoal)].map((_, i) => {
                const isFilled = i < filledGlasses;
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.waterGlassBox, isFilled && styles.waterGlassBoxFilled]}
                    onPress={() => toggleGlass(i)}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={isFilled ? "water" : "water-outline"} 
                      size={20} 
                      color={isFilled ? "#FFFFFF" : "#DC2626"} 
                    />
                    <Text style={[styles.waterGlassText, isFilled && { color: '#FFFFFF' }]}>
                      {i + 1}L
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.waterTrackerRow}>
              <TouchableOpacity 
                style={styles.waterGlassBox}
                onPress={handleOpenModal}
                activeOpacity={0.8}
              >
                <Text style={styles.waterGlassText}>Add datas</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { flex: 1.5 }]}></Text>
              <Text style={[styles.nutritionColHeader, { flex: 1 }]}>kcal</Text>
              <Text style={[styles.nutritionColHeader, { flex: 1 }]}>Protein</Text>
              <Text style={[styles.nutritionColHeader, { flex: 1 }]}>Carbs</Text>
              <Text style={[styles.nutritionColHeader, { flex: 1 }]}>Fibre</Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { flex: 1.5 }]}>Target</Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>
                {nutritionTarget.kcal ? nutritionTarget.kcal : 'Add datas'}
              </Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>
                {nutritionTarget.protein ? `${nutritionTarget.protein} g` : 'Add datas'}
              </Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>
                {nutritionTarget.carbs ? `${nutritionTarget.carbs} g` : 'Add datas'}
              </Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>
                {nutritionTarget.fibre ? `${nutritionTarget.fibre} g` : 'Add datas'}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { flex: 1.5, color: '#DC2626', fontWeight: 'bold' }]}>Consumed</Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>{Math.round(consumedMacros.kcal)}</Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>{Math.round(consumedMacros.protein)} g</Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>{Math.round(consumedMacros.carbs)} g</Text>
              <Text style={[styles.nutritionValue, { flex: 1 }]}>{Math.round(consumedMacros.fibre)} g</Text>
            </View>
          </View>

          <Text style={[styles.demoText, { marginTop: 12 }]}>Illustrative estimates only • Tap glasses to log water</Text>
        </View>

      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMainTitle}>{hasDatasAdded ? 'Edit Fitness & Profile Data' : 'Add Fitness & Profile Data'}</Text>
            
            <ScrollView 
              showsVerticalScrollIndicator={true} 
              indicatorStyle="white"
              style={styles.modalScrollArea}
            >
              
              <Text style={styles.modalSectionHeading}>Current Profile Metrics</Text>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempWeight}
                  onChangeText={setTempWeight}
                  keyboardType="numeric"
                  placeholder="e.g. 70"
                  placeholderTextColor="#71717A"
                />
              </View>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempHeight}
                  onChangeText={setTempHeight}
                  keyboardType="numeric"
                  placeholder="e.g. 177.7"
                  placeholderTextColor="#71717A"
                />
              </View>

              <Text style={[styles.modalSectionHeading, { marginTop: 16 }]}>Weekly Workout Chart</Text>
              {DAYS_OF_WEEK.map((day) => (
                <View key={day} style={styles.modalInputRow}>
                  <Text style={styles.modalDayLabel}>{day}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={tempPlan[day]}
                    onChangeText={(text) => setTempPlan({ ...tempPlan, [day]: text })}
                    placeholder="workout routine (eg: Chest & Triceps)"
                    placeholderTextColor="#71717A"
                  />
                </View>
              ))}

              <Text style={[styles.modalSectionHeading, { marginTop: 16 }]}>Water Goal (Liters / Glasses)</Text>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Total L</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempWaterGoal}
                  onChangeText={setTempWaterGoal}
                  keyboardType="numeric"
                  placeholder="e.g. 3"
                  placeholderTextColor="#71717A"
                />
              </View>

              <Text style={[styles.modalSectionHeading, { marginTop: 16 }]}>Daily Nutrition Target</Text>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Kcal</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempKcal}
                  onChangeText={setTempKcal}
                  keyboardType="numeric"
                  placeholder="e.g. 2420"
                  placeholderTextColor="#71717A"
                />
              </View>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempProtein}
                  onChangeText={setTempProtein}
                  keyboardType="numeric"
                  placeholder="e.g. 170"
                  placeholderTextColor="#71717A"
                />
              </View>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempCarbs}
                  onChangeText={setTempCarbs}
                  keyboardType="numeric"
                  placeholder="e.g. 240"
                  placeholderTextColor="#71717A"
                />
              </View>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalDayLabel}>Fibre (g)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempFibre}
                  onChangeText={setTempFibre}
                  keyboardType="numeric"
                  placeholder="e.g. 30"
                  placeholderTextColor="#71717A"
                />
              </View>

            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveNewPlan}>
                <Text style={styles.modalSaveText}>Save Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer activeTab="Fitness" />
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
    paddingTop: 10,
    paddingBottom: 110,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  redPillButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  redPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  topLeftEditBtn: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableHeader: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseStat: {
    color: '#E4E4E7',
    fontSize: 14,
  },
  demoText: {
    color: '#71717A',
    fontSize: 12,
  },
  profileDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileBox: {
    backgroundColor: '#27272A',
    borderRadius: 12,
    padding: 14,
    flex: 1,
    marginRight: 8,
  },
  profileLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    marginBottom: 4,
  },
  profileValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsLinkText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  waterTrackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6,
  },
  waterGlassBox: {
    flex: 1,
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterGlassBoxFilled: {
    backgroundColor: '#DC2626',
  },
  waterGlassText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nutritionGrid: {
    marginTop: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionLabel: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  nutritionColHeader: {
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
  },
  nutritionValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  foodInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#09090B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  addFoodButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addFoodButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '60%',
    backgroundColor: '#27272A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
    zIndex: 100,
    maxHeight: 160,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3F46',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loggedFoodItem: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 10,
    marginBottom: 8,
  },
  loggedFoodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  foodItemName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  foodItemMacros: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScrollArea: {
    maxHeight: 400,
    paddingRight: 6,
  },
  modalSectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  modalDayLabel: {
    color: '#A1A1AA',
    fontSize: 13,
    width: 90,
  },
  modalInput: {
    flex: 1,
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#27272A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});


