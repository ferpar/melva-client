import React, { useState, useEffect } from 'react'
import styles from './Ripple.css'

const Ripple = (props) => {

  const {innerMessage = "Cargando..."} = props

  const [initialized, setInitalized] = useState(false)

  useEffect(() => {
    let isSubscribed = true;
    let timeOutID = null;
    if (isSubscribed && !initialized) {
      timeOutID = setTimeout(() => {
        setInitalized(true)
      }, 500)
    }
    return () => {
      isSubscribed = false;
      clearTimeout(timeOutID);
    }
  }, [])

  return ( initialized &&
  <>
    <style>{styles.toString()}</style>
    <div className="lds-ripple">
      <div />
      <div />
    </div>
    <p className="ripple-loading" >{innerMessage}</p>
  </>
)

}

export default Ripple
