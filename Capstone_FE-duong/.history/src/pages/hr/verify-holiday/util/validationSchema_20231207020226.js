import * as Yup from "yup";
export const validationSchema = Yup.object({
    verify: Yup.string()
    .required('Required'),
})
