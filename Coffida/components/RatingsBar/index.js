import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import styles from '../../styles';

const colours = ['#882e2e', '#d28738', '#ece16b', '#c8e866', '#94f05c', '#54a423'];

const RatingsBar = ({ title, icon, rating }) => {
  const [colour, setColour] = useState(colours[0]);

  useEffect(() => {
    setColour(colours[Math.floor(rating)]);
  }, []);

  return (
    <View
      accessible
      accessibilityLabel={`Overall ${title} is ${rating}.`}
      style={styles.ratingContainer}
    >
      <Text style={styles.ratingTitle}>{title}</Text>
      <MaterialIcons
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Icon for ${title}.`}
        name={icon}
        size={20}
        color="#6200ee"
      />

      { (rating > 0) ? <View style={[styles.ratingCube, { backgroundColor: colour }]} /> : null}
      { (rating > 1) ? <View style={[styles.ratingCube, { backgroundColor: colour }]} /> : null}
      { (rating > 2) ? <View style={[styles.ratingCube, { backgroundColor: colour }]} /> : null}
      { (rating > 3) ? <View style={[styles.ratingCube, { backgroundColor: colour }]} /> : null}
      { (rating > 4) ? <View style={[styles.ratingCube, { backgroundColor: colour }]} /> : null}

      <Text style={[styles.ratingTitle, styles.marginL10]}>{`(${rating})`}</Text>

    </View>
  );
};

RatingsBar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};

export default RatingsBar;
