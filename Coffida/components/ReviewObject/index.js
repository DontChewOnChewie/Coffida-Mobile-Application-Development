import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import { Text, Card, Paragraph, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import AsyncStoreHelper from '../AsyncStoreHelper';
import FilterModal from '../FilterModal';

const LIKE_COLOR = '#6200ee';
const UNLIKE_COLOR = '#b1b1b1';

const ReviewObject = ({review, locationId, reviewListState, navigation, setGlobalImageURI}) => {
    const [liked, setLiked] = useState(false);
    const [iconColour, setIconColour] = useState(UNLIKE_COLOR);
    const [isUsers, setIsUsers] = useState(false);
    const [imageURI, setImageURI] = useState(null);

    const get_image = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}/photo?t=${new Date().valueOf()}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               return res.blob();
           }
           else {
               console.log("Something went wrong with the status.");
               return;
           }
        })
        .then ((data) => {
            let fs = new FileReader();
            fs.readAsDataURL(data);
            fs.onload = () => {
                setImageURI(fs.result);
            }
        })  
        .catch( (message) => { console.log("ERROR " + message); });
      }

    const set_user_has_liked_comment_and_user_ownership = async () => {
        try { var {token, id} =  JSON.parse(await AsyncStoreHelper.get_credentials()); }
        catch (error) { return null; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               return res.json();
           }
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            const liked_reviews = data.liked_reviews;
            const is_liked = (liked_reviews.filter(like => like.review.review_id === review.review_id).length) > 0;
            is_liked ? setIconColour(LIKE_COLOR) : setIconColour(UNLIKE_COLOR);
            setLiked(is_liked);

            const reviews = data.reviews;
            const is_users = (reviews.filter(rev => rev.review.review_id === review.review_id).length)>0;
            setIsUsers(is_users);
            
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const handle_like_btn_click = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}/like`, {
            method : liked ? "delete": "post",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               console.log("Hit API Review Success");
               liked ? setIconColour(UNLIKE_COLOR) : setIconColour(LIKE_COLOR);
               liked ? review.likes -= 1 : review.likes += 1;
               setLiked(prevLiked => !prevLiked);
               ToastAndroid.showWithGravity(liked ? "Removed Like" : "Added Like", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const handle_delete_review_btn_clicked = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}`, {
            method : "delete",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               reviewListState[1](prevReviews => prevReviews.filter(rev => rev.review_id !== review.review_id));
               ToastAndroid.showWithGravity("Removed Review", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });   
    }

    useEffect(() => {
        set_user_has_liked_comment_and_user_ownership();
        get_image();
    }, []);

    return (
        <Card
        accessible={true}
        accessibilityLabel={`Container for review ${review.review_id}.`}>
            <Card.Content
            accessible={true}
            accessibilityLabel={`Review ${review.review_id} says ${review.review_body}.`}>
                <Text>{review.review_body}</Text>
            </Card.Content>
            <Card.Actions>
                <View style={styles.reviewObjectActionsWrapper}>
                    <View style={styles.likeButtonWrapper}>
                        <Paragraph style={styles.likeButtonText}>{liked ? "Unlike" : "Like"}</Paragraph>
                        <TouchableOpacity
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityHint={`${liked ? "Unlike" : "Like"} this review.`}
                        onPress={() => handle_like_btn_click()}>
                            {/* Style added to align fully. */}
                            <Icon 
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Thumbs up image represeting if a review is liked. You currently ${liked ? "like" : "don't like"} this review.`}
                            name="thumbs-up" 
                            size={25} 
                            color={iconColour} 
                            style={styles.likeButton}/>
                        </TouchableOpacity>
                    </View>

                    <Text>Likes {review.likes}</Text>
                </View>

            </Card.Actions>

            <Card.Actions
            accessible={true}
            accessibilityLabel="Container for editing your created reviews.">
                <View style={styles.reviewObjectUserEditActionsWrapper}>
                    { isUsers ? (
                    <View style={styles.flexDirectionRow}>

                        <TouchableOpacity 
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityHint={`Navigate to edit page for review ${review.review_id}.`}
                        onPress={() => navigation.navigate("Review", {location_id: locationId, previous_review: review, has_image: imageURI})}
                        style={styles.flexDirectionRow}>
                            <Icon 
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Icon to edit review ${review.review_id} button.`}
                            name="edit" 
                            size={25} 
                            color={LIKE_COLOR}/>
                            <Paragraph>Edit</Paragraph>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityHint={`Delete review ${review.review_id}.`}
                        onPress={() => handle_delete_review_btn_clicked()}
                        style={styles.userControlButton}>
                            <Icon 
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Icon for deleting review ${review.review_id} button.`}
                            name="trash" 
                            size={25} 
                            color={'#dd5050'}/>
                            <Paragraph>Delete</Paragraph>
                        </TouchableOpacity>

                    </View>): null}
                    { imageURI != null ? (
                    <TouchableOpacity 
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityHint={`View image for review ${review.review_id}.`}
                    onPress={() => setGlobalImageURI(imageURI)}
                    style={styles.userControlButton}>
                        <Icon 
                        accessible={true}
                        accessibilityRole="image"
                        accessibilityLabel={`Icon for showing review ${review.review_id} button.`}
                        name="image" 
                        size={25} 
                        color={LIKE_COLOR}/>
                        <Paragraph>View Image</Paragraph>
                    </TouchableOpacity>)
                    : null}
                </View>
            </Card.Actions>

            <Divider style={styles.divider}/>

        </Card>
    );
}

export default ReviewObject;