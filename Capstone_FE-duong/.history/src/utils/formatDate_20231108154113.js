export default function formatDate(date) {
    const createDate = new Date(date);
    const year = createDate.getFullYear().toString().slice();
    const month = String(createDate.getMonth() + 1).padStart(2, '0');
    const day = String(createDate.getDate()).padStart(2, '0');
    const hours = String(createDate.getHours()).padStart(2, '0');
    const minutes = String(createDate.getMinutes()).padStart(2, '0');
    const seconds = String(createDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }