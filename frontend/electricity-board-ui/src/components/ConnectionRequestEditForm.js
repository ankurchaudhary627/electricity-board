import { message, Form, Input, Button, Modal, Select, DatePicker, InputNumber } from 'antd'
import { useState } from 'react'
import {
  BASE_URL,
  REVIEWER_ID_MAPPING,
  CATEGORY_ID_MAPPING,
  STATUS_ID_MAPPING
} from '../utils/Constants'
import { updateData } from '../helpers/updateData'
import dayjs from 'dayjs'

const REQUEST_TYPE = 'PUT'

const REVIEWERS = Object.keys(REVIEWER_ID_MAPPING)
const CATEGORIES = Object.keys(CATEGORY_ID_MAPPING)
const STATUSES = Object.keys(STATUS_ID_MAPPING)

const ConnectionRequestEditForm = (props) => {
  const { handleClose, applicantId } = props
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setIsModalOpen(false)
    handleClose(false, false)
  }

  const handleSubmit = (values) => {
    console.log('updating connection details')
    setConfirmLoading(true)
    let data = {}
    for (var key of Object.keys(values)) {
      if (values[key]) {
        data[key] = values[key]
      }
    }
    if (data['approved_on']) {
      data['approved_on'] = data['approved_on'].format('YYYY-MM-DD')
    }
    if (data['category']) {
      data['category'] = CATEGORY_ID_MAPPING[data['category']]
    }
    if (data['reviewer']) {
      data['reviewer'] = REVIEWER_ID_MAPPING[data['reviewer']]
    }
    if (data['status']) {
      data['status'] = STATUS_ID_MAPPING[data['status']]
    }
    // call put api here
    updateData(`${BASE_URL}/connection_request/${applicantId}`, REQUEST_TYPE, data)
      .then((data) => {
        console.log('updated connection data', data)
        setIsModalOpen(false)
        handleClose(false, true)
        setConfirmLoading(false)
      })
      .catch((err) => {
        console.log('errors in updating connection details!')
        message.error('Unable to update details.')
      })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > dayjs().endOf('day')
  }

  return (
    <Modal
      title='Edit connection request'
      open={isModalOpen}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
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
          label='Load (kV)'
          name='load_applied'
        >
          <InputNumber min={1} max={200} />
        </Form.Item>
        <Form.Item label='Category' name='connection_category'>
          <Select>
            {
              CATEGORIES.map((category) => <Select.Option value={category}>{category}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='Status'
          name='status'
          rules={[
            {
              required: true,
              message: 'Please select status!',
            },
          ]}>
          <Select>
            {
              STATUSES.map((status) => <Select.Option value={status}>{status}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item label='Approved on' name='approved_on'>
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          label='Comment'
          name='comment'
          rules={[
            {
              required: true,
              message: 'Please add comment!',
            },
          ]}>
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>
        <Form.Item
          label='Reviewer'
          name='reviewer'
          rules={[
            {
              required: true,
              message: 'Please select reviewer!',
            },
          ]}>
          <Select>
            {
              REVIEWERS.map((reviewer) => <Select.Option value={reviewer}>{reviewer}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit' loading={confirmLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConnectionRequestEditForm