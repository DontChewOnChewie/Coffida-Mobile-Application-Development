import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    cardActions: {
        justifyContent: 'flex-end',
        paddingRight: 20,
    },

    divider: {
        height: 3,
    },

    noDisplay: {
        display: 'none',
    }
});

export default styles;