function Notification({ noti }) {
    console.log(noti)
    return (
      noti !== '' && (
        <div style={{ border: "1px solid green", padding: "10px", backgroundColor: "#d4edda" }}>
          {noti}
        </div>
      )
    );
  }
  
  export default Notification;
  