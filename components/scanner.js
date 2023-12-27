import { BarCodeScanner } from "expo-barcode-scanner";

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Table,
  TableWrapper,
  Row,
  Rows,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as Updates from "expo-updates";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../AuthContext";

async function askForPermission() {
  const { status } = await BarCodeScanner.requestPermissionsAsync();

  return status === "granted";
}

export default function ScannerApp() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [product, setProduct] = useState(null);
  const [companyQr, setCompanyQr] = useState(null);
  const [upsQr, setUpsQr] = useState(null);
  const [productData, setProductData] = useState(null);
  const [cottomDetail, setCottonDetail] = useState(null);
  const [erpScanData, setErpScanData] = useState(null);
  const [qrForSubmission, setQrForSubmission] = useState(null);
  const [qrForSubmissionData, setQrForSubmissionData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sound, setSound] = useState();
  const { user } = useAuth();

  const router = useRouter();

  const { id } = useLocalSearchParams();

  useEffect(() => {
    askForPermission().then(setHasPermission);
  }, []);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/beep.wav")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // useEffect(() => {
  //   onFetchUpdateAsync();
  // }, []);

  // const beepSound = new Sound('/assets/beep.wav', Sound.MAIN_BUNDLE, (error) => {
  //   if (error) {
  //     console.log('Failed to load the sound', error);
  //     return;
  //   }
  // });

  // Function to play the beep sound
  // const playBeep = () => {
  //   beepSound.play((success) => {
  //     if (success) {
  //       console.log('Beep sound played successfully');
  //     } else {
  //       console.log('Failed to play the beep sound');
  //     }
  //   });
  // };

  // function onBarCodeScanned(payload) {
  //   setProductData(payload)
  //   // com o código de barras, podemos consultar a nossa API
  //   // setScanning(false);
  //   if (payload.data.includes("erp.print247")) {
  //     setCompanyQr(payload)
  //   } else {
  //     setUpsQr(payload)
  //   }
  //   // após o retorno da API podemos salvar o produto em um estado
  // }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setQrForSubmission(false);
      const getCodedata = erpScanData?.data?.split("/");
      const getCode = getCodedata?.[getCodedata.length - 3];
      const getCode2 = getCodedata?.[getCodedata.length - 2];
      const getCode3 = getCodedata?.[getCodedata.length - 1];
      const payload = {
        packing_list_id: getCode,
        detail_id: getCode2,
        carton: getCode3,
        tracking_id: upsQr?.data,
      };

      const response = await fetch(
        `https://erp.print247.us/api/packing-list/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            device_token: 123456,
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setSubmitting(false);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // if (data?.data)
      const isExist = data?.status === "success" ? true : false;
      // alert(JSON.stringify(data));
      Alert.alert(
        isExist ? "Submitted Successfully" : "Error",
        data?.message,
        [
          {
            text: "Ok",
            onPress: () => {},
            style: isExist ? "default" : "cancel",
          },
        ],
        { cancelable: true }
      );
      setSubmitting(false);
      setScanning(true);
      setUpsQr(null);
      setCompanyQr(null);
      setProduct(null);
      setErpScanData(null);
      setQrForSubmission(false);
      setQrForSubmissionData(null);
    } catch (error) {
      // Handle any errors from the API call
      console.error("Error fetching data:", error);
      setSubmitting(false);
    }
  };

  // useEffect(()=>{
  //  if (companyQr && upsQr) {
  //   if (qrForSubmission) {
  //     handleSubmit()
  //   }
  //  }
  // },[companyQr , upsQr, qrForSubmission])

  async function onBarCodeScanned(payload) {
    console.log("scanned")
    setProductData(payload);
    if (payload.data.includes("erp.print247")) {
      if (!companyQr) {
        setLoader(true);
        playSound();
        setQrForSubmissionData(null);
        setErpScanData(payload);
        setCompanyQr(payload);
        const data = payload?.data;
        const getCodedata = data.split("/");
        const getCode = data.split("/").pop();
        const getCode2 = getCodedata[getCodedata?.length - 2];
        const getCode3 = getCodedata[getCodedata?.length - 3];

        try {
          const response = await fetch(
            `https://erp.print247.us/api/packing-list/create?packing_list_id=${getCode3}&detail_id=${getCode2}&carton_no=${getCode}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                device_token: 123456,
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          if (!response.ok) {
            setLoader(false);
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          // Store the API response in the cottonDetail state
          setCottonDetail(data);
          setLoader(false);
        } catch (error) {
          // Handle any errors from the API call
          console.error("Error fetching data:", error);
          setLoader(false);
        }
      }
    } else if (payload.data.startsWith("1Z")) {
      if (!upsQr) {
        playSound();
        setQrForSubmissionData(null);
        setUpsQr(payload);
        setQrForSubmission(false);
      }
    } else if (payload.data.startsWith("0100")) {
      if (!qrForSubmissionData) {
        setQrForSubmissionData(payload);
        if (upsQr && companyQr) {
          try {
            playSound();
            setSubmitting(true);
            setQrForSubmission(false);
            const getCodedata = erpScanData?.data?.split("/");
            const getCode = getCodedata?.[getCodedata.length - 3];
            const getCode2 = getCodedata?.[getCodedata.length - 2];
            const getCode3 = getCodedata?.[getCodedata.length - 1];
            const payload2 = {
              packing_list_id: getCode,
              detail_id: getCode2,
              carton: getCode3,
              tracking_id: upsQr?.data,
            };

            const response = await fetch(
              `https://erp.print247.us/api/packing-list/store`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  device_token: 123456,
                  Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(payload2),
              }
            );

            if (!response.ok) {
              setSubmitting(false);
              throw new Error("Network response was not ok");
            }

            setSubmitting(false);
            const data = await response.json();
            // if (data?.data)
            const isExist = data?.status === "success" ? true : false;
            // alert(JSON.stringify(data));
            Alert.alert(
              isExist ? "Submitted Successfully" : "Error",
              data?.message,
              [
                {
                  text: "Ok",
                  onPress: () => {},
                  style: isExist ? "default" : "cancel",
                },
              ],
              { cancelable: true }
            );

            setScanning(true);
            setUpsQr(null);
            setCompanyQr(null);
            setProduct(null);
            setErpScanData(null);
            setQrForSubmission(false);
          } catch (error) {
            setSubmitting(false);
            console.error("Error fetching data:", error);
          }
        } else {
          setQrForSubmission(false);
        }
      }
    }
    // Save the product to state after API response
  }

  if (hasPermission === null) {
    return <Text>Obtaining permissions...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No permissions to access the camera</Text>;
  }

  const tableHead = ["Label", "Packing List Number", "Order Number"];
  const tableData = [
    [
      "Company Label",
      cottomDetail?.data?.packing_list_no,
      cottomDetail?.data?.order_no,
    ],
  ];

  const itemRows =
    cottomDetail?.data?.items?.map((item, i) => [item?.name, item?.qty]) || [];

  return (
    <SafeAreaView style={styles.home_page}>
      {!scanning && !upsQr && !companyQr && (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              setScanning(true);
              setUpsQr(null);
              setCompanyQr(null);
            }}
            style={styles.buttonScan}
          >
            <Text style={styles.buttonTextScan}>Scan Now</Text>
          </TouchableOpacity>
        </View>
      )}
      {scanning && (
        <ScrollView contentContainerStyle={styles.scan_screen_container}>
          {/* <View style={styles.scan_screen_container}> */}
          <BarCodeScanner
            onBarCodeScanned={onBarCodeScanned}
            style={{
              height: 330,
              width: "100%",
            }}
          />
          {companyQr && (
            <View style={styles.productUpsContainer}>
              <Text style={styles.productUpsPrice2}>Company Label</Text>
              {loader ? (
                <Text style={styles.productUpsPrice}>
                  <Text style={{ fontWeight: "bold" }}>Loading....</Text>
                </Text>
              ) : (
                <View style={{}}>
                  <Text style={styles.productUpsPrice}>
                    <Text style={{ fontWeight: "bold" }}>
                      Packing List Number:
                    </Text>{" "}
                    {cottomDetail?.data?.packing_list_no}
                  </Text>
                  <Text style={styles.productUpsPrice}>
                    <Text style={{ fontWeight: "bold" }}>
                      Order Number: {cottomDetail?.data?.order_no}
                    </Text>
                  </Text>
                  {cottomDetail?.data?.items?.map((item, i) => {
                    return (
                      <View key={i}>
                        <Text style={styles.productUpsPrice}>
                          <Text style={{ fontWeight: "bold" }}>Name:</Text>
                          <Text> {item?.name}</Text>
                        </Text>
                        <Text style={styles.productUpsPrice}>
                          <Text style={{ fontWeight: "bold" }}>Quantity:</Text>
                          <Text> {item?.qty}</Text>
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
          {upsQr && (
            <View style={styles.productCompanyContainer}>
              <Text style={styles.productCompanyPrice2}>UPS Label</Text>
              <Text style={styles.productCompanyPrice}>{upsQr?.data}</Text>
            </View>
          )}
          <View style={styles.btnContainer}>
            <View style={styles.btnsss}>
              <TouchableOpacity
                // onPress={() => {
                //   setScanning(false);
                //   setCompanyQr(null);
                //   setUpsQr(null);
                //   setQrForSubmissionData(null);
                // }}
                onPress={() => router.push(`/packagingLists/${id}`)}
                style={[styles.button, styles.leftButton]}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>

            {upsQr && companyQr && (
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, styles.rightButton]}
              >
                <Text style={styles.buttonText} disabled={loader}>
                  {submitting ? "Submitting" : "Submit"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* </View> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  home_page: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  productUpsHeader: { height: 50, backgroundColor: "#537791" },
  productUpsHeaderTxt: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  productUpsRow: { height: 40, backgroundColor: "#F7F6E7" },
  productUpsTxt: { textAlign: "center" },

  scrollContainer: {
    // flexGrow: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  scan_screen_container: {
    backgroundColor: "#2CA58D",
    // flex: 1,
    // height: "100%",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  leftButton: {
    marginRight: 5,
  },
  rightButton: {
    marginLeft: 5,
  },
  btnsss: {},
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#2CA58D",
    width: "80%",
    height: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 40,
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    marginVertical: 30,
    // minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 30,
  },
  buttonScan: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#0a2342",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 130,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  buttonTextScan: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  productContainer: {
    flex: 1,
    alignItems: "center",
  },
  productPrice: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productPrice2: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productImageContainer: {
    marginVertical: 30,
    // width: 350,
    // height: 350,
  },

  productCompanyContainer: {
    flex: 1,
    alignItems: "center",
  },
  productCompanyPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productCompanyPrice2: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0a2342",
    marginTop: 50,
    marginBottom: 10,
  },
  productCompanyName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productCompanyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productCompanyImageContainer: {
    marginVertical: 30,
    // width: 350,
    // height: 350,
  },

  productUpsContainer: {
    flex: 1,
    alignItems: "center",
  },
  productUpsPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0a2342",
    textAlign: "center",
  },
  productUpsPrice2: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#0a2342",
    textAlign: "center",
  },
  productUpsName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0a2342",
  },
  productUpsImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productUpsImageContainer: {
    marginVertical: 30,
    // width: 350,
    // height: 350,
  },
});
