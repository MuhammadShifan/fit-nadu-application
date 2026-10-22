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

export default function TermsOfServiceScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
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
            <Text style={styles.badgeText}>USER AGREEMENT</Text>
          </View>
          <Text style={styles.heroTitle}>FitNadu Terms of Service</Text>
          <Text style={styles.heroSubtitle}>
            Last updated: October 2026 • Version 1.0
          </Text>
          <Text style={styles.heroDescription}>
            Please review these Terms of Service carefully before utilizing FitNadu. By downloading, accessing, or using the app, you agree to be bound by these terms.
          </Text>
        </View>

        {/* Section 1: Medical & Health Disclaimer (Critical) */}
        <View style={[styles.sectionCard, styles.criticalCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.criticalIconContainer]}>
              <Ionicons name="medkit-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>1. Medical & Health Disclaimer</Text>
          </View>

          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={22} color="#DC2626" style={styles.warningIcon} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>NOT MEDICAL ADVICE</Text>
              <Text style={styles.warningText}>
                FitNadu is designed solely for fitness awareness and informational tracking. It is NOT a medical device, nor should it substitute professional medical diagnosis or clinical treatment.
              </Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            All metrics provided by FitNadu—including calorie requirements, macronutrient splits, hydration targets, BMR/TDEE calculations, and workout recommendations—are strictly illustrative statistical estimates.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Physician Consultation Required:</Text> You should always consult a licensed doctor, nutritionist, or qualified healthcare professional before beginning any physical exercise regimen, lifting program, or calorie-restricted diet.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Assumption of Risk:</Text> Physical activities and dietary modifications carry inherent physiological risks. By using FitNadu, you voluntarily assume all associated health risks.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Listen to Your Body:</Text> Immediately stop exercise and seek emergency medical attention if you experience dizziness, chest pain, shortness of breath, or sharp pain.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: No Payment & Purchase Liability (Supplements) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>2. No Payment & Supplement Liability</Text>
          </View>
          <Text style={styles.paragraph}>
            FitNadu serves as a discovery platform and does NOT conduct or process financial commerce for nutritional supplements.
          </Text>

          <View style={styles.alertBox}>
            <Ionicons name="shield-outline" size={20} color="#DC2626" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              All supplement transactions, checkout operations, and customer billing occur exclusively on external, third-party brand websites.
            </Text>
          </View>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Zero Payment Processing:</Text> FitNadu never handles, collects, or stores credit cards, bank credentials, or UPI details for supplement orders.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>No Product Liability:</Text> FitNadu holds no legal liability or responsibility for product efficacy, authenticity, ingredient safety, allergic reactions, delivery delays, shipping damage, returns, or refunds.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Merchant Disputes:</Text> Any transaction disputes, shipping inquiries, or refund claims must be raised directly with the respective brand merchant from whom the product was purchased.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: Gym & Trainer Listings Directory */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="barbell-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>3. Gym & Trainer Directory Listings</Text>
          </View>
          <Text style={styles.paragraph}>
            FitNadu provides directory discovery features allowing users to locate nearby fitness centers, commercial gyms, and freelance personal trainers.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Independent Third Parties:</Text> Listed gyms and personal trainers operate as completely independent businesses and individuals. They are not employees, agents, or partners of FitNadu.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Service Quality Disclaimer:</Text> FitNadu does not endorse, certify, or guarantee the service quality, hygiene standards, equipment safety, or credentials of any listed gym or trainer.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Direct Engagement:</Text> Any membership agreements, personal training bookings, payments, or scheduling arrangements entered into are solely between you and the respective gym or trainer.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: User Responsibilities & Conduct */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>4. User Responsibilities & Acceptable Use</Text>
          </View>
          <Text style={styles.paragraph}>
            As a registered user of FitNadu, you agree to adhere to standard standards of conduct and platform integrity:
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Accurate Information:</Text> You agree to submit truthful, accurate, and current information regarding your physical profile, email, and identity.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Account Security:</Text> You are responsible for safeguarding your login credentials and preventing unauthorized access to your account.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Prohibited Misuse:</Text> You must not reverse-engineer, decompile, scrape, overload, inject malicious payloads, or abuse API endpoints belonging to FitNadu.
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletHighlight}>Lawful Use:</Text> You agree not to use the app for any fraudulent, unlawful, or unauthorized purpose.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5: Limitation of Liability */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
          </View>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by applicable law, FitNadu, its creators, developers, and affiliates shall not be liable for any indirect, incidental, special, punitive, or consequential damages resulting from your use of or inability to use the platform.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            The app and all associated features are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
          </Text>
        </View>

        {/* Section 6: Modifications & Inquiries */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>6. Updates & Legal Inquiries</Text>
          </View>
          <Text style={styles.paragraph}>
            We reserve the right to revise or update these Terms of Service periodically. Continued use of the app following any modifications constitutes your acceptance of the updated terms.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            For questions or legal clarifications regarding these terms, contact us at:
          </Text>
          <Text style={styles.contactEmail}>legal@fitnadu.com</Text>
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
  criticalCard: {
    borderColor: 'rgba(220, 38, 38, 0.35)',
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
  criticalIconContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
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
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DC2626',
    marginBottom: 10,
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#F4F4F5',
    lineHeight: 19,
    fontWeight: '500',
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
