import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CustomAlert = ({ onConfirm, onCancel }) => {
  confirmAlert({
    title: 'Confirmation',
    message: 'Are you sure you want to save?',
    buttons: [
      {
        label: 'Yes',
        onClick: onConfirm,
      },
      {
        label: 'No',
        onClick: onCancel,
      },
    ],
  });

  return null; 
};

export default CustomAlert;
