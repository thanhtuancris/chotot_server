
let City = require("../model/city")
let request = require("request")
module.exports = {
    get_city: async function(req, res){
        let option = {
            'method': 'GET',
            'url': 'https://thongtindoanhnghiep.co/api/city',
            'headers': {
                'Host':'thongtindoanhnghiep.co',
                'Connection':'keep-alive',
                'Cache-Control':'max-age=0',
                'sec-ch-ua':'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile':'?0',
                'Upgrade-Insecure-Requests':'1',
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Sec-Fetch-Site':'same-origin',
                'Sec-Fetch-Mode':'navigate',
                'Sec-Fetch-User':'?1',
                'Sec-Fetch-Dest':'document',
                'Referer':'https://thongtindoanhnghiep.co/rest-api',
                'Accept-Encoding':'',
                'Accept-Language':'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        }
        request(option, function(error, response){
            if(response){
                let rs = JSON.parse(response.body)
                let arr = rs.LtsItem
                let city = []
                let obj
                for(let i = 0; i< arr.length; i++){
                    obj = {
                        name: arr[i].Title,
                        date_import: new Date(),
                        isdelete: false,
                    }
                    city.push(obj)
                }
                res.status(200).json({
                    statuscode: 200,
                    message: "Lấy danh sách thành phố thành công",
                    data: city
                })
                for(let j = 0; j < city.length; j++){
                    let newCity = City({
                        name: city[j].name,
                        isdelete: false,
                        date_import: new Date(),
                    })
                    newCity.save()
                }
            }
        })
    },
    getCity: async function(req, res){
        let rs = await City.find().sort({name: 1})
        if(rs != null){
            res.status(200).json({
                statuscode: 200,
                message: "Lấy danh sách địa điểm thành công",
                data: rs
              })
        }else{
            res.status(400).json({
                statuscode: 400,
                message: "Lấy danh sách địa điểm thất bại"
              })
        }
    }
}