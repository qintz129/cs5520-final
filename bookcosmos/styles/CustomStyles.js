import { COLORS } from "./Colors";

// Styles for ActivityIndicator
export const activityIndicatorStyles = {
  size: "large",
  color: COLORS.mainTheme,
  style: { marginTop: 20 },
};

// Styles for TabBar Toggle
export const tabToggleStyles = {
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.mainTheme,
  },
  activeTabText: {
    color: COLORS.black,
    marginBottom: 10,
  },
  tabText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: COLORS.grey,
  },
};

// Styles for card shadow
export const cardShadowStyles = {
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderBottomColor,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    margin: 10,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
};

// No data text style
export const noDataTextStyles = {
  fontSize: 20,
  textAlign: "center",
  marginTop: 20,
  fontFamily: "Molengo_400Regular",
  color: COLORS.grey,
};
