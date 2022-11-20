import axios from 'axios'

export const fetchApplicantData = (url) => {
  return axios.get(url)
    .then((res) => {
      console.log('fetched data', res.data)
      return res.data
    })
}