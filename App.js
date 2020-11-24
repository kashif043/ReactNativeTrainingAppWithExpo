import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform, } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigatorRoutes from './Screen/Components/DrawerNavigationRoutes';
import * as firebase from 'firebase';
import firebaseConfig from './Screen/config/firebase';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from './Screen/Components/context';
import RootStackScreen from './Screen/RootStackScreen';
import AsyncStorage from '@react-native-community/async-storage';
import AddNewCategory from './Screen/AddNewCategory';
import ProductsList from './Screen/ProductList';
import AddNewProduct from './Screen/AddNewProduct';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const Stack = createStackNavigator();

function App() {

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    userToken: null,
    userEmail: null,
    userName: null,
    userNumber: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userEmail: action.email,
          userName: action.name,
          userNumber: action.number,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          userEmail: action.email,
          userName: action.name,
          userNumber: action.number,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          userEmail: null,
          userName: null,
          userNumber: null,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          userEmail: action.email,
          userName: action.name,
          userNumber: action.number,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (user) => {
      console.log("User SignIn in App.js -> ", user);
      console.log("User Token in App.js -> ", user.id);
      console.log("User email in App.js -> ", user.email);
      console.log("User name in App.js -> ", user.name);
      console.log("User number in App.js -> ", user.number);

      try {
        await AsyncStorage.setItem('userToken', user.id);
        await AsyncStorage.setItem('userEmail', user.email)
        await AsyncStorage.setItem('userName', user.name)
        await AsyncStorage.setItem('userNumber', user.number)
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', token: user.id, email: user.email, name: user.name, number: user.number });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('userNumber');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async (user) => {
      console.log("User SignUp in App.js -> ", user);
      console.log("User Token in App.js -> ", user.id);
      console.log("User email in App.js -> ", user.email);
      console.log("User name in App.js -> ", user.name);
      console.log("User number in App.js -> ", user.number);

      try {
        await AsyncStorage.setItem('userToken', user.id);
        await AsyncStorage.setItem('userEmail', user.email)
        await AsyncStorage.setItem('userName', user.name)
        await AsyncStorage.setItem('userNumber', user.number)
      } catch (e) {
        console.log(e);
      }

      // dispatch({ type: 'REGISTER', token: user.id, email: user.email, name:user.name, number:user.number });
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    },
    forgotPassword: async (emailSent) => {
      console.log("Forgot Password in App.js -> ", emailSent);

    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      let userToken, userEmail, userName, userNumber;
      userToken = null;
      userEmail = null;
      userName = null;
      userTouserNumberken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userEmail = await AsyncStorage.getItem('userEmail');
        userName = await AsyncStorage.getItem('userName');
        userNumber = await AsyncStorage.getItem('userNumber');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, email: userEmail, name: userName, number: userNumber });
    }, 1000);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          {loginState.userToken !== null ? (
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={DrawerNavigatorRoutes} options={{ headerShown: false }} />
              <Stack.Screen name="NewCategory" component={AddNewCategory} initialParams={{ userToken: loginState.userToken }} options={{
                headerShown: true,
                title: 'Add New Category',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginEnd: Platform.OS === 'ios' ? 0 : 50
                }
              }} />

              <Stack.Screen name="ProductsList" component={ProductsList}
                options={({ navigation }) => ({
                  headerShown: true,
                  title: 'Products List',
                  headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'normal',
                    textAlign: 'center',
                    marginEnd: Platform.OS === 'ios' ? 0 : 0
                  },
                  headerRight: () => (
                    <Icon.Button style={{ paddingEnd: 10 }} name="ios-add" title='Add' size={25} backgroundColor="#f4511e" onPress={() =>
                      navigation.navigate('NewProduct')
                    }></Icon.Button>
                  )
                })}
              />

              <Stack.Screen name="NewProduct" component={AddNewProduct} initialParams={{ userToken: loginState.userToken }} options={{
                headerShown: true,
                title: 'Add New Product',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerBackTitle: 'Products',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginEnd: Platform.OS === 'ios' ? 0 : 50
                }
              }} />

            </Stack.Navigator>
          )
            :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;