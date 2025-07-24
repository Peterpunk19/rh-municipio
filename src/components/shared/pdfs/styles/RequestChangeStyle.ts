import { StyleSheet } from "@react-pdf/renderer";

const style = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  header: {
    position: "relative",
    height: 80,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  bodyContainer: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  logo: {
    width: 200,
    height: 60,
    marginRight: -5,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 50,
  },
  leftTextContainer: {
    marginRight: 0,
  },
  officialiaText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c78e39",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 2,
    marginLeft: -20,
  },
  mayorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C48B3A",
    textTransform: "uppercase",
    textAlign: "center",
    marginLeft: -20,
  },
  rightTextContainer: {
    marginLeft: 20,
  },
  direccionRecursosText: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    textAlign: "left",
    marginBottom: 2,
    marginLeft: -10,
  },
  humanosText: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    textAlign: "center",
    marginLeft: -10,
  },
  yearText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  dateSection: {
    textAlign: "right",
    marginTop: 10,
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
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  recipientTitle: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  present: {
    fontSize: 11,
    textTransform: "uppercase",
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
    marginTop: 70,
    textAlign: "center",
  },
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
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    paddingTop: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#878787",
  },
  footerLogo: {
    width: 30,
    height: 15,
  },
  copyText: {
    fontSize: 8,
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  uppercase: {
    textTransform: "uppercase",
  },
  center: {
    textAlign: "center",
  },
});

export default style;
