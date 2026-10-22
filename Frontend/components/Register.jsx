import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Wrong password');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });

      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Create Account Badge Header */}
          <View style={styles.loginBadgeContainer}>
            <View style={styles.badgeLine} />
            <Text style={styles.loginBadgeText}>Create Account</Text>
            <View style={styles.badgeLine} />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Your fitness evolution begins here...
          </Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Create Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Create password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#888"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Conform password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#888"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.85} onPress={handleRegister}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Back to Sign In Button */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" style={styles.backIcon} />
            <Text style={styles.backButtonText}>Back to Sign in</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerBrand}>
              <MaterialCommunityIcons name="dumbbell" size={16} color="#A00000" />
              <Text style={styles.footerBrandText}> Tamil Nadu's Fitness Hub</Text>
            </View>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Privacy policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Terms of service</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#09090B' 
  },
  scrollContainer: { 
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 20) + 20, 
    paddingBottom: 30 
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  logo: { 
    width: 180, 
    height: 180 
  },
  loginBadgeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 14 
  },
  badgeLine: { 
    width: 28, 
    height: 1.5, 
    backgroundColor: '#A00000', 
    marginHorizontal: 8 
  },
  loginBadgeText: { 
    color: '#A00000', 
    fontSize: 12, 
    fontWeight: '700', 
    letterSpacing: 0.8 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 6 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#A1A1AA', 
    lineHeight: 22, 
    marginBottom: 30 
  },
  inputGroup: { 
    marginBottom: 18 
  },
  label: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    marginBottom: 8, 
    fontWeight: '600' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#18181B', 
    borderWidth: 1, 
    borderColor: '#27272A', 
    borderRadius: 8, 
    paddingHorizontal: 16, 
    height: 54 
  },
  inputIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: 15 
  },
  eyeIcon: { 
    marginLeft: 12 
  },
  signUpButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#27272A', 
    height: 54, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16, 
    marginTop: 10 
  },
  signUpButtonText: { 
    color: '#A00000', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  backButton: { 
    backgroundColor: '#A00000', 
    height: 54, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30 
  },
  backIcon: { 
    marginRight: 10 
  },
  backButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  footer: { 
    alignItems: 'center' 
  },
  footerBrand: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  footerBrandText: { 
    color: '#A1A1AA', 
    fontSize: 13, 
    fontWeight: '500' 
  },
  footerLinks: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  footerLinkText: { 
    color: '#71717A', 
    fontSize: 12 
  },
  footerDot: { 
    color: '#71717A', 
    marginHorizontal: 8 
  },
});