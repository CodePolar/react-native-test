import React from "react";
import { View, Text, Button } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from "./Profile";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddPost from "../components/AddPost";
import Posts from "./Posts";
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                onPress={() => navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        </View>
    );
}

function NotificationsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}


const Home = ({ navigation}) => {
    return (
        <Tab.Navigator initialRouteName="Activity" 

        screenOptions={({ route }) => ({
            headerShown: false,
      
          })}
        
        >
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
                name="Posts"
                component={Posts}
            />


            <Tab.Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
                name="Profile"
                component={Profile}
            />
         
            

        </Tab.Navigator>

    )
}

export default Home;