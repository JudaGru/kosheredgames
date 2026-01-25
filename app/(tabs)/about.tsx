import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

function LogoLarge() {
  return (
    <Svg width={180} height={50} viewBox="0 0 220 40">
      <Defs>
        <LinearGradient id="textGradAbout" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#0d9488" />
          <Stop offset="40%" stopColor="#0891b2" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
        <LinearGradient id="playGradAbout" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#14b8a6" />
          <Stop offset="50%" stopColor="#0ea5e9" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
      </Defs>
      <Circle cx="20" cy="20" r="19" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />
      <Circle cx="20" cy="20" r="17" fill="url(#playGradAbout)" />
      <Path d="M15 12 L29 20 L15 28 Z" fill="white" opacity="0.95" />
      <SvgText x="44" y="28" fontSize="25" fontWeight="bold" fill="url(#textGradAbout)" fontFamily="System" letterSpacing="0.5">
        Aleph
      </SvgText>
      <SvgText x="116" y="28" fontSize="25" fontWeight="bold" fill="url(#textGradAbout)" fontFamily="System" letterSpacing="0.5">
        Play
      </SvgText>
    </Svg>
  );
}

interface FeatureCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, iconColor, title, description }: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: iconColor + '15' }]}>
        <FontAwesome name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LogoLarge />
          <Text style={styles.tagline}>Educational Jewish Games for Children</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            AlephPlay is dedicated to providing strictly educational Jewish content for children.
            We believe that when learning feels like play, children naturally develop a love for Torah and Jewish heritage.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            We are committed to keeping our platform ad-free so parents can be confident their children
            will never be exposed to inappropriate advertisements while using AlephPlay.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Makes Us Different</Text>
          <FeatureCard
            icon="ban"
            iconColor="#ef4444"
            title="No Ads"
            description="We never show advertisements. Parents can trust that their children won't see any inappropriate content."
          />
          <FeatureCard
            icon="shield"
            iconColor="#0ea5e9"
            title="Safe & Kosher"
            description="Every game is designed with Torah values in mind. Content is carefully curated to be appropriate for Jewish children."
          />
          <FeatureCard
            icon="book"
            iconColor="#10b981"
            title="Strictly Educational"
            description="All our games teach real Torah content including Parsha, Hebrew, holidays, halacha, and Jewish history."
          />
          <FeatureCard
            icon="graduation-cap"
            iconColor="#8b5cf6"
            title="Learning Through Play"
            description="Children learn best when they're having fun. Our games make Jewish education enjoyable and engaging."
          />
          <FeatureCard
            icon="users"
            iconColor="#f59e0b"
            title="Age Appropriate"
            description="Games are tagged by age range so you can easily find content suitable for your child."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Types</Text>
          <View style={styles.gameTypesGrid}>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="th-large" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Matching</Text>
            </View>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="font" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Word Games</Text>
            </View>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="clone" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Flashcards</Text>
            </View>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="question-circle" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Trivia</Text>
            </View>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="puzzle-piece" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Puzzles</Text>
            </View>
            <View style={styles.gameTypeItem}>
              <FontAwesome name="sort-numeric-asc" size={24} color={Colors.primary[500]} />
              <Text style={styles.gameTypeLabel}>Sequencing</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            Have feedback, suggestions, or want to report an issue? We'd love to hear from you!
            Use the Feedback tab to send us a message.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with love for the Jewish community</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 24,
  },
  tagline: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.secondary,
  },
  gameTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  gameTypeItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  gameTypeLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  version: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
