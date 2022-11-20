import { useState } from 'react'
import { Button } from 'antd'
import './styles/App.css'
import 'antd/dist/antd.css'
import Header from './components/Header'
import ApplicantDetails from './components/ApplicantDetails'
import ConnectionApplicationRequests from './components/ConnectionApplicationRequests'
import { fetchApplicantData } from './helpers/fetchApplicantData'
import { BASE_URL } from './utils/Constants'

const App = () => {
  const [applicantDataLoaded, setApplicantDataLoaded] = useState(false)
  const [applicantData, setApplicantData] = useState(null)
  const [connectionDataLoaded, setConnectionDataLoaded] = useState(false)
  const [connectionData, setConnectionData] = useState(null)
  const [currentApplicantId, setCurrentApplicantId] = useState(null)

  const fetchApplicantDetails = (applicant_id) => {
    console.log('fetching applicant details', applicant_id)
    fetchApplicantData(`${BASE_URL}/applicant/${applicant_id}`)
      .then((data) => {
        setApplicantData(data)
        setApplicantDataLoaded(true)
        setCurrentApplicantId(applicant_id)
      })
      .catch((err) => {
        console.log('error in fetching applicant data!')
        setApplicantDataLoaded(false)
      })
  }

  const handleReset = () => {
    setApplicantDataLoaded(false)
    setCurrentApplicantId(null)
    setConnectionDataLoaded(false)
  }

  const loadConnectionData = () => {
    // get connection data for active applicant id
    console.log('current id-', currentApplicantId)
    fetchApplicantData(`${BASE_URL}/connection_request/${currentApplicantId}`)
      .then((data) => {
        setConnectionData(data)
        setConnectionDataLoaded(true)
      })
      .catch((err) => {
        console.log('error in fetching connection data!')
        setConnectionDataLoaded(false)
      })
  }

  return (
    <div className='App' >
      <div className='background'></div>
      <div className='foreground'>
        <div>
          <div>
            <Header handleSearch={fetchApplicantDetails} handleReset={handleReset} />
          </div>
          <div className='applicant-details'>
            {
              applicantDataLoaded ?
                <ApplicantDetails applicantId={currentApplicantId} data={applicantData} refetchData={fetchApplicantDetails} />
                :
                null
            }
          </div>
          <div className='connection-details'>
            {
              applicantDataLoaded && connectionDataLoaded ?
                <ConnectionApplicationRequests data={connectionData} applicantId={currentApplicantId} refetchData={loadConnectionData} />
                :
                null
            }
            {
              applicantDataLoaded && !connectionDataLoaded ?
                <Button type='primary' onClick={loadConnectionData}>Load connection data</Button>
                :
                null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
