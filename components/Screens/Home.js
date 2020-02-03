import {
  View,
  Platform,
  TextInput,
  StyleSheet,
  ImageBackground,
  AsyncStorage
} from 'react-native';
import { Button } from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.handleSumbit = this.handleSumbit.bind(this);
    this.state = {
      firstName: null,
      email: null
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('userStorage', (err, data) => {
      var userJSON = JSON.parse(data);
      console.log('componentWillMount', userJSON.first_name);
      this.props.signin(userJSON._id, userJSON.first_name);
    });
  }

  handleSumbit() {
    //Here is our inputs résults
    // console.log('--------------------------------')
    // console.log('My name : ', this.state.firstName)
    // console.log('My email : ', this.state.email)
    // console.log('--------------------------------')

    // We can store our sent data (available in our state) in a variable called signupData
    var signupData = JSON.stringify({
      first_name: this.state.firstName,
      email: this.state.email
    });

    fetch(`http://10.69.210.145:3000/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: signupData
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        //  REDUX PART
        console.log(
          'RESULTAT DE LERENGISTREMENT EN BD USER --->',
          data.user._id
        );

        // Async storage -----------------------------------------
        var userString = JSON.stringify(data.user);
        AsyncStorage.setItem('userStorage', userString);

        // On envoit au reducer l'_id du user
        this.props.signin(data.user._id, data.user.first_name);
      })
      .catch(error => {
        console.log('Request failed in my Sign-Up Home request', error);
      });

    this.props.navigation.navigate('Map');
  }

  render() {
    if (true === false)
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button title={`Welcome back ${this.user.first_name}`} />
        </View>
      );
    else
      return (
        <ImageBackground
          source={require('../../assets/home.jpg')}
          style={{ width: '100%', height: '100%', flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TextInput
              style={{
                height: 40,
                margin: 5,
                borderRadius: 5,
                width: '70%',
                backgroundColor: 'white',
                opacity: 0.8
              }}
              underlineColorAndroid='transparent'
              placeholder='  Arthur '
              placeholderTextColor='black'
              autoCapitalize='none'
              onChangeText={e => this.setState({ firstName: e })}
            />

            <TextInput
              style={{
                height: 40,
                margin: 5,
                borderRadius: 5,
                width: '70%',
                backgroundColor: 'white',
                opacity: 0.8
              }}
              underlineColorAndroid='transparent'
              placeholder='  arthur@lacapsule.com  '
              placeholderTextColor='black'
              autoCapitalize='none'
              onChangeText={e => this.setState({ email: e })}
            />

            <Button
              title=' Go to Map'
              icon={<Icon name='arrow-right' size={20} color='red' />}
              backgroundColor='#fff'
              onPress={this.handleSumbit}
              type='solid'
            />
          </View>
        </ImageBackground>
      );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signin: function(id, name) {
      dispatch({ type: 'signin', id, name });
    }
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);
