import '../index.css'

const Nottificaton = ({message, isError}) => {
  if (message === null) return null;

  return (
    <div
      className={`nottification ${isError === true ? 'error' : 'success'}`}>{message}</div>  
  )
}

export default Nottificaton