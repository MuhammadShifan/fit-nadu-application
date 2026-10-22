import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Footer({ activeTab }) {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      {/* Top Red Border Line */}
      <View style={styles.topRedLine} />
      
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => navigation.replace('Home')}
        >
          <View style={[styles.iconCircle, activeTab === 'Home' && styles.activeIconCircle]}>
            <Feather 
              name="home" 
              size={20} 
              color={activeTab === 'Home' ? '#FFFFFF' : '#A1A1AA'} 
            />
          </View>
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeText]}>Home</Text>
        </TouchableOpacity>
        
        {/* Explore Gym Tab */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => navigation.replace('ExploreGym')}
        >
          <View style={[styles.iconCircle, activeTab === 'ExploreGym' && styles.activeIconCircle]}>
            <Feather 
              name="map-pin" 
              size={20} 
              color={activeTab === 'ExploreGym' ? '#FFFFFF' : '#A1A1AA'} 
            />
          </View>
          <Text style={[styles.navText, activeTab === 'ExploreGym' && styles.activeText]}>Explore Gym</Text>
        </TouchableOpacity>
        
        {/* Personal Trainer Tab */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => {navigation.replace('Trainer')}}
        >
          <View style={[styles.iconCircle, activeTab === 'Trainer' && styles.activeIconCircle]}>
            <Feather 
              name="user-check" 
              size={20} 
              color={activeTab === 'Trainer' ? '#FFFFFF' : '#A1A1AA'} 
            />
          </View>
          <Text style={[styles.navText, activeTab === 'Trainer' && styles.activeText]}>Personal Trainer</Text>
        </TouchableOpacity>
        
        {/* Buy Supplement Tab */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => {navigation.replace('Supplements')}}
        >
          <View style={[styles.iconCircle, activeTab === 'Supplements' && styles.activeIconCircle]}>
            <Feather 
              name="shopping-bag" 
              size={20} 
              color={activeTab === 'Supplements' ? '#FFFFFF' : '#A1A1AA'} 
            />
          </View>
          <Text style={[styles.navText, activeTab === 'Supplements' && styles.activeText]}>Buy Supplement</Text>
        </TouchableOpacity>
        
        {/* My Fitness Tab */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => {navigation.replace('Fitness')}}
        >
          <View style={[styles.iconCircle, activeTab === 'Fitness' && styles.activeIconCircle]}>
            <Feather 
              name="activity" 
              size={20} 
              color={activeTab === 'Fitness' ? '#FFFFFF' : '#A1A1AA'} 
            />
          </View>
          <Text style={[styles.navText, activeTab === 'Fitness' && styles.activeText]}>My Fitness</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#09090B',
  },
  topRedLine: {
    height: 1.5,
    backgroundColor: '#A00000',
    width: '100%',
  },
  bottomNav: {
    height: Platform.OS === 'ios' ? 84 : 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181B', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconCircle: {
    backgroundColor: '#A00000', 
  },
  navText: {
    fontSize: 9,
    color: '#A1A1AA',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});