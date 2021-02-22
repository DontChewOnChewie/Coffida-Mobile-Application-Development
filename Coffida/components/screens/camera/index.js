import React, {useState} from 'react';
import {View, Image, ToastAndroid} from 'react-native';
import {Button} from 'react-native-paper';
import styles from './styles';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const CameraView = ({navigation, route}) => {
    const [imageURI, setImageURI] = useState(null);
    const [imageData, setImageData] = useState(null);
    const {location_id, review_id} = route.params;

      const take_picture = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        const data = await ImagePicker.launchCameraAsync({
            base64: true, 
            allowsEditing: false,
        });
        if (!data.cancelled) {
            setImageURI(data.uri);
            setImageData(data);
        }
      };

      const save_image = async () => {
        if (imageData == null) {
            ToastAndroid.show("Take a Picture First", ToastAndroid.SHORT);
            return;
        }

        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review/${review_id}/photo`, {
            method : "post",
            headers: {
                'Content-Type': "image/jpeg",
                "X-Authorization": token
            },
            body: imageData
        })
        .then( (res) => {
           if (res.status == 200) {
               ToastAndroid.showWithGravity("Image Added", ToastAndroid.SHORT, ToastAndroid.CENTER);
               navigation.navigate("Home");
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    return (
        <View style={styles.container}>
            {imageURI !== null ? 
                <Image
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Shows the taken image to upload for review." 
                style={styles.image} 
                source={{uri: imageURI}}/> 
            : null}
            <View style={styles.buttonView}>
                <Button
                accessibilityHint="Load up camera app and take a picture to upload."
                onPress={ () => take_picture() }
                style={styles.button}
                mode="outlined"
                icon="camera">
                Take Picture</Button>
                <Button
                accessibilityHint={`Upload image to server for review.${imageURI != null ? "" : " You need to take a picture first."}`}
                onPress={ () => save_image() }
                style={styles.button}
                mode="outlined"
                icon="upload">
                Upload Picture</Button>
            </View>
        </View>
    );

} 

export default CameraView;