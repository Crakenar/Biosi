import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'destructive';
  loading?: boolean;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  actions?: ModalAction[];
  children?: React.ReactNode;
  dismissable?: boolean;
}

const { height } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  message,
  icon = '✨',
  iconColor,
  actions = [],
  children,
  dismissable = true,
}) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (dismissable) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Drag indicator */}
          {dismissable && (
            <View style={styles.dragIndicatorContainer}>
              <View
                style={[
                  styles.dragIndicator,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>
          )}

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconColor
                  ? `${iconColor}15`
                  : `${theme.colors.primary}15`,
              },
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
            ]}
          >
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text
              style={[
                styles.message,
                { color: theme.colors.textSecondary },
              ]}
            >
              {message}
            </Text>
          )}

          {/* Custom content */}
          {children && (
            <View style={styles.content}>
              {children}
            </View>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => {
                const isDestructive = action.variant === 'destructive';
                const buttonVariant: 'primary' | 'secondary' | 'outline' = isDestructive ? 'primary' : (action.variant || 'primary') as 'primary' | 'secondary' | 'outline';
                const buttonStyle = isDestructive
                  ? { backgroundColor: theme.colors.error }
                  : undefined;

                const combinedStyle = [
                  styles.actionButton,
                  actions.length > 1 && index > 0 && { marginTop: 12 },
                  buttonStyle,
                ].filter(Boolean);

                return (
                  <Button
                    key={index}
                    title={action.label}
                    onPress={action.onPress}
                    variant={buttonVariant}
                    size="large"
                    style={combinedStyle as any}
                    disabled={action.loading}
                  />
                );
              })}
            </View>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
    maxHeight: height * 0.9,
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  content: {
    marginBottom: 24,
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    width: '100%',
  },
});
