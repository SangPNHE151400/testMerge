import * as Yup from "yup";
export const validationSchema = Yup.object({
    type: Yup.string()
    .required('Type is required'), 
    content: Yup.string()
    .required('Content is required')
})