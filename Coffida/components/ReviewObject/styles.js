import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    cardActions : {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10
    },

    likeButton : {
        alignItems: 'center',
        flexDirection: 'row',
        width: '20%',
        justifyContent: 'flex-start'
    },

    likeText : {
        marginRight: 10
    },

    divider: {
        height: 2,
        marginBottom: 10,
        backgroundColor: '#6200ee',
    },

});

export default styles;