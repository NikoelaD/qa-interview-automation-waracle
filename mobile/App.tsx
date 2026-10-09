import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider, useCart } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

function HeaderRight({ navigation }: any) {
  const { count } = useCart();
  const { isAuthed, user } = useAuth();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity testID="header_signin_button" onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: colors.white, fontWeight: '700' }}>{isAuthed ? (user?.firstName || 'Account') : 'Sign in'}</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="header_cart_button" onPress={() => navigation.navigate('Cart')}>
          <Text style={{ color: colors.white, fontWeight: '700' }}>Cart{count ? ` (${count})` : ''}</Text>
        </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ navigation }) => ({
              headerStyle: { backgroundColor: colors.obsidian },
              headerTintColor: colors.white,
              headerTitleStyle: { fontWeight: '800' },
              headerRight: () => <HeaderRight navigation={navigation} />,
            })}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Waracle Store' }} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in', headerRight: () => null }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create account', headerRight: () => null }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout', headerRight: () => null }} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ title: 'Order confirmed', headerBackVisible: false, headerRight: () => null }} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
