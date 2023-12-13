import * as Yup from "yup";
export const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.number().required('Phone number is required'),
    birth: Yup.date().required('Date of birth is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    gender: Yup.string().required('Gender is required'),
    
    
})
