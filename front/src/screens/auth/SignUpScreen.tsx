import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import CustomButton from '../../components/CustomButton';
import {validateSignUp} from '../../utils';

interface SignUpScreenProps {}

function SignupScreen({}: SignUpScreenProps) {
  const signUp = useForm({
    initialValue: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: validateSignUp,
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          placeholder="이메일"
          error={signUp.errors.email}
          touched={signUp.touched.email}
          inputMode="email"
          {...signUp.getTextInputProps('email')}
        />
        <InputField
          placeholder="비밀번호"
          error={signUp.errors.password}
          touched={signUp.touched.password}
          {...signUp.getTextInputProps('password')}
          secureTextEntry
        />
        <InputField
          placeholder="비밀번호 확인"
          error={signUp.errors.passwordConfirm}
          touched={signUp.touched.passwordConfirm}
          {...signUp.getTextInputProps('passwordConfirm')}
          secureTextEntry
        />
        <CustomButton label="회원가입" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
});

export default SignupScreen;
