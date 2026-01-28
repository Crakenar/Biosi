import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const MOTIVATIONAL_MESSAGES = [
  'This app helps more than 1,000 people save over €200 per month',
  'Users save an average of 15% of their income',
  'Join thousands making smarter financial decisions',
  'Track your spending in work hours, not just money',
  'See the true cost of every purchase',
  'Make every work hour count',
  'Your financial awareness journey starts now',
  'Small changes lead to big savings',
];

interface MotivationalLoaderProps {
  visible: boolean;
  message?: string;
}

export const MotivationalLoader: React.FC<MotivationalLoaderProps> = ({
  visible,
  message,
}) => {
  const { theme } = useTheme();
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (visible) {
      const randomMessage =
        message ||
        MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setCurrentMessage(randomMessage);
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.text,
              textAlign: 'center',
              marginTop: theme.spacing.lg,
              lineHeight: 22,
            }}
          >
            {currentMessage}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    alignItems: 'center',
  },
});
