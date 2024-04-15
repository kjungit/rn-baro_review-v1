import React, {useRef} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {colors} from '../constants';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}
const deviceHeight = Dimensions.get('screen').height;
function InputField({
  disabled = false,
  error,
  touched,
  ...props
}: InputFieldProps) {
  const innerRef = useRef<TextInput | null>(null);
  const handlePressInput = () => {
    innerRef.current?.focus();
  };
  return (
    <Pressable onPress={handlePressInput}>
      <View
        style={[
          styles.container,
          disabled && styles.disabled,
          Boolean(error) && styles.inputError,
        ]}>
        <TextInput
          ref={innerRef}
          editable={!disabled}
          placeholderTextColor={colors.GRAY_500}
          style={[styles.input, disabled && styles.disabled]}
          {...props}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        {touched && Boolean(error) && (
          <Text style={styles.inputText}>{error}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    padding: deviceHeight > 700 ? 15 : 10,
  },
  input: {
    fontSize: 15,
    color: colors.BLACK,
    padding: 0,
  },
  disabled: {
    backgroundColor: colors.GRAY_200,
    color: colors.GRAY_700,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.Red_500,
  },
  inputText: {
    marginTop: 10,
    color: colors.Red_500,
    fontSize: 12,
  },
});

export default InputField;
