import React from 'react';
import Navigation from './components/Navigation/Navigation'

import userId from './components/Reducer/user.reducer'

import {Provider} from 'react-redux'
import {createStore, combineReducers}  from 'redux';
const store = createStore(combineReducers({userId}));

export default class App extends React.Component {
  render() {
    return (
      
      <Provider store={store}>
        <Navigation/>
      </Provider>
        
    );
  }
}

