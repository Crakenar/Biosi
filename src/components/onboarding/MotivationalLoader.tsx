import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface MotivationalLoaderProps {
  visible: boolean;
  message?: string;
}

export const MotivationalLoader: React.FC<MotivationalLoaderProps> = ({
  visible,
  message,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentMessage, setCurrentMessage] = useState('');

  const MOTIVATIONAL_MESSAGES = [
    t('onboarding.motivation.message1'),
    t('onboarding.motivation.message2'),
    t('onboarding.motivation.message3'),
    t('onboarding.motivation.message4'),
    t('onboarding.motivation.message5'),
    t('onboarding.motivation.message6'),
    t('onboarding.motivation.message7'),
    t('onboarding.motivation.message8'),
  ];

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
