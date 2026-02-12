import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated, Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
const { width } = Dimensions.get('window');

export const FlipCard = ({ item, disabled = false }: { item: any, disabled?: boolean }) => {
  const { theme, language } = useAppSettings();
  const isDarkMode = theme === 'dark';
  const t = translations[language];
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    if (disabled) return;

    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const Container = disabled ? View : Pressable;


  const cardBgColor = isDarkMode ? '#1E293B' : '#E2E8F0';
  const cardBackColor = isDarkMode ? '#1A1D29' : '#CBD5E1';
  const textColor = isDarkMode ? 'white' : '#0F172A';
  const labelColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.6)';

  return (
    <Container onPress={disabled ? undefined : handleFlip} style={styles.cardWrapper} pointerEvents={disabled ? "none" : "auto"}>
      <Animated.View pointerEvents={disabled ? "none" : "auto"} style={[styles.cardContainer, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity, backgroundColor: cardBgColor }]}>
        <Image source={require('@/assets/images/card-bg.png')} style={styles.cardBg} resizeMode="cover" />
        <View style={styles.cardOverlay}>

          <View style={styles.cardTopRow}>
            <MaterialCommunityIcons name="integrated-circuit-chip" size={30} color="#94A3B8" />
            <Ionicons name="wifi" size={24} color="#94A3B8" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>

          <View style={styles.cardNumberRow}>
            {[0, 1, 2, 3].map((index) => {
              const groups = (item.cardNumber || "").replace(/\s/g, '').match(/.{1,4}/g) || [];
              return (
                <View key={index} style={styles.numberGroupContainer}>
                  <Text style={styles.cardNumText}>
                    {groups[index] || "****"}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.cardBottomRow}>
            <View style={{ gap: 8 }}>
              <View>
                <Text style={[styles.cardLabel, { color: labelColor }]}>{t.cardHolder}</Text>
                <Text style={[styles.cardValue, { color: textColor }]} numberOfLines={1}>{item.cardHolderName || "NAME"}</Text>
              </View>
              <View>
                <Text style={[styles.cardLabel, { color: labelColor }]}>{t.expiryDate}</Text>
                <Text style={[styles.cardValue, { color: textColor }]}>{item.expiry || "MM/YY"}</Text>
              </View>
            </View>

            <View style={styles.mcLogos}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B', marginRight: -12 }]} />
              <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', opacity: 0.9 }]} />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, styles.cardBack, { transform: [{ rotateY: backInterpolate }], opacity: backOpacity, backgroundColor: cardBackColor }]}>
        <View style={[styles.blackStripe, { backgroundColor: isDarkMode ? '#000' : '#000' }]} />
        <View style={styles.cvvContainer}>
          <Text style={[styles.cvvLabel, { color: labelColor }]}>{t.cvv}</Text>
          <View style={styles.cvvBox}>
            <Text style={[styles.cvvText, { color: '#000' }]}>{item.cvv || "000"}</Text>
          </View>
        </View>
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  cardWrapper: { width: width - 40, height: 230, marginHorizontal: 10 },
  cardContainer: {
    width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden',
    backgroundColor: '#1E293B', position: 'absolute', backfaceVisibility: 'hidden'
  },
  cardBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  cardOverlay: { flex: 1, padding: 25, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  cardNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  numberGroupContainer: {
    minWidth: 50,
    alignItems: 'center',
  },
  cardNumText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },

  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2, textTransform: 'uppercase' },
  cardValue: { color: 'white', fontSize: 17, fontWeight: '400' },
  mcLogos: { flexDirection: 'row', marginBottom: 5 },
  mcCircle: { width: 25, height: 25, borderRadius: 13 },

  cardBack: { backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center' },
  blackStripe: { width: '100%', height: 45, backgroundColor: '#000', position: 'absolute', top: 35 },
  cvvContainer: { marginTop: 40, alignItems: 'center' },
  cvvLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 },
  cvvBox: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 6, borderRadius: 6 },
  cvvText: { color: 'black', fontSize: 18, fontWeight: 'bold', letterSpacing: 3 },
});