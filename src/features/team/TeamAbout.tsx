// src/features/team/TeamAbout.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface TeamAboutProps {
  description?: string;
}

export default function TeamAbout({ description }: TeamAboutProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  if (!description) return null;

  const isLongDescription = description.length > 300;

  return (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text numberOfLines={expanded ? undefined : 4} style={styles.description}>
        {description}
      </Text>
      {isLongDescription && (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>{expanded ? 'Show less' : 'Read more'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    descriptionSection: {
      padding: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
    },
    readMore: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
    },
  });
