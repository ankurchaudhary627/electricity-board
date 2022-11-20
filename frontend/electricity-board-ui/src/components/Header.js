import { Button, Input, Typography } from 'antd'
import { useState } from 'react'

import '../styles/App.css'

const { Title } = Typography

const Header = (props) => {
  const { handleSearch, handleReset } = props
  const [value, setValue] = useState('')
  const [searchDisabled, setSearchDisabled] = useState(true)

  const onChange = (e) => {
    if (e.target.value === '') {
      setSearchDisabled(true)
    } else {
      setSearchDisabled(false)
    }
    setValue(e.target.value)
  }

  const handleResetClick = () => {
    setValue('')
    setSearchDisabled(true)
    handleReset()
  }

  return (
    <div className='header'>
      <div className='title'>
        <Title code level={1}>Delhi Electricity Board</Title>
      </div>
      <div>
        <Input
          addonBefore='Applicant id'
          style={{ width: 500 }}
          value={value}
          onChange={onChange}
        />
        <Button
          type='primary'
          disabled={searchDisabled}
          onClick={() => handleSearch(value)}
        >
          Search
        </Button>
        <Button onClick={handleResetClick}>Reset</Button>
      </div>
    </div>
  )
}

export default Header