import React from 'react';
import { Modal } from './Modal';
import { useTheme } from '../../contexts/ThemeContext';

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
      onClose={onCancel}
      title={title}
      message={message}
      icon="🗑️"
      iconColor={theme.colors.error}
      actions={[
        {
          label: cancelText,
          onPress: onCancel,
          variant: 'outline',
        },
        {
          label: confirmText,
          onPress: onConfirm,
          variant: 'destructive',
        },
      ]}
    />
  );
};
