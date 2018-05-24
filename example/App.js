"use strict";
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_trust_sdk_1 = require("react-native-trust-sdk");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            address: '0xe47494379c1d48ee73454c251a6395fdd4f9eb43',
            amount: '1',
            message: 'hello trust'
        };
        return _this;
    }
    App.prototype.signTx = function () {
        console.log(this.state.address);
    };
    App.prototype.signMsg = function () {
        react_native_trust_sdk_1.signMessage(this.state.message)
            .then(function (value) {
            react_native_1.Alert.alert('sign message result', value);
        });
    };
    App.prototype.render = function () {
        return (<react_native_1.ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
        <react_native_1.Text style={styles.welcome}>
          react-native-trust-sdk example app
        </react_native_1.Text>
        <react_native_1.View>
          <react_native_1.View style={styles.row}>
            <react_native_1.Text style={styles.label}>
              Address:
            </react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={this.state.address}/>
          </react_native_1.View>
          <react_native_1.View style={styles.row}>
            <react_native_1.Text style={styles.label}>
              Amount:
            </react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={this.state.amount}/>
          </react_native_1.View>
          <react_native_1.Button title='Sign Transaction' onPress={this.signTx.bind(this)}/>
        </react_native_1.View>
        <react_native_1.View style={styles.messageContainer}>
          <react_native_1.View style={styles.row}>
            <react_native_1.Text style={styles.label}>
              Message:
            </react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={this.state.message}/>
          </react_native_1.View>
          <react_native_1.Button title='Sign Message' onPress={this.signMsg.bind(this)}/>
        </react_native_1.View>
      </react_native_1.ScrollView>);
    };
    return App;
}(react_1.Component));
exports["default"] = App;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    messageContainer: {
        marginTop: 40
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 5
    },
    label: {
        flex: 1,
        fontSize: 12
    },
    input: {
        flex: 5,
        fontSize: 11,
        borderWidth: 1,
        padding: 4
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 64,
        marginBottom: 20
    }
});
