
import { useNoti } from "./NotiProvider";

function Notification() {
    const {noti} = useNoti()
    if (!noti.errorMessage && !noti.successMessage) return null;
  
    return (
        <>
            {noti.errorMessage && <p className='border border-red-600 text-red-600 text-2xl'>{noti.errorMessage}</p>}
            {noti.successMessage && <p className='border border-gree-600 text-green-600 text-2xl'>{noti.successMessage}</p>}
        </>
  )
}


export default Notification