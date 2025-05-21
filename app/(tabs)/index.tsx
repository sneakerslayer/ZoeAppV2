import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { MessageCircle, ArrowRightCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '@/components/UI/Container';
import { TherapyModes } from '@/assets/images/therapy_modes';
import Card from '@/components/UI/Card';

export default function HomeScreen() {
  const { theme, colors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  const navigateToChat = (modeIndex: number) => {
    router.push({
      pathname: '/chat',
      params: { mode: modeIndex }
    });
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {getTimeBasedGreeting()},
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {isAuthenticated ? user?.name || 'Friend' : 'Friend'}
            </Text>
          </View>
          
          <View style={styles.heroContainer}>
            <View style={[styles.heroContent, { backgroundColor: colors.primary[50] }]}>
              <Text style={[styles.heroTitle, { color: colors.primary[700] }]}>
                Ready for your session?
              </Text>
              <Text style={[styles.heroText, { color: colors.primary[600] }]}>
                Start a new therapy session or continue where you left off
              </Text>
              <TouchableOpacity 
                style={[styles.heroButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => router.push('/chat')}
              >
                <Text style={styles.heroButtonText}>Start Session</Text>
                <MessageCircle size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Therapy Modes
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.neutral[500] }]}>
              Choose the therapy approach that fits your needs
            </Text>
          </View>
          
          <View style={styles.cards}>
            {TherapyModes.map((mode, index) => (
              <Card 
                key={index}
                onPress={() => navigateToChat(index)}
                style={{ backgroundColor: colors.card }}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${mode.color}20` }]}>
                    <MessageCircle size={24} color={mode.color} />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {mode.name}
                  </Text>
                  <Text style={[styles.cardDescription, { color: colors.neutral[500] }]}>
                    {mode.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity 
                      style={styles.cardButton}
                      onPress={() => navigateToChat(index)}
                    >
                      <Text style={[styles.cardButtonText, { color: mode.color }]}>
                        Start
                      </Text>
                      <ArrowRightCircle size={16} color={mode.color} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Emergency Resources
            </Text>
          </View>
          
          <Card 
            onPress={() => router.push('/resources')}
            style={{ backgroundColor: colors.error[50], marginBottom: 24 }}
          >
            <View style={styles.emergencyCard}>
              <Text style={[styles.emergencyTitle, { color: colors.error[700] }]}>
                Need immediate help?
              </Text>
              <Text style={[styles.emergencyText, { color: colors.error[600] }]}>
                Access crisis resources and support lines
              </Text>
              <TouchableOpacity 
                style={[styles.emergencyButton, { backgroundColor: colors.error[500] }]}
                onPress={() => router.push('/resources')}
              >
                <Text style={styles.emergencyButtonText}>
                  View Resources
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
  name: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 28,
    marginTop: 4,
  },
  heroContainer: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroContent: {
    padding: 24,
    borderRadius: 16,
  },
  heroTitle: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 24,
    marginBottom: 8,
  },
  heroText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  cards: {
    marginBottom: 32,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  emergencyCard: {
    padding: 16,
  },
  emergencyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  emergencyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});