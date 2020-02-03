import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  YellowBox
} from 'react-native';
import { Input, ListItem, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
console.ignoredYellowBox = ['Remote debugger'];

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  "Accessing view manager configs directly off UIManager via UIManager['getConstants'] is no longer supported. Use UIManager.getViewManagerConfig('getConstants') instead."
]);

class ChatScreen extends Component {
  constructor() {
    super();
    this.state = { messageToSend: '', messageList: [] };
  }

  componentDidMount() {
    this.socket = socketIOClient('http://10.69.210.145:3000');
    this.socket.on('sendMessage', data => {
      console.log('sendMessage', data);
      var messageListCopy = [...this.state.messageList];
      messageListCopy.push(data);
      this.setState({ messageToSend: '', messageList: messageListCopy });
    });
  }

  render() {
    var renderMessage = this.state.messageList.map((data, i) => {
      return <ListItem key={i} title={`${data.user} : ${data.message}`} />;
    });

    console.log('test my name -->', this.props.myName);

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>{renderMessage}</ScrollView>

        <KeyboardAvoidingView behavior='padding' enabled>
          <Input
            value={this.state.messageToSend}
            onChangeText={messageToSend => this.setState({ messageToSend })}
            placeholder='your message'
          />
          <Button
            title='Send'
            onPress={() =>
              this.socket.emit('sendMessage', {
                message: this.state.messageToSend,
                user: this.props.myName
              })
            }
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log('Dans mon chat.js -->', state.userId.name);
  return { myName: state.userId.name };
}

export default connect(mapStateToProps, null)(ChatScreen);
