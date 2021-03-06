import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Button, Input, Submit, Text } from '@ui-kitten/components';
import { firebase } from '../../../../firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { userAuth } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const RegistrationForm = () => {
  const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [authUser, setAuthUser] = React.useState(null);
  const [emailMessage, setEmailMessage] = React.useState(null);
  const dispatch = useDispatch();

  // const provider = new firebase.auth.GoogleAuthProvider()

  const save = async (user) => {
    // TODO: проверить нужно ли?
    try {
      const objectValue = JSON.stringify(user);
      await AsyncStorage.setItem('user', objectValue);
    } catch (e) {
      const err = new Error(e);
      setError(err.message);
    }
  };

  const CreateUser = async (email, pass) => {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((info) => {
          firebase
            .firestore()
            .collection('users')
            .doc(info.user.uid)
            .set({
              email: info.user.email == null ? '' : info.user.email,
              displayName:
                info.user.displayName == null
                  ? 'Anonymous'
                  : info.user.displayName,
              photoURL: info.user.photoURL == null ? '' : info.user.photoURL,
              phoneNumber:
                info.user.phoneNumber == null ? '' : info.user.phoneNumber,
              emailVerified:
                info.user.emailVerified == null ? '' : info.user.emailVerified,
              habits: [],
              level: 1,
            });

          // firebase
          // .firestore()
          // .collection('users')
          // .doc(info.user.uid)
          // .collection('habits')
          // .add({
          //   type: '',
          //   icon: '',
          //   title: '',
          //   dates: {},
          // })
        });
      const currentUser = firebase.auth().currentUser;
      const uid = firebase.auth().currentUser.uid;
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((info) => save(info.data()));
      dispatch(userAuth(true));
      currentUser
        .sendEmailVerification()
        .then(() => {
          setEmailMessage('Подтвердите Ваш email на почте');
        })
        .catch((err) => {
          const error = new Error(err);
          setError(error.message);
        });
      setAuthUser(user);
      setError(null);
      setEmail('');
      setPass('');
      setEmailMessage('');
    } catch (err) {
      const error = new Error(err);
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <Layout style={styles.container} level="1">
      <Input
        style={styles.inputs}
        placeholder="Email"
        value={email}
        onChangeText={(nextValue) => setEmail(nextValue)}
      />
      <Input
        style={styles.inputs}
        secureTextEntry={true}
        placeholder="Password"
        value={pass}
        onChangeText={(nextValue) => setPass(nextValue)}
      />
      <Button style={styles.inputs} onPress={() => CreateUser(email, pass)}>
        <Text category="h6">Registration</Text>
      </Button>
      {error && <Text style={styles.error}>{error}</Text>}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: 250,
    minWidth: 200,
  },
  inputs: {
    width: '75%',
  },
  error: {
    width: '75%',
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#FEA82F',
    borderRadius: 6,
    color: '#FEA82F',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    width: '75%',
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 6,
    color: 'green',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default RegistrationForm;
