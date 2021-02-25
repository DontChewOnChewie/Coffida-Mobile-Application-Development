import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Modal,
  TextInput,
  Text,
  RadioButton,
  Button,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../../styles';

// Used in Search screen to display filter options to user.
// Params:
// showFilter = State object determining whether or not this should be displayed.
// overallRating = State object for setting and getting overall rating.
// overallPriceRating = State object for setting and getting overall price rating.
// overallQualityRating = State object for seting and getting overall quality rating.
// overallClenlinessRating = State object for setting and getting overall clenliness rating.
// searchIn = State object for determining if to search in users favourites or reviewed locations.
// locationsLimit = State object to limit number of locations per page.
// locationsOffset = State object to manage page user is on.
// page = State object used to reset the page number.

const FilterModal = ({
  showFilter,
  overallRating,
  overallPriceRating,
  overallQualityRating,
  overallClenlinessRating,
  searchIn,
  locationsLimit,
  locationsOffset,
  page,
}) => {
  const [dropDownValue, setDropDownValue] = useState(null);

  // Handle unselecting of radio buttons.
  // Ignore no ternary rule in style guide for this function as one off.
  const handleRadioButtonChange = (newValue) => {
    // eslint-disable-next-line no-confusing-arrow
    setDropDownValue((prevDropDownValue) => newValue === prevDropDownValue ? null : newValue);
    // eslint-disable-next-line no-confusing-arrow
    searchIn[1]((prevSearchIn) => newValue === prevSearchIn ? null : newValue);
  };

  // Clear filter to be empty.
  const clearFilter = () => {
    overallRating[1]('');
    overallPriceRating[1]('');
    overallQualityRating[1]('');
    overallClenlinessRating[1]('');
    handleRadioButtonChange(dropDownValue);
    searchIn[1](null);
    locationsLimit[1](5);
    locationsOffset[1](0);
  };

  return (
    <Modal
      accessible
      accessibilityElementsHidden={!showFilter[0]}
      visible={showFilter[0]}
      onDismiss={() => showFilter[1]((prevShowFilter) => !prevShowFilter)}
      contentContainerStyle={styles.modalContainer}
    >

      <View style={styles.filterInputWrapper}>
        <Text style={styles.boldedWhiteText}>Overall Rating</Text>
        <TextInput
          accessibilityLabel="Form input for minimum overall rating."
          accessibilityValue={{ min: 0, max: 0, now: overallRating[0] }}
          style={styles.input60}
          label="Overall Rating..."
          onChangeText={(text) => overallRating[1](text)}
          keyboardType="number-pad"
          maxLength={1}
          value={overallRating[0].toString()}
        />
      </View>

      <View style={styles.filterInputWrapper}>
        <Text style={styles.boldedWhiteText}>Price Rating</Text>
        <TextInput
          accessibilityLabel="Form input for minimum price rating."
          accessibilityValue={{ min: 0, max: 0, now: overallPriceRating[0] }}
          style={styles.input60}
          label="Price Rating..."
          onChangeText={(text) => overallPriceRating[1](text)}
          keyboardType="number-pad"
          maxLength={1}
          value={overallPriceRating[0].toString()}
        />
      </View>

      <View style={styles.filterInputWrapper}>
        <Text style={styles.boldedWhiteText}>Quality Rating</Text>
        <TextInput
          accessibilityLabel="Form input for minimum quality rating."
          accessibilityValue={{ min: 0, max: 0, now: overallQualityRating[0] }}
          style={styles.input60}
          label="Quality Rating..."
          onChangeText={(text) => overallQualityRating[1](text)}
          keyboardType="number-pad"
          maxLength={1}
          value={overallQualityRating[0].toString()}
        />
      </View>

      <View style={styles.filterInputWrapper}>
        <Text style={styles.boldedWhiteText}>Clenliness Rating</Text>
        <TextInput
          accessibilityLabel="Form input for minimum clenliness rating."
          accessibilityValue={{ min: 0, max: 0, now: overallClenlinessRating[0] }}
          style={styles.input60}
          label="Clenliness Rating..."
          onChangeText={(text) => overallClenlinessRating[1](text)}
          keyboardType="number-pad"
          maxLength={1}
          value={overallClenlinessRating[0].toString()}
        />
      </View>

      <View style={styles.filterInputWrapper}>
        <Text style={styles.boldedWhiteText}>Location Limit</Text>
        <TextInput
          accessibilityLabel="Form input limiting number of locations per page."
          accessibilityValue={{ min: 0, max: 0, now: locationsLimit[0] }}
          style={styles.input60}
          label="Loctions limit per page"
          onChangeText={(text) => {
            locationsOffset[1](0);
            page[1](1);
            return locationsLimit[1](text);
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={locationsLimit[0].toString()}
        />
      </View>

      <View style={styles.filterInputWrapper}>
        <RadioButton.Group
          accessibilityRole="radiogroup"
          onValueChange={(newValue) => handleRadioButtonChange(newValue)}
          value={dropDownValue}
        >

          <View style={styles.radioButtonWrapper}>
            <Text style={styles.boldedWhiteText}>Search in Favourites</Text>
            <RadioButton
              accessible
              accessibilityRole="radio "
              accessiblityHint="Toggle fitler to search in favoruties radio button."
              uncheckedColor="#FFFFFF"
              color="#6200ee"
              value="favourite"
            />
          </View>

          <View style={styles.radioButtonWrapper}>
            <Text style={styles.boldedWhiteText}>Search in Reviewed</Text>
            <RadioButton
              accessible
              accessibilityRole="radio "
              accessiblityHint="Toggle filter to search in reviewed radio button."
              uncheckedColor="#FFFFFF"
              color="#6200ee"
              value="reviewed"
            />
          </View>

        </RadioButton.Group>

      </View>

      <Button
        style={styles.button60}
        mode="contained"
        icon="minus-circle"
        onPress={() => clearFilter()}
      >
        Clear Filter
      </Button>

    </Modal>
  );
};

FilterModal.propTypes = {
  showFilter: PropTypes.arrayOf(PropTypes.any).isRequired,
  overallRating: PropTypes.arrayOf(PropTypes.any).isRequired,
  overallPriceRating: PropTypes.arrayOf(PropTypes.any).isRequired,
  overallQualityRating: PropTypes.arrayOf(PropTypes.any).isRequired,
  overallClenlinessRating: PropTypes.arrayOf(PropTypes.any).isRequired,
  searchIn: PropTypes.arrayOf(PropTypes.any).isRequired,
  locationsLimit: PropTypes.arrayOf(PropTypes.any).isRequired,
  locationsOffset: PropTypes.arrayOf(PropTypes.any).isRequired,
  page: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default FilterModal;
