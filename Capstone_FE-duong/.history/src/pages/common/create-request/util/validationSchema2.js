import * as Yup from "yup";
export const validationSchema2 = Yup.object({
    title: Yup.string()
    .required('Required'),  
    durationEvaluation: Yup.number()
    .required('Duration is required')
    .positive('Duration must be a positive number')
    .integer('Duration must be an integer'),
  
})
