import React, {useState} from 'react';

import Layout from './components/Layout/Layout';
import AlertMessage from './components/AlertMessage/ModalAlert.jsx';

function App() {
  const [showAlert, setShowAlert] = useState(true)

  const closeAlertMessage = () => {
    setShowAlert(false)
  }

  return (
    <div>
      {
        showAlert && <AlertMessage show={showAlert} closeModal={closeAlertMessage} />
      }
      <Layout />
    </div>
  );
}

export default App;
