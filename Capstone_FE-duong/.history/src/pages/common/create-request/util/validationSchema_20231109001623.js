import * as Yup from "yup";
export const validationSchema = Yup.object({
    title: Yup.string()
    .required('Title is required'),  
})
