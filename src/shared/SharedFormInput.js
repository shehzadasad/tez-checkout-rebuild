import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const SharedFormInput = (props) => {
  const onlyLetters = (str) => {
    return /^[a-zA-Z]+$/.test(str);
  };

  const {
    type,
    label,
    placeholder,
    onInputChange,
    value,
    style,
    disabled,
    onBlur,
    multiline,
    form,
  } = props;
  return (
    <Box
      component={form === false ? "" : "form"}
      sx={{
        "& > :not(style)": { width: "100%" },
      }}
      style={{
        marginBottom: style.marginBottom ?? 15,
        marginLeft: style.marginLeft !== null ? style.marginLeft : 0,
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled ?? false}
        multiline={multiline ?? false}
        onChange={(e) => {
          onInputChange(e.target.value);

          //   value = value
          //     .replace(' ', '')
          //     .trim()
          //     .replace(' ', '')
          //     .trim()
          //     .replace(' ', '')
          //     .trim()
          //     .replace(' ', '')

          //   if (
          //     type === 'email' ||
          //     typeof type === 'undefined' ||
          //     type === 'number' ||
          //     e.target.value === '' ||
          //     e.target.value === ' '
          //   ) {
          //     onInputChange(e.target.value)
          //   } else {
          //     const isValid = onlyLetters(value)
          //     if (isValid === true) {
          //       onInputChange(e.target.value)
          //     } else {
          //       const trimmedValue = e.target.value.trim()
          //       const isTrimmeddValid = onlyLetters(trimmedValue)

          //       if (isTrimmeddValid === true) {
          //         onInputChange(e.target.value)
          //       }
          //        else {
          //         // toast.error('Invalid input')
          //         console.log('Invalid input')
          //         return
          //       }
          //     }
          //   }
          // }}
          // onBlur={(e) => {
          //   if (
          //     type === 'email' ||
          //     typeof type === 'undefined' ||
          //     type === 'number'
          //   ) {
          //   } else {
          //     const isValid = onlyLetters(e.target.value)
          //     if (isValid === true) {
          //     } else {
          //       return
          //     }
          //   }

          //   if (typeof onBlur === 'function') {
          //     onBlur(e.target.value)
          //   }
        }}
      />
    </Box>
  );
};

SharedFormInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onInputChange: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

export default SharedFormInput;
