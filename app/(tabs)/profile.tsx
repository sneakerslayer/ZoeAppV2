import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Image,
  Alert
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useTherapy } from '@/context/TherapyContext';
import { router } from 'expo-router';
import { User, Settings, CreditCard as Edit3, LogOut, ChevronRight, Bell, Shield, CircleHelp as HelpCircle, MessageCircle, Calendar, Clock } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '@/components/UI/Container';

export default function ProfileScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { messageCount, isPremium } = useTherapy();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme === 'dark');
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => {
            logout();
            router.push('/(auth)/login');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    toggleTheme();
  };
  
  const handleEditProfile = () => {
    // Navigation to edit profile screen would go here
    router.push('/edit-profile');
  };
  
  const handleUpgradeAccount = () => {
    router.push('/premium');
  };

  // Calculate joined date
  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      })
    : 'Recently';
  
  return (
    <Container>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Profile
            </Text>
          </View>
          
          {isAuthenticated ? (
            <>
              {/* User Profile Card */}
              <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                <View style={styles.profileHeader}>
                  <View style={[styles.avatarContainer, { backgroundColor: colors.primary[100] }]}>
                    {user?.photoURL ? (
                      <Image 
                        source={{ uri: user.photoURL }} 
                        style={styles.avatar} 
                        resizeMode="cover"
                      />
                    ) : (
                      <User size={32} color={colors.primary[500]} />
                    )}
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: colors.text }]}>
                      {user?.name || 'User'}
                    </Text>
                    <Text style={[styles.profileEmail, { color: colors.neutral[500] }]}>
                      {user?.email || 'user@example.com'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.editButton, { backgroundColor: colors.primary[50] }]}
                    onPress={handleEditProfile}
                  >
                    <Edit3 size={18} color={colors.primary[500]} />
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <View style={styles.profileStats}>
                  <View style={styles.stat}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.primary[50] }]}>
                      <MessageCircle size={18} color={colors.primary[500]} />
                    </View>
                    <View>
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {messageCount}
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.neutral[500] }]}>
                        Messages
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.stat}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.accent[50] }]}>
                      <Calendar size={18} color={colors.accent[500]} />
                    </View>
                    <View>
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {joinedDate}
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.neutral[500] }]}>
                        Joined
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.stat}>
                    <View style={[styles.statIconContainer, { backgroundColor: isPremium ? colors.success[50] : colors.neutral[100] }]}>
                      <Shield size={18} color={isPremium ? colors.success[500] : colors.neutral[400]} />
                    </View>
                    <View>
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {isPremium ? 'Premium' : 'Free'}
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.neutral[500] }]}>
                        Account
                      </Text>
                    </View>
                  </View>
                </View>
                
                {!isPremium && (
                  <TouchableOpacity 
                    style={[styles.upgradeButton, { backgroundColor: colors.primary[500] }]}
                    onPress={handleUpgradeAccount}
                  >
                    <Text style={styles.upgradeButtonText}>
                      Upgrade to Premium
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Settings Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Preferences
                </Text>
                
                <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <Bell size={20} color={colors.neutral[600]} />
                      <Text style={[styles.settingText, { color: colors.text }]}>
                        Notifications
                      </Text>
                    </View>
                    <Switch
                      trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                      thumbColor={notificationsEnabled ? colors.primary[500] : colors.neutral[100]}
                      onValueChange={setNotificationsEnabled}
                      value={notificationsEnabled}
                    />
                  </View>
                  
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <Settings size={20} color={colors.neutral[600]} />
                      <Text style={[styles.settingText, { color: colors.text }]}>
                        Dark Mode
                      </Text>
                    </View>
                    <Switch
                      trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                      thumbColor={darkModeEnabled ? colors.primary[500] : colors.neutral[100]}
                      onValueChange={handleDarkModeToggle}
                      value={darkModeEnabled}
                    />
                  </View>
                </View>
              </View>
              
              {/* Support Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Support
                </Text>
                
                <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
                  <TouchableOpacity 
                    style={styles.linkItem}
                    onPress={() => router.push('/help')}
                  >
                    <View style={styles.settingLeft}>
                      <HelpCircle size={20} color={colors.neutral[600]} />
                      <Text style={[styles.settingText, { color: colors.text }]}>
                        Help & FAQ
                      </Text>
                    </View>
                    <ChevronRight size={20} color={colors.neutral[400]} />
                  </TouchableOpacity>
                  
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <TouchableOpacity 
                    style={styles.linkItem}
                    onPress={() => router.push('/privacy')}
                  >
                    <View style={styles.settingLeft}>
                      <Shield size={20} color={colors.neutral[600]} />
                      <Text style={[styles.settingText, { color: colors.text }]}>
                        Privacy Policy
                      </Text>
                    </View>
                    <ChevronRight size={20} color={colors.neutral[400]} />
                  </TouchableOpacity>
                  
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <TouchableOpacity 
                    style={styles.linkItem}
                    onPress={() => router.push('/terms')}
                  >
                    <View style={styles.settingLeft}>
                      <Shield size={20} color={colors.neutral[600]} />
                      <Text style={[styles.settingText, { color: colors.text }]}>
                        Terms of Service
                      </Text>
                    </View>
                    <ChevronRight size={20} color={colors.neutral[400]} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Logout Button */}
              <TouchableOpacity 
                style={[styles.logoutButton, { backgroundColor: colors.error[50] }]}
                onPress={handleLogout}
              >
                <LogOut size={20} color={colors.error[500]} style={styles.logoutIcon} />
                <Text style={[styles.logoutText, { color: colors.error[600] }]}>
                  Log Out
                </Text>
              </TouchableOpacity>
              
              <View style={styles.versionContainer}>
                <Text style={[styles.versionText, { color: colors.neutral[400] }]}>
                  AI Therapist v1.0.0
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.notLoggedInContainer}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary[100] }]}>
                <User size={32} color={colors.primary[500]} />
              </View>
              <Text style={[styles.notLoggedInText, { color: colors.text }]}>
                You're not logged in
              </Text>
              <Text style={[styles.notLoggedInSubtext, { color: colors.neutral[500] }]}>
                Please log in to view your profile
              </Text>
              <TouchableOpacity 
                style={[styles.loginButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.loginButtonText}>
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.signupButton, { backgroundColor: colors.primary[50] }]}
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={[styles.signupButtonText, { color: colors.primary[500] }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 28,
  },
  profileCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  profileStats: {
    flexDirection: 'row',
    padding: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  upgradeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  notLoggedInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  notLoggedInText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  signupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  signupButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});