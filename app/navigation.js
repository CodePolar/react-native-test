import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Welcome from '../pages/Welcome';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../features/auth/authSlice';
import AddPost from '../components/AddPost';
import Home from '../pages/Home';
const Stack = createNativeStackNavigator();
import { list } from "../features/posts/postSlice";
import axios from 'axios';
import Constants from '../Constants';
import PostDetails from '../components/PostDetails';
import { View } from 'react-native';

const Loading = () => {
    return <View></View>
}

const Navigation = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    _retrieveUser = async () => {
        try {
            setLoading(true);
            const value = await AsyncStorage.getItem('@user');
            if (value !== null) {
                dispatch(signIn(JSON.parse(value)));
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };



    React.useEffect(() => {
        _retrieveUser();
    }, [])

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}
                >
                    {loading ? (
                        <Stack.Screen name="Home" component={Loading} />

                    ) : (
                        user ? (
                            <>

                                <Stack.Screen name="Home" component={Home} />
                                <Stack.Screen name="AddPost" component={AddPost} />
                                <Stack.Screen name="PostDetails" component={PostDetails} />
                                <Stack.Screen name="ProfileAlt" component={Profile} />

                            </>

                        ) : (
                            <>
                                <Stack.Screen name="Welcome" component={Welcome} />
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="Login" component={Login} />

                            </>

                        )
                    )}


                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    )
}

export default Navigation;