import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

interface DeleteModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${theme.colors.error}20`,
                borderRadius: theme.borderRadius.round,
              },
            ]}
          >
            <Text style={styles.icon}>🗑️</Text>
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                fontSize: theme.typography.sizes.xl,
                color: theme.colors.text,
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={[
              styles.message,
              {
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.sm,
                marginBottom: theme.spacing.xl,
              },
            ]}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              size="medium"
              style={{ flex: 1, marginRight: theme.spacing.sm }}
            />
            <Button
              title={confirmText}
              onPress={onConfirm}
              size="medium"
              style={{
                flex: 1,
                marginLeft: theme.spacing.sm,
                backgroundColor: theme.colors.error,
              }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});
