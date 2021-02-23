import React from 'react';
import { Banner, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../styles';

const ErrorPopUp = ({ errorMessage, errorStateFunction }) => (
  <Banner
    style={styles.bannerContainer}
    accessible
    accessibilityRole="alert"
    accessibilityLabel="Error Banner"
    accessibilityHint={`Error with form inputs is ${errorMessage}`}
    visible
    actions={[{
      label: 'Close',
      onPress: () => errorStateFunction(null),
    }]}
  >
    <Text style={styles.ratingTitle}>{errorMessage}</Text>
  </Banner>

);

ErrorPopUp.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorStateFunction: PropTypes.func.isRequired,
};

export default ErrorPopUp;
