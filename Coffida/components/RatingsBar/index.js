import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const colours = ['#882e2e', '#d28738', '#ece16b', '#c8e866', '#94f05c'];

const RatingsBar = ({title, icon, rating}) => {
    const [colour, setColour] = useState(colours[0]);

    useEffect(() => {
        setColour(colours[Math.floor(rating)])
    }, []);

    return (
        <View 
        accessible={true}
        accessibilityLabel={`Overall ${title} is ${rating}.`}
        style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>{title}</Text>
            <MaterialIcons
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Icon for ${title}.`} 
            name={icon} 
            size={20} 
            color='#6200ee'/>

            { (rating >= 0) ? <View style={[styles.ratingCube, {backgroundColor: colour}]}></View>: null}
            { (rating >= 1) ? <View style={[styles.ratingCube, {backgroundColor: colour}]}></View>: null}
            { (rating >= 2) ? <View style={[styles.ratingCube, {backgroundColor: colour}]}></View>: null}
            { (rating >= 3) ? <View style={[styles.ratingCube, {backgroundColor: colour}]}></View>: null}
            { (rating >= 4) ? <View style={[styles.ratingCube, {backgroundColor: colour}]}></View>: null}

        </View>
    );

}

export default RatingsBar;