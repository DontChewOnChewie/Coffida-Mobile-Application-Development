import React, {useState} from 'react';
import {View} from 'react-native';
import {Modal, TextInput, Text, RadioButton} from 'react-native-paper';
import styles from './styles';

const FilterModal = ({showFilter, overallRating, overallPriceRating, overallQualityRating, overallClenlinessRating, searchIn}) => {
  const [dropDownValue, setDropDownValue] = useState(null);

  const handle_drop_down_change = (newValue) => {
    setDropDownValue(prevDropDownValue => newValue == prevDropDownValue ? null : newValue);
    searchIn[1](prevSearchIn => newValue == prevSearchIn ? null : newValue);
  }

    return (
        <Modal visible={showFilter[0]} onDismiss={() => showFilter[1](prevShowFilter => !prevShowFilter)} contentContainerStyle={{alignItems:'center', justifyContent:'center'}}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Overall Rating</Text>
              <TextInput
                style={styles.input}
                mode="outlined"
                placeholder="Overall Rating..."
                onChangeText={text => overallRating[1](text)}
                keyboardType='number-pad'
                maxLength={1}
                value={overallRating[0].toString()}
                />
            </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Price Rating</Text>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  placeholder="Price Rating..."
                  onChangeText={text => overallPriceRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallPriceRating[0].toString()}
                  />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quality Rating</Text>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  placeholder="Quality Rating..."
                  onChangeText={text => overallQualityRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallQualityRating[0].toString()}
                  />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Clenliness Rating</Text>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  placeholder="Clenliness Rating..."
                  onChangeText={text => overallClenlinessRating[1](text)}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={overallClenlinessRating[0].toString()}
                  />
              </View>

              <View style={styles.inputContainer}>
                <RadioButton.Group onValueChange={newValue => handle_drop_down_change(newValue)} value={dropDownValue}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white'}}>Search in Favourites</Text>
                    <RadioButton value="favourite" />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white'}}>Search in Reviewed</Text>
                    <RadioButton value="reviewed" />
                  </View>
                </RadioButton.Group>
              </View>
        </Modal>
    );

}

export default FilterModal;