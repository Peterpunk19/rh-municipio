import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    position: "relative",
    height: 80,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logoSection: {
    width: "40%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  centerSection: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  publicOrganization: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    color: "#c09429",
    lineHeight: 1,
  },
  rightSection: {
    width: "30%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  administrativeOrganization: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
    color: "#333",
    lineHeight: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  bodyContainer: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#c09429",
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "65%",
    paddingHorizontal: 30,
    paddingBottom: 10,
    textAlign: "left",
    fontSize: 12,
    zIndex: 1,
    color: "#000",
  },
});

export default styles;
