import * as Yup from "yup";
export const validationSchema =  Yup.object({
      username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Username should only contain letters, numbers, and underscores')
      .required('Username is required'),
      role: Yup.string().required("Role is require!"),
      department: Yup.string().required("Department is required"),
      room: Yup.string().when(['room'], {
        is: (room) => room, // Validation is applied when room exists and is not empty
        then: Yup.string().required('Room is required'),
      }),
  });