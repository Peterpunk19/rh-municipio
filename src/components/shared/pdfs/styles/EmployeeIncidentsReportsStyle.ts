import { StyleSheet } from "@react-pdf/renderer";

const style = StyleSheet.create({
  page: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    position: "relative",
    height: 80,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  titleBold: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 1,
  },
  logoSection: {
    width: "25%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logoImage: {
    width: "80%",
    objectFit: "contain",
  },
  centerSection: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  colIncrement: { width: "3%" },
  colNumberEmployee: { width: "7%" },
  colFullName: { width: "25%" },
  colOficio: { width: "16%" },
  colIncident: { width: "15%" },
  colDate: { width: "8%" },
  colStatus: { width: "10%" },
  publicOrganization: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    color: "#c09429",
    lineHeight: 1,
  },
  rightSection: {
    width: "25%",
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
  boldText: {
    fontWeight: "bold",
  },
  relative: {
    position: "relative",
  },
  flexColumn: {
    flexDirection: "column",
  },
  alignItemsEnd: {
    alignItems: "flex-end",
  },
  alignItemsStart: {
    alignItems: "flex-start",
  },
  textUpperCase: {
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
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
    paddingHorizontal: 2,
    justifyContent: "center",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontSize: 9,
  },
  cellText: {
    fontSize: 7,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
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
  yearText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  bodyContainer: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  dateSection: {
    textAlign: "right",
    marginTop: 30,
    marginBottom: 20,
  },
  date: {
    fontSize: 11,
    fontWeight: "bold",
  },
  officeNumber: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
  },
  recipient: {
    marginTop: 20,
    marginBottom: 15,
  },
  recipientTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  present: {
    fontWeight: "bold",
    fontSize: 10,
  },
  body: {
    marginTop: 20,
    marginBottom: 15,
    lineHeight: 0.8,
  },
  bodyText: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 10,
    textAlign: "justify",
    marginTop: 20,
  },
  signature: {
    marginTop: 30,
    textAlign: "center",
  },
  signatureLine: {
    fontSize: 10,
    marginTop: 20,
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
