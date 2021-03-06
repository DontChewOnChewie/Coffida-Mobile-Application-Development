import { StyleSheet } from 'react-native';

const MAIN_APP_COLOUR = '#6200ee';

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFEE',
    borderColor: '#dd5050',
    borderWidth: 2,
    marginBottom: 10,
    borderRadius: 8,
  },

  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  size100: {
    width: '100%',
    height: '100%',
  },

  formTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },

  input60: {
    width: '60%',
    height: 60,
    marginBottom: 10,
  },

  input90: {
    width: '90%',
    height: 60,
    marginBottom: 10,
  },

  button40: { width: '40%' },

  button50: { width: '50%' },

  button60: { width: '60%' },

  whiteBackground: { backgroundColor: 'white' },

  width100: { width: '100%' },

  width50: { width: '50%' },

  marginL10: { marginLeft: 10 },

  locationObjectSmallBorder: {
    borderBottomColor: '#EEEEEE',
  },

  reiviewHeadingWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
    borderBottomColor: MAIN_APP_COLOUR,
    borderBottomWidth: 2,
  },

  locationBackButton: {
    position: 'absolute',
    right: 25,
    backgroundColor: MAIN_APP_COLOUR,
  },

  locationObjectActionsWrapper: {
    justifyContent: 'flex-end',
    paddingRight: 20,
  },

  divider: { height: 3 },

  ratingContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  ratingTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    width: '30%',
  },

  ratingCube: {
    width: '10%',
    height: 10,
    marginRight: 1,
  },

  reviewObjectActionsWrapper: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },

  reviewObjectUserEditActionsWrapper: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },

  likeButtonWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'flex-start',
  },

  likeButtonText: { marginRight: 10 },

  likeButton: {
    position: 'relative',
    bottom: 3,
  },

  flexDirectionRow: { flexDirection: 'row' },

  flex1: { flex: 1 },

  userControlButton: {
    flexDirection: 'row',
    marginLeft: 20,
  },

  textarea: {
    justifyContent: 'flex-start',
    width: '90%',
    maxHeight: 120,
    marginBottom: 10,
  },

  reviewScreenButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  deleteImageButton: {
    backgroundColor: MAIN_APP_COLOUR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginTop: 20,
    width: '40%',
    padding: 8,
    borderRadius: 8,
  },

  boldedWhiteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  filterInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 10,
    marginBottom: 10,
  },

  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabBottomRight: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },

  logoutMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  paginationWrapper: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: 'white',
  },

});

export default styles;
