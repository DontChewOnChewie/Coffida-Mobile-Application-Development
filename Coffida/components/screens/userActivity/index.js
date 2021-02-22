import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject';

const UserActivity = ({navigation, route}) => {
    const [favouriteLocations, setFavouriteLocations] = useState([]);
    const [reviewedLocations, setReviewedLocations] = useState([]);

    useEffect(() => {
        setFavouriteLocations(route.params.favourite_locations);
        setReviewedLocations(route.params.reviewed_locations);
    }, []);

    return (
        <View>
            <FlatList
                accessible={true}
                accessibilityRole="scrollbar"
                accessibilityLabel="Scrollable list of your location activity."
                data={favouriteLocations}
                keyExtractor={ item => item.location_id.toString() }
                renderItem={({ item }) => ( 
                <LocationObject location={item} navButton={true} navigation={navigation} backToNavigation={["User", {screen: 'UserActivity'}]}/>
                 )}/>
            <FlatList
                accessible={true}
                accessibilityRole="scrollbar"
                accessibilityLabel="Scrollable list of your posted review activity."
                data={reviewedLocations}
                keyExtractor={item => item.review.review_id.toString()}
                renderItem={({ item }) => ( 
                    <ReviewObject 
                    review={item.review} 
                    locationId={item.location.location_id} 
                    reviewListState={[reviewedLocations, setReviewedLocations]} 
                    navigation={navigation}/>
                )}/>
        </View>
    )

}

export default UserActivity;