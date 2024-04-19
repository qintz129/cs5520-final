import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";
import { noDataTextStyles, tabToggleStyles } from "./CustomStyles";

// Styles for Signup and Login screens
export const authenticationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    fontFamily: "PaytoneOne_400Regular",
    fontSize: 45,
    textAlign: "center",
    marginBottom: 20,
  },
  coloredLetter: { color: COLORS.mainTheme },
  slogan: {
    fontFamily: "Molengo_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  coloredWord: {
    color: COLORS.black,
    fontFamily: "PaytoneOne_400Regular",
  },
  disabledText: {
    fontFamily: "Molengo_400Regular",
    color: COLORS.grey,
    fontSize: 18,
  },
  normalText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
  },
});

// Styles for Explore screen
export const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  noResultsText: noDataTextStyles,
});

// Styles for BookDetail screen
export const bookDetailStyles = StyleSheet.create({
  pictureIconSize: 150,
  pictureIconStyle: { alignSelf: "center" },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 370,
    borderRadius: 10,
  },
  bookInfoContainer: {
    padding: 10,
  },
  titleText: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  authorText: {
    marginTop: 5,
    marginBottom: 15,
    fontSize: 25,
    fontFamily: "Molengo_400Regular",
    textAlign: "center",
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 18,
    fontFamily: "Catamaran_400Regular",
    textAlign: "justify",
  },
  userInfoContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: 10,
    borderRadius: 10,
  },
  userButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 20,
  },
  userTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  userText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  userRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  divider: {
    height: 50,
    width: 1,
    backgroundColor: COLORS.lightGrey,
    marginLeft: 10,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  distanceText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "SecularOne_400Regular",
  },
  googleBooks: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: 10,
    borderRadius: 10,
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
  },
  googleIconSize: 24,
  googleButtonText: {
    fontSize: 15,
    fontFamily: "SecularOne_400Regular",
    color: COLORS.black,
    padding: 5,
  },
  ownerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  ownerAvatar: { width: 50, height: 50, borderRadius: 50 },
  userIconSize: 50,
  starIconSize: 20,
  pinIconSize: 24,
  buttonContainer: {
    marginTop: 10,
  },
  sendRequestButton: {
    backgroundColor: COLORS.mainTheme,
    width: 200,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
  },
});

// Styles for OtherUserProfile screen
export const otherUserProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: COLORS.white,
  },
  personIconSize: 100,
  starIconSize: 24,
  chatIconSize: 24,
  userAvatar: {
    marginTop: 20,
    alignItems: "center",
    marginVertical: 5,
    rowGap: 15,
  },
  avatarBottom: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "40%",
  },
  tabs: tabToggleStyles.tabs,
  tab: tabToggleStyles.tab,
  activeTab: tabToggleStyles.activeTab,
  activeTabText: tabToggleStyles.activeTabText,
  tabText: tabToggleStyles.tabText,
  Image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  ratingText: {
    fontSize: 22,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
});

// Styles for Map screen
export const mapStyles = StyleSheet.create({
  map: {
    flex: 1,
  },
  bookIconSize: 27,
  bookIcon: {
    marginLeft: 16,
  },
  pinIconSize: 24,
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
    marginLeft: 5,
  },
  markerTextContainer: {
    backgroundColor: COLORS.mainTheme,
    borderRadius: 8,
    padding: 5,
  },
  markerText: {
    fontWeight: "bold",
    color: COLORS.white,
    fontFamily: "SecularOne_400Regular",
    fontSize: 14,
  },
  bottomContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
  },
  header: {
    fontSize: 20,
    fontFamily: "SecularOne_400Regular",
    marginBottom: 10,
  },
  closeButton: {
    fontSize: 16,
    marginTop: 20,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    marginHorizontal: 100,
    height: 40,
  },
  closeText: {
    fontFamily: "SecularOne_400Regular",
    color: COLORS.white,
    fontSize: 18,
  },
});

// Styles for Requests screen
export const requestsStyles = StyleSheet.create({
  tabs: tabToggleStyles.tabs,
  tab: tabToggleStyles.tab,
  activeTab: tabToggleStyles.activeTab,
  activeTabText: tabToggleStyles.activeTabText,
  tabText: tabToggleStyles.tabText,
  container: {
    flex: 1,
  },
  noRequestsText: noDataTextStyles,
});

// Styles for History screen
export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noHistoryText: noDataTextStyles,
});

// Styles for AddReview screen
export const addReviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Molengo_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  clearButton: {
    width: "40%",
    backgroundColor: COLORS.red,
    borderRadius: 10,
    height: 50,
  },
  submitButton: {
    width: "40%",
    backgroundColor: COLORS.mainTheme,
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    color: COLORS.white,
  },
});

// Styles for Profile screen
export const profileStyles = StyleSheet.create({
  avatarIconSize: 100,
  bookIconSize: 24,
  addABook: {
    alignItems: "flex-start",
    marginVertical: 10,
    marginLeft: 30,
  },
  addBookButton: {
    backgroundColor: COLORS.mainTheme,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    columnGap: 10,
  },
  addBookText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: COLORS.white,
  },
  tabs: tabToggleStyles.tabs,
  tab: tabToggleStyles.tab,
  activeTab: tabToggleStyles.activeTab,
  activeTabText: tabToggleStyles.activeTabText,
  tabText: tabToggleStyles.tabText,
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
  },
  userAvatar: {
    alignItems: "center",
    marginVertical: 5,
  },
  userNameText: {
    fontSize: 22,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
});

// Styles for Library screen
export const libraryStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyLibraryText: noDataTextStyles,
});

// Styles for Reviews screen
export const reviewsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  noReviewsText: noDataTextStyles,
});

// Styles for AddABook screen
export const addABookStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  clearButton: {
    width: "40%",
    backgroundColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clearText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: COLORS.white,
  },
  saveButton: {
    width: "40%",
    backgroundColor: COLORS.mainTheme,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: COLORS.white,
  },
  fetchButton: {
    alignItems: "flex-start",
  },
  desContainer: {
    width: "100%",
  },
});

// Styles for UserInfo screen
export const userInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 100,
  },
  saveButton: {
    backgroundColor: COLORS.mainTheme,
    height: 50,
    borderRadius: 10,
    width: "40%",
  },
  saveText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "SecularOne_400Regular",
  },
  logOutButton: {
    backgroundColor: COLORS.red,
    height: 50,
    borderRadius: 10,
    width: "40%",
  },
  logOutText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "SecularOne_400Regular",
  },
});

// Styles for Chat screen
export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  messagesContainerStyle: {
    backgroundColor: COLORS.white,
  },
  textInputStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },
});
