import { useState } from 'react'
import { message, Button, Empty } from 'antd'
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
    setConnectionDataLoaded(false)
    console.log('fetching applicant details', applicant_id)
    fetchApplicantData(`${BASE_URL}/applicant/${applicant_id}`)
      .then((data) => {
        setApplicantData(data)
        setApplicantDataLoaded(true)
        setCurrentApplicantId(applicant_id)
        message.success('Applicant details found.')
      })
      .catch((err) => {
        console.log('error in fetching applicant data!')
        setApplicantDataLoaded(false)
        message.error('Applicant not present. Try again.')
      })
  }

  const refetchApplicantDetails = (applicant_id) => {
    console.log('fetching applicant details', applicant_id)
    fetchApplicantData(`${BASE_URL}/applicant/${applicant_id}`)
      .then((data) => {
        setApplicantData(data)
        setApplicantDataLoaded(true)
        setCurrentApplicantId(applicant_id)
        message.success('Applicant details updated.')
      })
      .catch((err) => {
        console.log('error in fetching applicant data!')
        setApplicantDataLoaded(false)
        message.error('Unable to update applicant details.')
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
        message.success('Connection details loaded.')
      })
      .catch((err) => {
        console.log('error in fetching connection data!')
        setConnectionDataLoaded(false)
        message.error('Unable to load connection details.')
      })
  }

  const refetchConnectionData = () => {
    // get connection data for active applicant id
    console.log('current id-', currentApplicantId)
    fetchApplicantData(`${BASE_URL}/connection_request/${currentApplicantId}`)
      .then((data) => {
        setConnectionData(data)
        setConnectionDataLoaded(true)
        message.success('Connection details updated.')
      })
      .catch((err) => {
        console.log('error in fetching connection data!')
        setConnectionDataLoaded(false)
        message.error('Unable to update connection details.')
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
                <ApplicantDetails applicantId={currentApplicantId} data={applicantData} refetchData={refetchApplicantDetails} />
                :
                (
                  currentApplicantId && !applicantDataLoaded ?
                    <Empty />
                    :
                    null
                )

            }
          </div>
          <div >
            {
              applicantDataLoaded && connectionDataLoaded ?
                <ConnectionApplicationRequests data={connectionData} applicantId={currentApplicantId} refetchConnectionData={refetchConnectionData} />
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
