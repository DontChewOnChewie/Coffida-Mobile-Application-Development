import React, {useState} from 'react';
import {View} from 'react-native';
import {Modal, TextInput, Text, RadioButton} from 'react-native-paper';
import styles from '../../styles';

const FilterModal = ({showFilter, overallRating, overallPriceRating, overallQualityRating, overallClenlinessRating, searchIn}) => {
  const [dropDownValue, setDropDownValue] = useState(null);

  const handle_drop_down_change = (newValue) => {
    setDropDownValue(prevDropDownValue => newValue == prevDropDownValue ? null : newValue);
    searchIn[1](prevSearchIn => newValue == prevSearchIn ? null : newValue);
  }

    return (
        <Modal 
        accessible={true}
        accessibilityElementsHidden={!showFilter[0]}
        visible={showFilter[0]} 
        onDismiss={() => showFilter[1](prevShowFilter => !prevShowFilter)} 
        contentContainerStyle={styles.modalContainer}>

            <View style={styles.filterInputWrapper}>
              <Text style={styles.boldedWhiteText}>Overall Rating</Text>
              <TextInput
                accessibilityLabel="Form input for minimum overall rating."
                accessibilityValue={{min: 0, max: 0, now: overallRating[0]}}
                style={styles.input60}
                label="Overall Rating..."
                onChangeText={text => overallRating[1](text)}
                keyboardType='number-pad'
                maxLength={1}
                value={overallRating[0].toString()}
                />
            </View>

              <View style={styles.filterInputWrapper}>
                <Text style={styles.boldedWhiteText}>Price Rating</Text>
                <TextInput
                  accessibilityLabel="Form input for minimum price rating."
                  accessibilityValue={{min: 0, max: 0, now: overallPriceRating[0]}}
                  style={styles.input60}
                  label="Price Rating..."
                  onChangeText={text => overallPriceRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallPriceRating[0].toString()}
                  />
              </View>

              <View style={styles.filterInputWrapper}>
                <Text style={styles.boldedWhiteText}>Quality Rating</Text>
                <TextInput
                  accessibilityLabel="Form input for minimum quality rating."
                  accessibilityValue={{min: 0, max: 0, now: overallQualityRating[0]}}
                  style={styles.input60}
                  label="Quality Rating..."
                  onChangeText={text => overallQualityRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallQualityRating[0].toString()}
                  />
              </View>

              <View style={styles.filterInputWrapper}>
                <Text style={styles.boldedWhiteText}>Clenliness Rating</Text>
                <TextInput
                  accessibilityLabel="Form input for minimum clenliness rating."
                  accessibilityValue={{min: 0, max: 0, now: overallClenlinessRating[0]}}
                  style={styles.input60}
                  label="Clenliness Rating..."
                  onChangeText={text => overallClenlinessRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallClenlinessRating[0].toString()}
                  />
              </View>

              <View style={styles.filterInputWrapper}>
                <RadioButton.Group
                accessibilityRole="radiogroup" 
                onValueChange={newValue => handle_drop_down_change(newValue)} 
                value={dropDownValue}>

                  <View style={styles.radioButtonWrapper}>
                    <Text style={styles.boldedWhiteText}>Search in Favourites</Text>
                    <RadioButton 
                    accessible={true}
                    accessibilityRole="radio "
                    accessiblityHint="Toggle fitler to search in favoruties radio button."
                    uncheckedColor="#FFFFFF"
                    color="#6200ee"
                    value="favourite" />
                  </View>

                  <View style={styles.radioButtonWrapper}>
                    <Text style={styles.boldedWhiteText}>Search in Reviewed</Text>
                    <RadioButton
                    accessible={true}
                    accessibilityRole="radio "
                    accessiblityHint="Toggle filter to search in reviewed radio button." 
                    uncheckedColor="#FFFFFF"
                    color="#6200ee"
                    value="reviewed" />
                  </View>

                </RadioButton.Group>
              </View>
        </Modal>
    );

}

export default FilterModal;