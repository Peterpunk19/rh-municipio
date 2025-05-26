import { StyleSheet } from "@react-pdf/renderer";

const style = StyleSheet.create({
  page: {
    padding: 30,
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
    width: 100,
    height: 100,
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
  subheaderTextContainer: {
    position: "absolute",
    top: 75,
    left: 0,
    right: 0,
    textAlign: "right",
  },
  titleBold: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 4,
  },
  title: {
    fontSize: 10,
  },

  row: {
    flexDirection: "row",
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    paddingVertical: 2,
    marginTop: 10,
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontSize: 9,
  },
  cellHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
    textAlign: "center",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  lastCell: {
    borderRightWidth: 0,
  },

  footerText: {
    fontSize: 8,
    marginTop: 20,
    textAlign: "left",
    backgroundColor: "#e0e0e0",
    padding: 4,
    fontWeight: "bold",
    lineHeight: 1.5,
  },
  italic: {
    fontStyle: "italic",
  },
  center: {
    textAlign: "center",
  },
  uppercase: {
    textTransform: "uppercase",
  },

  qrSection: {
    flexDirection: "row",
    marginTop: 2,
  },
  qrBox: {
    width: "15%",
    padding: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signatureBoxQR: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },
  selloBox: {
    width: "15%",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  },
  selloImage: {
    width: 130,
    height: 90,
    marginLeft: -50,
  },
  firmaTextQR: {
    fontSize: 9,
    marginTop: 6,
    textAlign: "center",
  },
  firmaLineaQR: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 10,
  },

  signatureSection: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-around",
    alignItems: "flex-end",
    gap: "30px 0",
  },
  signatureBox: {
    width: "30%",
    textAlign: "center",
  },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
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
  authorizationSection: {
    height: 20,
    backgroundColor: "#e0e0e0",
    border: "1px solid #000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default style;
