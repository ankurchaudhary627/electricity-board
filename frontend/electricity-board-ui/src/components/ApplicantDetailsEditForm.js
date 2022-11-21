import { message, Form, Input, Button, Modal, Select } from 'antd'
import { useState, useEffect } from 'react'
import {
  OWNERSHIP_MAPPING,
  DISTRICT_MAPPING,
  BASE_URL
} from '../utils/Constants'
import { updateData } from '../helpers/updateData'

const REQUEST_TYPE = 'PATCH'

const ApplicantDetailsEditForm = (props) => {
  const { handleClose, applicantId } = props
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    forceUpdate({})
  }, [])

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setIsModalOpen(false)
    handleClose(false, false)
  }

  const handleSubmit = (values) => {
    if (!values['pincode'] && !values['district'] && !values['ownership']) {
      message.error('Form cannot be blank!')
      return
    }
    console.log('Success:', values)
    console.log('updating applicant details')
    setConfirmLoading(true)
    const pincode = values['pincode'] || ''
    const district_id = values['district'] ? DISTRICT_MAPPING[values['district'].toUpperCase()] : 0
    const ownership_id = values['ownership'] ? OWNERSHIP_MAPPING[values['ownership'].toUpperCase()] : 0
    const data = {
      'pincode': pincode,
      'district_id': district_id,
      'ownership_id': ownership_id
    }
    console.log(data)
    // call patch api here
    updateData(`${BASE_URL}/applicant/${applicantId}`, REQUEST_TYPE, data)
      .then((data) => {
        console.log('updated applicant data', data)
        setIsModalOpen(false)
        handleClose(false, true)
        setConfirmLoading(false)
      })
      .catch((err) => {
        console.log('errors in updating applicant details!')
        message.error('Unable to update details.')
      })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      title='Edit details'
      open={isModalOpen}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        form={form}
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Pincode'
          name='pincode'
          rules={[
            {
              required: false,
              len: 6,
              message: 'Pincode length should be 6',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='District' name='district'>
          <Select>
            <Select.Option value='east'>East</Select.Option>
            <Select.Option value='west'>West</Select.Option>
            <Select.Option value='north'>North</Select.Option>
            <Select.Option value='south'>South</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='Ownership' name='ownership'>
          <Select>
            <Select.Option value='joint'>Joint</Select.Option>
            <Select.Option value='individual'>Individual</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          {() => (
            <Button type='primary' htmlType='submit'
            // disabled={
            //   !form.isFieldsTouched(true) ||
            //   !!form.getFieldsError().filter(({ errors }) => errors.length).length
            // }
            >
              Submit
            </Button>
          )
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ApplicantDetailsEditForm