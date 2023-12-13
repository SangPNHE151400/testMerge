import * as Yup from "yup";
export const validationSchema = Yup.object({
    title: Yup.string()
    .required('Title is required'), 
    lateType : Yup.string()
    .required('Type is required'),
    content: Yup.string()
    .required('Content is required')
})