import Swal from 'sweetalert2'

export const showAlert = (title, text, icon = 'success') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#f79549',
    timer: icon === 'success' ? 3000 : undefined,
    timerProgressBar: icon === 'success'
  })
}

export const showConfirm = (title, text, confirmButtonText = 'Yes, delete it!') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ee2d46',
    cancelButtonColor: '#6c757d',
    confirmButtonText
  })
}

export const showLoading = (title = 'Please wait...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

export const closeAlert = () => {
  Swal.close()
}
