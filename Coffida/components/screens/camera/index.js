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

      const get_image = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/2/review/57/photo?t=${new Date().valueOf()}`, {
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
           else console.log("Something went wrong with the status.");
        })
        .then ((data) => {
            let fs = new FileReader();
            fs.readAsDataURL(data);
            fs.onload = () => {
                setImageURI(fs.result);
            }
            console.log(data.toString());
        })  
        .catch( (message) => { console.log("ERROR " + message); });
      }

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
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    return (
        <View style={styles.container}>
            {imageURI !== null ? <Image style={styles.image} source={{uri: imageURI}}/> : null}
            <View style={styles.buttonView}>
                <Button
                onPress={ () => take_picture() }
                style={styles.button}
                mode="outlined"
                icon="camera">
                Take Picture</Button>
                <Button
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