
class PromiseTest {
  constructor(callback){
  }
}
new PromiseTest( "Khoa", 25)

const promiseHandling = (resolve, reject) => {

}

const put = (url, payload) => {
  return new Promise((resolve, reject) => {
    // call API, API do thanh cong
    const a = new Date()
    if (a.getFullYear() <= 2024) {
    resolve({ data: 'api data' })
    } else {
      reject('api call falied')
    }
  })
}
const wrapper = async () => {
  return 1
}
wrapper()


put().then((value) => {
  console.log(value)
}).catch(console.log)
