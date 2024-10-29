
import PropTypes from "prop-types";

function Notification({ errorMessage, successMessage}) {
    if (!errorMessage && !successMessage) return null;
  
    return (
        <>
            {errorMessage && <p className='border border-red-600 text-red-600 text-2xl'>{errorMessage}</p>}
            {successMessage && <p className='border border-gree-600 text-green-600 text-2xl'>{successMessage}</p>}
        </>
  )
}

Notification.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    successMessage: PropTypes.string.isRequired
}

export default Notification