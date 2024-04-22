import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";
import { cardShadowStyles } from "./CustomStyles";

// Styles for AuthenticationBackground component
export const authenticationBackgroundStyles = StyleSheet.create({
  background: {
    position: "absolute",
    width: 1200,
    height: 1200,
    top: 0,
    opacity: 0.3,
    transform: [
      {
        translateX: 0,
      },
      {
        translateY: 0,
      },
    ],
  },
});

// Styles for ExploreBookCard component
export const exploreBookCardStyles = StyleSheet.create({
  bookAvatar: { width: "100%", height: "100%" },
  imageIconSize: 100,
  pinIconSize: 24,
  item: {
    flex: 1,
    margin: 10,
    height: 270,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
    backgroundColor: COLORS.white,
  },
  cover: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: COLORS.shadowColor,
  },
  titleText: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    fontFamily: "SecularOne_400Regular",
  },
  authorText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Molengo_400Regular",
  },
  distanceContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 5,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: "SecularOne_400Regular",
  },
});

// Styles for BookCard component
export const bookCardStyles = StyleSheet.create({
  pictureIconSize: 50,
  iconSize: 30,
  deleteIconSize: 24,
  item: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderBottomColor,
  },
  itemContent: {
    flexDirection: "row",
  },
  textContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    width: 20,
  },
  titleText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorText: {
    fontFamily: "Molengo_400Regular",
    fontSize: 15,
  },
  button: {
    marginVertical: 0,
    padding: 5,
    width: "80%",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  deleteButton: {
    marginVertical: 0,
    padding: 5,
  },
  Image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

// Styles for RequestCard component
export const requestCardStyles = StyleSheet.create({
  pictureIconSize: 100,
  swapIconSize: 24,
  dateContainer: {
    borderBottomColor: COLORS.borderBottomColor,
    borderBottomWidth: 1,
  },
  dateText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
  },
  offeredText: {
    color: COLORS.offeredText,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  requestedText: {
    color: COLORS.requestedText,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  requestCardText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  noLongerAvailableText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "Molengo_400Regular",
    textAlign: "center",
    marginVertical: 10,
  },
  addressText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: "SecularOne_400Regular",
    marginVertical: 10,
    alignSelf: "center",
    width: "80%",
  },
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: cardShadowStyles.container,
  bookLabel: {
    alignItems: "center",
  },
  bookItem: {
    width: "45%",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  outgoingCancelButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    width: "40%",
    height: 40,
  },
  buttonText: {
    color: COLORS.white,
    alignSelf: "center",
    fontFamily: "SecularOne_400Regular",
    fontSize: 15,
  },
  rejectButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    padding: 10,
    height: 40,
    width: "30%",
  },
  acceptButton: {
    borderRadius: 10,
    backgroundColor: COLORS.mainTheme,
    padding: 10,
    height: 40,
    width: "30%",
  },
  cancelButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    padding: 10,
    height: 40,
    width: "30%",
  },
  completeButton: {
    borderRadius: 10,
    backgroundColor: COLORS.mainTheme,
    padding: 10,
    height: 40,
    width: "30%",
  },
  waitingText: {
    marginVertical: 10,
    color: COLORS.red,
    alignSelf: "center",
    fontFamily: "SecularOne_400Regular",
    fontSize: 16,
  },
  waitingButton: {
    backgroundColor: COLORS.mainTheme,
    borderRadius: 10,
    padding: 10,
    height: 50,
    alignSelf: "center",
    width: "80%",
  },
});

// Styles for HistoryCard component
export const historyCardStyles = StyleSheet.create({
  pictureIconSize: 100,
  dateContainer: {
    borderBottomColor: COLORS.borderBottomColor,
    borderBottomWidth: 1,
  },
  dateText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
  },
  myBookText: {
    color: COLORS.offeredText,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  theirBookText: {
    color: COLORS.requestedText,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  bookNameText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bookItem: {
    width: "45%",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginVertical: 5,
  },
  container: cardShadowStyles.container,
  bottomView: {
    marginTop: 10,
  },
  rejectedText: {
    color: COLORS.grey,
    alignSelf: "center",
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
    marginBottom: 10,
  },
  reviewedText: {
    alignSelf: "center",
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
  },
  reviewButton: {
    backgroundColor: COLORS.mainTheme,
    borderRadius: 10,
    height: 40,
    width: "30%",
    alignSelf: "center",
  },
  reviewText: {
    color: COLORS.white,
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    textAlign: "center",
  },
});

// Styles for ReviewCard component
export const reviewCardStyles = StyleSheet.create({
  ratingImageSize: 20,
  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 5,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 10,
  },
  rating: {
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SecularOne_400Regular",
  },
  date: {
    fontSize: 16,
    color: COLORS.dateColor,
    fontFamily: "SecularOne_400Regular",
  },
  comment: {
    fontSize: 14,
    fontFamily: "Catamaran_400Regular",
  },
});

// Styles for ChangePasswordModal component
export const changePasswordModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 15,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "95%",
  },
  reminder: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: COLORS.red,
    height: 40,
    borderRadius: 10,
    width: "40%",
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
  confirmButton: {
    backgroundColor: COLORS.mainTheme,
    height: 40,
    borderRadius: 10,
    width: "40%",
  },
  confirmText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
});

// Styles for CustomButton component
export const customButtonStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});

// Styles for InputHelper component
export const inputHelperStyles = StyleSheet.create({
  iconSize: 24,
  container: {
    width: "100%",
    marginTop: 10,  
  },
  title: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 16,
  },
  extraEditTitle: {
    alignSelf: "center",
    marginRight: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderWidth: 1.5,
    marginTop: 5,
    borderRadius: 10,
    borderColor: COLORS.grey,
    width: "100%",  
    padding: 5
  },
  multiline: {
    borderWidth: 1.5,
    fontSize: 16,
    borderColor: COLORS.grey,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 5,
    minHeight: 150,
    paddingHorizontal: 10,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
  },
  viewButton: {
    position: "absolute",
    right: 10,
  },
  nonEditable: {
    borderWidth: 0,
    backgroundColor: COLORS.nonEditableColor,
  },
  extraEdit: {
    flexDirection: "row",
  },
});

// Styles for ImageManager component
export const imageManagerStyles = StyleSheet.create({
  photoIconSize: 130,
  addPhotoIconSize: 24,
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  bookImage: {
    width: 150,
    height: 180,
    borderRadius: 10,
  },
  editButton: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: COLORS.editPhotoButtonColor,
    flexDirection: "row",
    columnGap: 10,
  },
  editText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: COLORS.white,
  },
});

// Styles for NotificationManager component
export const notificationManagerStyles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  text: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
