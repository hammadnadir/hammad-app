import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { getUser } from "../../AuthContext";

const TabsLayout = () => {
    const user = getUser()
    return (
        <Tabs
            
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Home",
                    title: "Home",
                    tabBarStyle: {
                        display: "none"
                    },

                }}
            />
            {/* <Tabs.Screen
                name="users/[id]"
                options={{
                    tabBarStyle: {
                        display: "none"
                    },
                    headerTitle: "User Page",
                    title: "User",
                    headerShown: false
                }}
            /> */}
            <Tabs.Screen
                name="packagingLists/index"
                options={{
                    // tabBarStyle: {
                    //     display: "none"
                    // },
                    headerTitle: "Packaging List Page",
                    title: "Packaging List",
                    // headerShown: false
                }}
            />
            <Tabs.Screen
                name="packagingLists/[id]"
                options={{
                    // tabBarStyle: {
                    //     display: "none"
                    // },
                    headerTitle: "Packaging List Detail Page",
                    title: "Packaging List Detail",
                    // headerShown: false
                }}
            />


        </Tabs>
    );
};

export default TabsLayout;