import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleTeamFavourite, selectFavouriteTeams } from '../favourites/favouritesSlice';
import { useTheme } from '../../context/ThemeContext';

interface TeamHeaderProps {
  team: any;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const favouriteTeams = useAppSelector(selectFavouriteTeams);
  const isFavourite = favouriteTeams.includes(team.idTeam);

  const { theme, isDark } = useTheme();

  const handleToggleFavourite = () => {
    dispatch(toggleTeamFavourite(team.idTeam));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${team.strTeam} - ${team.strWebsite || 'Great team!'}`,
        title: team.strTeam,
      });
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  };

  const styles = createStyles(theme, isDark);

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Feather name="arrow-left" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Team Details</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleShare} style={styles.button}>
          <Feather name="share-2" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleFavourite} style={styles.button}>
          <Feather
            name="heart"
            size={24}
            color={isFavourite ? theme.colors.error : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: isDark ? 1 : 0,
      borderBottomColor: theme.colors.border,
    },
    button: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
  });
