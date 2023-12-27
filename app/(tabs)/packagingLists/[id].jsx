import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { packagingListDetails } from "../../../utils/api";
import { useAuth } from "../../../AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loader";

const PackagingListsDetails = () => {
  const [packagingData2, setPackagingData2] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const dispatch = useDispatch()

  const { isLoading } = useSelector((state) => state.loader);

  const fetchData = async () => {
    try {
      const payload = {
        token: user?.token,
        id: id,
      };
      const data = await packagingListDetails(payload);

      setPackagingData2(data); // Use the data as needed
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      dispatch(setLoader(false))
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    return () => {
      setLoading(false);
      
      setPackagingData2([]);
    };
  }, [router, id]);

  useEffect(() => {
    const filterObjects = () => {
      // Check if values is not an empty string before applying the filter
      if (values !== "") {
        packagingData2?.cartons?.filter((item) => {
          // Check if any field in the object contains the search text
          return Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(values.toLowerCase())
          );
        });
      } else {
        // If values is empty, return the original data
        return packagingData2;
      }
    };

    setFiltered((prevData) => filterObjects(prevData));
  }, [values, packagingData2]);

  return (
    <View style={styles.containerMain}>
      <Text style={styles.mainHeading}>Packing List Detail</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          {/* <TextInput
                        style={styles.searchInput}
                        // value=""
                        // onChange={() => { }}
                        placeholder="Search your packaging!"
                    /> */}
          <TextInput
            style={styles.searchInput}
            value={values}
            onChangeText={(text) => setValues(text)}
            placeholder="Search your packaging!"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/packagingLists/scanner/${id}`)}
          style={styles.searchBtn}
        >
          <Image
            source={require("../../../assets/add.png")}
            resizeMode="contain"
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>
      {!isLoading && (
        <View>
          <Text style={styles.mainHeading}>
            PL-{packagingData2?.packing_list?.ref_no}-
            {packagingData2?.packing_list?.date?.split("-")}-
            {packagingData2?.packing_list?.date?.split("-")?.[1]}
          </Text>
        </View>
      )}
      <ScrollView style={styles.mainPackingLists}>
        {isLoading ? (
          <Text style={styles.mainHeading}>Loading...</Text>
        ) : filtered?.cartons?.length > 0 ? (
          filtered.cartons?.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => router.push(`/scanScreen/${item?.id}`)}
              >
                <View style={styles.mainLists}>
                  <Text>{item?.tracking_id}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.mainHeading}>No Carton Found 😥</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    // flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    // flexDirection: "row",
    paddingHorizontal: "5%",
    margin: "auto",
    // padding: SIZES.medium,
    // borderRadius: SIZES.small,
    // backgroundColor: "#FFF",
    // ...SHADOWS.medium,
    // shadowColor: COLORS.white,
  },
  mainHeading: {
    fontSize: 24,
    color: "#312651",
    marginTop: 20,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    marginTop: 20,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "white",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: "100%",
  },
  searchInput: {
    // fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: "#FF7754",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: "white",
  },
  mainPackingLists: {
    marginTop: 20,
    width: "100%",
    marginBottom: 50,
  },
  mainLists: {
    shadowColor: "#000",
    width: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
    shadowColor: "#F3F4F8",
    // flex: 1,
    // justifyContent: "space-between",
    // alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
  },
});

export default PackagingListsDetails;
