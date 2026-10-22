import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  Text, 
  Modal, 
  FlatList, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CachedImage from './CachedImage'; // CachedImage import panniyachu

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';

export default function Header() {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (isBackground = false) => {
    if (!isBackground) setLoading(true); 
    
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications?t=${new Date().getTime()}`);
      if (response.data && response.data.success) {
        
        const fetchedNotifs = response.data.notifications || [];
        const sortedNotifs = fetchedNotifs.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });

        setNotifications(sortedNotifs);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleBellClick = () => {
    fetchNotifications(); 
    setShowDropdown(true);
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return; 
    
    try {
      await axios.put(`${API_BASE_URL}/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error updating single notification:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${id}`);
      const notificationToDelete = notifications.find(n => n._id === id);
      setNotifications(notifications.filter(n => n._id !== id));
      
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              navigation.replace('Login');
            } catch (error) {
              console.error("Logout Error: ", error);
            }
          }
        }
      ]
    );
  };

  const getIconData = (type) => {
    switch(type) {
      case 'water': return { name: 'water-outline', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'workout': return { name: 'barbell-outline', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.15)' };
      default: return { name: 'notifications-outline', color: '#A1A1AA', bg: '#27272A' };
    }
  };

  const renderNotificationItem = ({ item }) => {
    const iconData = getIconData(item.type);

    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => markAsRead(item._id, item.isRead)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: iconData.bg }]}>
                <Ionicons name={iconData.name} size={18} color={iconData.color} />
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.notiTitle, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.notiMessage}>{item.message}</Text>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteNotification(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={16} color="#71717A" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeHeaderWrapper}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Normal Image tag-ku pathila CachedImage use panniyachu */}
          <CachedImage
            source={require('../assets/logo.png')}
            style={styles.headerLogo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.iconsWrapper}>
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={handleBellClick} 
          >
            <Feather name="bell" size={20} color="#FFFFFF" />
            
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDropdown(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.dropdownContainer}>
            
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="small" color="#DC2626" />
              </View>
            ) : notifications.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderNotificationItem}
                style={styles.notificationList}
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
              />
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="notifications-off-outline" size={32} color="#3F3F46" />
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            )}

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeHeaderWrapper: {
    backgroundColor: '#09090B',
    paddingTop: Platform.OS === 'ios' ? 58 : (StatusBar.currentHeight || 20),
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#09090B',
  },
  logoContainer: {
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    overflow: 'hidden', 
    backgroundColor: '#18181B', 
    borderWidth: 1, 
    borderColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: '100%',
    height: '100%',
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30, 
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
  iconButton: {
    position: 'relative',
    backgroundColor: '#27272A', 
    padding: 10,
    borderRadius: 20, 
    marginHorizontal: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626', 
    borderWidth: 1.5,
    borderColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 115 : 95, 
    right: 20,
    width: 300,
    maxHeight: 400,
    backgroundColor: '#18181B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: '#18181B',
  },
  dropdownTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  markReadText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#18181B',
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#27272A', 
  },
  iconContainer: {
    marginRight: 12,
    position: 'relative',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#27272A',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8, 
  },
  notiTitle: {
    fontSize: 13,
    color: '#E4E4E7',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notiMessage: {
    fontSize: 11,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  deleteButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 10,
  }
});