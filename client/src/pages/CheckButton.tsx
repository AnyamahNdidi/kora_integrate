import React from 'react'
import axios from 'axios'

const CheckButton = () => {

  const [dataUrl, setDataUrl] = React.useState("")

  const makepayment = async () => {
  let url = "http://localhost:3024/api/pay/6425832a8f6b412a63d5541d"
    const data =
    {
    "title":"food Paymennt",
    "amount":"2000",
    "dec":"i'm buying to bags of rice"
    }
    
    await axios.post(url, data).then((res) => {
      console.log(res)
      console.log(res.data.data.dataPayment.data.checkout_url)
      setDataUrl(res.data.data.dataPayment.data.checkout_url)
      // window.open("https://www.google.com", "_self")
      // window.location.replace("https://www.google.com")

    })
    
  }

  React.useEffect(() => {
   
    if (dataUrl === "")
    {
      return
    } else
    {
       window.open(dataUrl, "_self")
    }

    console.log(dataUrl)
  },[dataUrl])
  return (
    <div>
       <button onClick={makepayment}>Check Out</button>
    </div>
  )
}

export default CheckButton