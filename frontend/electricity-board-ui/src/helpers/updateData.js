import axios from 'axios'

export const updateData = (url, method, data) => {
  if (method.toUpperCase() === 'PATCH') {
    console.log('updating applicant details in PATCH')
    return axios.patch(url, data)
      .then((res) => {
        console.log(res)
        return res.data
      })

  } else if (method.toUpperCase() === 'PUT') {
    console.log('updating connection details in PUT')
    return axios.put(url, data)
      .then((res) => {
        console.log(res)
        return res.data
      })
  }
}