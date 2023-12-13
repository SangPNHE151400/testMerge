import * as Yup from "yup";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').matches(/^[a-zA-Z ]+$/, 'First Name is invalid').max(20, 'First Name is invalid'),
    lastName: Yup.string().required('Last name is required').matches(/^[a-zA-Z]+$/, 'Last Name is invalid').max(10, 'Last Name is invalid'),
    email: Yup.string().email('Email is not valid').matches(/@[^.]*\./, 'Email must match Ex: abc@gmail.com').required('Email is required'),
    phone: Yup.string()
    .required("Phone number is required")
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, "Your phone number must contain 10 digits")
    .max(10, "Your phone number must contain 10 digits"),
    address: Yup.string().required('Address is required').matches(/^[a-zA-Z0-9 ]+$/, 'Address is invalid'),
    country: Yup.string().required('Country is required').matches(/^[a-zA-Z ]+$/, 'Country is invalid'),
    city: Yup.string().required('City is required').matches(/^[a-zA-Z ]+$/, 'City is invalid'),
    gender: Yup.string().required('Gender is required'),
})
