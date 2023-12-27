import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { packagingLists } from "../../../utils/api";
import { useAuth } from "../../../AuthContext";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loader";

const PackagingLists = () => {
  const [packagingData, setPackagingData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const { isLoading } = useSelector((state) => state.loader);

  const dispatch = useDispatch()

  const fetchData = async () => {
    try {
      // alert(user?.token)

      const payload = {
        token: user?.token,
      };
      const data = await packagingLists(payload);

      setPackagingData(data); // Use the data as needed
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setPackagingData([]);
    };
  }, []);

  useEffect(() => {
    const filterObjects = () => {
      // Check if values is not an empty string before applying the filter
      if (values !== "") {
        return packagingData.filter((obj) =>
          Object.values(obj).some((value) =>
            String(value).toLowerCase().includes(values.toLowerCase())
          )
        );
      } else {
        // If values is empty, return the original data
        return packagingData;
      }
    };
    setFiltered((prevData) => filterObjects(prevData));
  }, [values, packagingData]);

  const handleClicks = (name) => {
    dispatch(setLoader(true))
    router.push(name)
  }

  return (
    <View style={styles.containerMain}>
      <Text style={styles.mainHeading}>{`Packaging Lists`}</Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={values}
            onChangeText={(text) => setValues(text)}
            placeholder="Search your packaging!"
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleClicks}>
          <Image
            source={require("../../../assets/search.png")}
            resizeMode="contain"
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mainPackingLists}>
        {loading ? (
          <Text style={styles.mainHeading}>Loading...</Text>
        ) : filtered?.length > 0 ? (
          filtered?.map((item, i) => {
            return (
              <TouchableOpacity
                onPress={() => handleClicks(`/packagingLists/${item?.id}`)}
                key={i}
              >
                <View style={styles.mainLists}>
                  <Text>
                    PL-{item?.ref_no}-{item?.date?.split("-")?.[0]}-
                    {item?.date?.split("-")?.[1]}
                  </Text>
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

export default PackagingLists;
