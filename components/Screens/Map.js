// import React from 'react';
import {
  View,
  Button,
  Platform,
  TextInput,
  StyleSheet,
  ImageBackground,
  AsyncStorage
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import React, { Component } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';

class Mapscreen extends Component {
  state = {
    currentLatitude: 0,
    currentLongitude: 0,
    errorMessage: null,
    logPosition: [],
    displayHistorique: true
  };

  componentWillMount() {
    AsyncStorage.getItem('userStorage', (err, data) => {
      var userJSON = JSON.parse(data);
      this.firstName = userJSON.first_name;
      console.log(this.firstName);
    });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
    } else {
      this._getLocationAsync();
    }

    this._getLocationAsync();

    fetch(
      'http://10.69.210.145:3000/logposition?userId=' +
        this.props.userIdfromStore
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        //console.log('data --------- data --->', data);
        this.setState({ logPosition: data.historiquePosition });
      })
      .catch(error => {
        console.log('Request failed', error);
      });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted ') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    Location.watchPositionAsync({ distanceInterval: 2 }, location => {
      if (this.state.currentLatitude != 0 && this.state.currentLongitude != 0) {
        var logPositionCopy = [...this.state.logPosition];

        logPositionCopy.push({
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude
        });

        this.setState({ logPosition: logPositionCopy });

        fetch('http://10.69.210.145:3000/logposition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:
            'userId=' +
            this.props.userIdfromStore +
            '&latitude=' +
            this.state.currentLatitude +
            '&longitude=' +
            this.state.currentLongitude
        });
      }

      this.setState({
        currentLatitude: location.coords.latitude,
        currentLongitude: location.coords.longitude
      });
      /*
      console.log(
        'Current position --->',
        this.state.currentLatitude,
        this.state.currentLongitude
      );
      */
    });
  };

  render() {
    var markerList = [];
    //console.log(this.state.logPosition)
    if (this.state.displayHistorique) {
      markerList = this.state.logPosition.map((data, i) => (
        <Marker
          key={i}
          pinColor='blue'
          coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        />
      ));

      //console.log('Mon tableau de maker ---<', this.state.logPosition);
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 48.866667,
            longitude: 2.333333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {markerList}

          <Marker
            key={'currentPos'}
            pinColor='red'
            title='Hello'
            description="I'am here"
            coordinate={{
              latitude: this.state.currentLatitude,
              longitude: this.state.currentLongitude
            }}
          />
        </MapView>

        <Button
          title='Historique'
          onPress={() =>
            this.setState({ displayHistorique: !this.state.displayHistorique })
          }
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  //console.log('je recois de mon reducer lid suivant : ', state.userId.id);

  return { userIdfromStore: state.userId.id };
}

export default connect(mapStateToProps, null)(Mapscreen);
