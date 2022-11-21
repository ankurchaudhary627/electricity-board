import { message, Table, Button, DatePicker } from 'antd'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import ConnectionRequestEditForm from './ConnectionRequestEditForm'

const { RangePicker } = DatePicker;

const getDataToDisplay = (data) => {
  return data.map((connectionRecord, index) => {
    return {
      key: index,
      govt_id: connectionRecord.govt_id_number,
      id_type: connectionRecord.govt_id_used,
      load: connectionRecord.load_applied,
      category: connectionRecord.connection_category,
      applied_on: connectionRecord.applied_on,
      approved_on: connectionRecord.approved_on || '',
      updated_at: connectionRecord.updated_at,
      status: connectionRecord.status,
      comment: connectionRecord.comment,
      reviewer: connectionRecord.reviewer,
      active: connectionRecord.active
    }
  })
}

const ConnectionApplicationRequests = (props) => {
  const { data, applicantId, refetchConnectionData } = props
  const [connectionData, setConnectionData] = useState([])
  const [loadModal, setLoadModal] = useState(false)
  const [dateRange, setDateRange] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const columns = [
    {
      title: 'Govt id',
      dataIndex: 'govt_id',
      key: 'govt_id',
    },
    {
      title: 'ID Type',
      dataIndex: 'id_type',
      key: 'id_type',
    },
    {
      title: 'Load (kV)',
      dataIndex: 'load',
      key: 'load',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Applied On',
      key: 'applied_on',
      dataIndex: 'applied_on',
    },
    {
      title: 'Approved On',
      key: 'approved_on',
      dataIndex: 'approved_on',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button onClick={handleClick} disabled={!record.active}>Edit</Button>,
    },
  ]

  const handleClick = () => {
    console.log('editing applicant details')
    setLoadModal(true)
  }

  const handleClose = (modalState, isDataUpdated) => {
    setLoadModal(modalState)
    if (isDataUpdated) {
      refetchConnectionData(applicantId)
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      let connectionData = getDataToDisplay(data)
      connectionData.reverse()
      setConnectionData(connectionData)
    }
  }, [data])

  const onChange = (val) => {
    console.log(val);
    if (val) {
      setDateRange(val);
      setShowFilter(true);
    } else {
      setDateRange(null);
      setShowFilter(false)
    }
  }

  const filterByDateRange = () => {
    console.log('filterting data by range');
    if (dateRange) {
      console.log(connectionData);
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      const filteredData = connectionData.filter((data) => {
        return data.applied_on >= startDate
          && data.applied_on <= endDate;
      });
      if (filteredData.length) {
        setConnectionData(filteredData);
      } else {
        message.error("No data present for given date range. Try again");
      }
    }
  }

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > dayjs().endOf('day')
  }

  return (
    <div className='connection-details'>
      <div className='date-range'>
        <div>
          <RangePicker onChange={onChange} disabledDate={disabledDate} />
        </div>
        <div>
          <Button onClick={filterByDateRange} disabled={!showFilter}>
            Filter
          </Button>
        </div>
      </div>
      <Table dataSource={connectionData} columns={columns} bordered size='medium' pagination={{ pageSize: 10 }} />
      {
        loadModal ?
          <ConnectionRequestEditForm applicantId={applicantId} handleClose={handleClose} />
          :
          null
      }
    </div>
  )
}

export default ConnectionApplicationRequests