import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import { Text, Card, Paragraph, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import AsyncStoreHelper from '../AsyncStoreHelper';

const LIKE_COLOR = '#6200ee';
const UNLIKE_COLOR = '#b1b1b1';

const ReviewObject = ({review, locationId, reviewListState}) => {
    const [liked, setLiked] = useState(false);
    const [iconColour, setIconColour] = useState(UNLIKE_COLOR);
    const [isUsers, setIsUsers] = useState(false);

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
            console.log(JSON.stringify(reviews, null, 4));
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
    }, []);

    return (
        <Card>
            <Card.Content>
                <Text>{review.review_body}</Text>
            </Card.Content>
            <Card.Actions>
                <View style={styles.cardActions}>
                    <View style={styles.likeButton}>
                        <Paragraph style={styles.likeText}>{liked ? "Unlike" : "Like"}</Paragraph>
                        <TouchableOpacity
                        onPress={() => handle_like_btn_click()}>
                            {/* Style added to align fully. */}
                            <Icon name="thumbs-up" size={25} color={iconColour} style={{position: 'relative', bottom: 3}}/>
                        </TouchableOpacity>
                    </View>

                    <Text>Likes {review.likes}</Text>
                </View>

            </Card.Actions>

            { isUsers ? (
            <Card.Actions>
                <View style={[styles.cardActions, {justifyContent: 'flex-start'}]}>
                    <TouchableOpacity style={{flexDirection: 'row'}}>
                        <Icon name="edit" size={25} color={LIKE_COLOR}></Icon>
                        <Paragraph>Edit</Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => handle_delete_review_btn_clicked()}
                    style={{flexDirection: 'row', marginLeft: 20}}>
                        <Icon name="trash" size={25} color={'#dd5050'}></Icon>
                        <Paragraph>Delete</Paragraph>
                    </TouchableOpacity>
                </View>
            </Card.Actions>): null}

            <Divider style={styles.divider}/>

        </Card>
    );
}

export default ReviewObject;