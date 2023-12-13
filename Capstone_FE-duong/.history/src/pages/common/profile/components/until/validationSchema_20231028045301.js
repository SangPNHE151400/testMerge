import * as Yup from "yup";
export const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Email is not valid').matches(/[\w.+\-]+@gmail\.com/, 'Email must match Ex: abc@gmail.com').required('Email is required'),
    phone: Yup.number().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    gender: Yup.string().required('Gender is required'),
})
