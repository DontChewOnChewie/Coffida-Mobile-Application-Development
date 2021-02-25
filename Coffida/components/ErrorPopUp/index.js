import React from 'react';
import { Banner, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../styles';

// Used on all form input pages to show errors.
// Params:
// errorMessage = Error message to display.
// errorStateFunction = Function to call on message close, usually state object function
//                      stopping the rendering of the error.

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
