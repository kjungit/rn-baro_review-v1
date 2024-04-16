import React, {useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import CustomButton from '../../components/CustomButton';
import {validateSignUp} from '../../utils';

interface SignUpScreenProps {}

function SignupScreen({}: SignUpScreenProps) {
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);
  const signUp = useForm({
    initialValue: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: validateSignUp,
  });
  const handleSubmit = () => {
    console.log('signUp.values', signUp.values);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          autoFocus
          placeholder="이메일"
          error={signUp.errors.email}
          touched={signUp.touched.email}
          inputMode="email"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...signUp.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          textContentType="oneTimeCode"
          error={signUp.errors.password}
          touched={signUp.touched.password}
          secureTextEntry
          returnKeyType="next"
          blurOnSubmit={false}
          {...signUp.getTextInputProps('password')}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder="비밀번호 확인"
          textContentType="oneTimeCode"
          error={signUp.errors.passwordConfirm}
          touched={signUp.touched.passwordConfirm}
          {...signUp.getTextInputProps('passwordConfirm')}
          secureTextEntry
          returnKeyType="join"
          onSubmitEditing={handleSubmit}
        />
        <CustomButton label="회원가입" onPress={handleSubmit} />
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
