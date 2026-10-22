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

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [googleIconUrl, setGoogleIconUrl] = useState(
    'https://developers.google.com/identity/images/g-logo.png'
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter your email and password!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.31.86:5000/api/auth/login', {
        email,
        password,
      });

      Alert.alert('Success', response.data.message);
      navigation.replace('Home');

    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Server error');
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

          {/* User Sign In Badge Header - Puthusa Add Panniyachu */}
          <View style={styles.loginBadgeContainer}>
            <View style={styles.badgeLine} />
            <Text style={styles.loginBadgeText}>Sign In</Text>
            <View style={styles.badgeLine} />
          </View>

          {/* Welcome Back Title */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to stay on track. Your next chapter of strength starts here.
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
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

          {/* Remember Me & Forgot Password */}
          <View style={styles.rowBetween}>
            <TouchableOpacity
              style={styles.rememberContainer}
              activeOpacity={0.8}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} activeOpacity={0.8} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign in</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New to FitNadu?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.createAccountButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>

          {/* Sign in with Google Button */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.85}>
            <Image
              source={{
                uri: googleIconUrl,
                headers: { 'User-Agent': 'Mozilla/5.0' },
              }}
              onError={() =>
                setGoogleIconUrl('https://img.icons8.com/color/96/google-logo.png')
              }
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerBrand}>
              <MaterialCommunityIcons name="dumbbell" size={16} color="#A00000" />
              <Text style={styles.footerBrandText}> Tamil Nadu's Fitness Hub</Text>
            </View>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.footerLinkText}>Privacy policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
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
    marginBottom: 8 
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
  rowBetween: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 4, 
    marginBottom: 24 
  },
  rememberContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  checkbox: { 
    width: 20, 
    height: 20, 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: '#A00000', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8,
    backgroundColor: '#18181B'
  },
  checkboxChecked: { 
    backgroundColor: '#A00000',
    borderColor: '#A00000',
  },
  rememberText: { 
    color: '#A1A1AA', 
    fontSize: 14 
  },
  forgotText: { 
    color: '#A00000', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  signInButton: { 
    backgroundColor: '#A00000', 
    height: 54, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 24 
  },
  signInButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  arrowIcon: { 
    marginLeft: 10 
  },
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#27272A' 
  },
  dividerText: { 
    color: '#A1A1AA', 
    fontSize: 13, 
    marginHorizontal: 14 
  },
  createAccountButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#27272A', 
    height: 54, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16 
  },
  createAccountText: { 
    color: '#A00000', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  googleButton: { 
    backgroundColor: '#FFFFFF', 
    height: 54, 
    borderRadius: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30 
  },
  googleIcon: { 
    width: 24, 
    height: 24, 
    marginRight: 12 
  },
  googleButtonText: { 
    color: '#555555', 
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