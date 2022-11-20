import { Descriptions, Card, Button } from 'antd'
import { useState } from 'react'

import ApplicantDetailsEditForm from './ApplicantDetailsEditForm'

const ApplicantDetails = (props) => {
  const { data, applicantId, refetchData } = props
  const { name, gender, district, pincode, state, ownership } = data

  const [loadModal, setLoadModal] = useState(false)

  const handleClick = () => {
    console.log('editing applicant details')
    setLoadModal(true)
  }

  const handleClose = (modalState) => {
    setLoadModal(modalState)
    refetchData(applicantId)
  }

  return (
    <div>
      <Card
        title='Applicant details'
        extra={
          <Button type='primary' onClick={handleClick}>Edit details</Button>
        }
        style={{
          width: 600,
        }}
      >
        <Descriptions>
          <Descriptions.Item label='Name'>{name}</Descriptions.Item>
          <Descriptions.Item label='Gender'>{gender}</Descriptions.Item>
          <Descriptions.Item label='Pincode'>{pincode}</Descriptions.Item>
          <Descriptions.Item label='District'>{district}</Descriptions.Item>
          <Descriptions.Item label='State'>{state}</Descriptions.Item>
          <Descriptions.Item label='Ownership'>{ownership}</Descriptions.Item>
        </Descriptions>
      </Card>
      {
        loadModal ?
          <ApplicantDetailsEditForm applicantId={applicantId} handleClose={handleClose} />
          :
          null
      }
    </div>
  )
}

export default ApplicantDetails