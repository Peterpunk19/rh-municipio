import { StyleSheet } from "@react-pdf/renderer";

const style = StyleSheet.create({
  page: {
    paddingHorizontal: 45,
    paddingTop: 20,
    paddingBottom: 90,
    fontSize: 9,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    position: "relative",
    height: 110,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 75,
    height: 75,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  headerTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  titleBold: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  boldText: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
  },
  labelCol: {
    width: "auto",
  },
  valueCol: {
    flexGrow: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    width: "100%",
    alignSelf: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#000",
  },
  cellView: {
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 9,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 1,
    borderColor: "#000",
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
  bodyContainer: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  colDate: { width: "18%" },
  colRegister: { width: "14%" },
  colEntry: { width: "12%" },
  colExit: { width: "12%" },
  colMode: { width: "30%" },
  colLocation: { width: "28%" },
  signatureLine: {
    fontSize: 10,
    marginTop: 30,
    borderTop: "1 solid black",
    paddingTop: 5,
    width: "60%",
    alignSelf: "center",
  },
  signatureName: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  signatureTitle: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  copyText: {
    fontSize: 8,
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
});

export default style;
