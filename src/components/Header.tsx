
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type HeaderProps = {
  subtitle: string;
};

export default function Header({ subtitle }: HeaderProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.info}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>HELLO, STUDENT!</Text>
          <Ionicons
            name="sparkles"
            size={14}
            color="#D99A32"
          />
        </View>

        <Text style={styles.name}>Reva Dwi Nurrahma</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.activeLabel}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Keep learning and growing</Text>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileDecoration}>
          <Ionicons name="star" size={12} color="#D99A32" />
        </View>

        <Image
          source={require('../../assets/images/profile.jpg')}
          style={styles.profileImage}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  info: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#8B5CF6',
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: '#302B3D',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9991AC',
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 6,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#42A978',
  },
  activeText: {
    fontSize: 10,
    color: '#9991AC',
  },
  profileContainer: {
    position: 'relative',
    padding: 3,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#D8C7FF',
    marginLeft: 10,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 18,
  },
  profileDecoration: {
    position: 'absolute',
    zIndex: 1,
    top: -7,
    right: -7,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#FFF4DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
