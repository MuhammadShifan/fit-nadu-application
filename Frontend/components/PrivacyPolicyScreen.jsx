import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen({ navigation }) {
  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>LEGAL & PRIVACY</Text>
          </View>
          <Text style={styles.heroTitle}>FitNadu Privacy Policy</Text>
          <Text style={styles.heroSubtitle}>
            Last updated: October 2026 • Version 1.0
          </Text>
          <Text style={styles.heroDescription}>
            At FitNadu, your privacy is fundamental to our mission. This policy explains what information we collect, why we collect it, and how we protect your personal health and fitness data.
          </Text>
        </View>

        {/* Section 1: Data Collection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="finger-print-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>1. Data We Collect</Text>
          </View>
          <Text style={styles.paragraph}>
            To deliver an effective, tailored fitness experience, FitNadu collects several categories of personal and health data:
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Account Credentials:</Text> Your email address and encrypted password when you register manually.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Google Sign-In Information:</Text> Your full name, verified email address, and profile avatar provided through Google authentication.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Physical Attributes:</Text> Height, weight, target fitness goals, activity levels, and age used for body composition calculations.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Daily Logs:</Text> Daily calorie logs, meal details, macro distributions, daily water consumption logs, and workout records.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Data Usage */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="calculator-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
          </View>
          <Text style={styles.paragraph}>
            Your data is strictly collected and utilized to power core app features and deliver personalized metrics.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>In-App Calculations:</Text> Computing your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), hydration targets, and daily calorie deficits or surpluses.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Progress Tracking:</Text> Visualizing your weight trends, hydration logs, and calorie burn over weekly and monthly cycles.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Zero Third-Party Sales:</Text> We do NOT sell, rent, monetize, or trade your personal or health data to advertisers or data brokers under any circumstances.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: Third-Party Services */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
          </View>
          <Text style={styles.paragraph}>
            FitNadu integrates reliable third-party infrastructure to deliver push notifications and essential background services:
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Expo & Firebase Notifications:</Text> We utilize Expo Push Services and Google Firebase Cloud Messaging to send timely reminders (e.g., daily water intake alerts, workout reminders, and important security updates).
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Anonymous Push Tokens:</Text> Device push tokens generated by Expo are stored solely for message delivery and are never cross-referenced for tracking across other services.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: External Links & Supplements */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="open-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>4. External Links & Brand Websites</Text>
          </View>
          <Text style={styles.paragraph}>
            FitNadu features external links that direct you to official third-party supplement brand websites and merchant stores:
          </Text>

          <View style={styles.alertBox}>
            <Ionicons name="information-circle" size={20} color="#DC2626" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              When clicking on an external link to purchase supplements, you leave the FitNadu app. FitNadu is not responsible for the privacy practices, cookies, or data collection mechanisms of these independent brand sites.
            </Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            We strongly encourage you to review the individual privacy policies of any third-party websites you visit before entering payment or personal data.
          </Text>
        </View>

        {/* Section 5: Account & Data Deletion */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>5. Account Deletion & User Rights</Text>
          </View>
          <Text style={styles.paragraph}>
            You retain full ownership and control over your data. You have the right to request the complete deletion of your FitNadu account and all associated records at any time.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Complete Data Removal:</Text> Upon processing an account deletion request, your email, profile information, body metrics, meal logs, and water intake history are permanently removed from our active databases.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>How to Request Deletion:</Text> You can submit a deletion request directly within your app profile settings or by sending an email with your registered account details to support@fitnadu.com.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6: Data Security & Contact */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>6. Security & Contact</Text>
          </View>
          <Text style={styles.paragraph}>
            We implement industry-standard encryption protocols (HTTPS/TLS) and secure credential hashing to safeguard your information against unauthorized access, disclosure, or alteration.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            If you have questions, feedback, or concerns regarding this Privacy Policy, please reach out to our privacy team at:
          </Text>
          <Text style={styles.contactEmail}>privacy@fitnadu.com</Text>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight || 24) + 12,
    paddingBottom: 16,
    backgroundColor: '#09090B',
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    marginBottom: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },
  badgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 14,
  },
  heroDescription: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  paragraph: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 22,
  },
  bulletHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#E4E4E7',
    lineHeight: 20,
  },
  contactEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 8,
  },
  footerSpacer: {
    height: 20,
  },
});
