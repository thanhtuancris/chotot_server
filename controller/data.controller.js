let request = require("request");
let Bike = require("../model/bike")
let Noti = require("../model/noti")
var admin = require("firebase-admin");
var serviceAccount = require("../chotot.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chototserver-default-rtdb.firebaseio.com/"
});
function loadbalance () {
    let arr = ["207.148.65.204", "45.32.124.189", "198.13.59.148"]
    let ip = arr[Math.floor(Math.random() * arr.length)];
    console.log(ip)
    let random_url = `http://${ip}:8000/api/cuahang`
    var options = {
        'method': 'POST',
        'url': random_url,
        'headers': {}
    }
    request(options, function (error, response) {
        if (error) {
            console.log("Loi roi nhe :(");
            loadbalance();
        } else {
            let random_url = `http://${ip}:8000/api/canhan`
            var options = {
                'method': 'POST',
                'url': random_url,
                'headers': {}
            }
            request(options, function (error, response) {
            })
        }
    })
}
module.exports = {
    cuahang: async function (req, res) {
        let option = {
            'method': 'GET',
            'url': 'https://gateway.chotot.com/v1/public/ad-listing?o=0&cg=2020&st=s,k&limit=50&key_param_included=true',
            'headers': {
                "Host": 'gateway.chotot.com',
                "Connection": 'keep-alive',
                "sec-ch-ua": '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile": '?0',
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                "Accept": '*/*',
                "Origin": 'https://xe.chotot.com',
                "Sec-Fetch-Site": 'same-site',
                "Sec-Fetch-Mode": 'cors',
                "Sec-Fetch-User": 'empty',
                "Referer": 'https://xe.chotot.com/',
                "Accept-Encoding": '',
                "Accept-Language": 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        }
        request(option, async function (error, response) {
            if (response) {
                let data = JSON.parse(response.body)
                data = data.ads
                let result = []
                let obj = {
                    account_name: "",
                    date: "",
                    title: "", //data[i].subject
                    description: "", //data[i].body
                    address: "", //data[i].ward_name + data[i].area_name + data[i].region_name
                    province: "", //data[i].region_name
                    price: "",
                    image: "",
                    status: "", //data[i].condition_ad_name
                    phone: "",
                    mileage_v2: "", //data[i].mileage_v2
                    year_registered: "", //data[i].params[0].value
                    type: "", //data[i].params[1].value
                    motorbikebrand: "",
                    motorbikecapacity: "",
                    loaiCH: ""
                }
                for (let i = 0; i < data.length; i++) {
                    let descript = data[i].body.split("\n").join(".")
                    if (typeof data[i].shop !== 'undefined') {
                        obj = {
                            account_name: data[i].account_name,
                            date: data[i].date,
                            title: data[i].subject,
                            description: descript,
                            province: data[i].region_name.toLowerCase(),
                            image: data[i].image,
                            status: data[i].condition_ad_name,
                            phone: data[i].phone,
                            mileage_v2: data[i].mileage_v2,
                            loaiCH: "Cửa hàng"

                        }
                        if (typeof data[i].price === 'undefined') {
                            obj.price = 0
                        } else {
                            obj.price = data[i].price
                        }
                        if (typeof data[i].ward_name === 'undefined') {
                            obj.address = data[i].area_name + " - " + data[i].region_name
                        } else {
                            obj.address = data[i].ward_name + " - " + data[i].area_name + " - " + data[i].region_name
                        }
                        if (typeof data[i].shop !== 'undefined') {
                            obj.loaiCH = "Cửa hàng"
                        }
                        if (typeof data[i].params[0] === 'undefined') {
                            obj.year_registered = ""
                        } else {
                            obj.year_registered = data[i].params[0].value
                        }
                        if (typeof data[i].params[1] === 'undefined') {
                            obj.type = ""
                        } else {
                            obj.type = data[i].params[1].value
                        }
                        switch (data[i].motorbikebrand) {
                            case 1:
                                obj.motorbikebrand = "Honda"
                                break;
                            case 2:
                                obj.motorbikebrand = "Yamaha"
                                break;
                            case 3:
                                obj.motorbikebrand = "Piaggio"
                                break;
                            case 4:
                                obj.motorbikebrand = "Suzuki"
                                break;
                            case 5:
                                obj.motorbikebrand = "SYM"
                                break;
                            case 12:
                                obj.motorbikebrand = "Ducati"
                                break;
                            case 8:
                                obj.motorbikebrand = "Benelli"
                                break;
                            case 17:
                                obj.motorbikebrand = "Kawasaki"
                                break;
                            case 35:
                                obj.motorbikebrand = "Brixton"
                                break;
                            case 21:
                                obj.motorbikebrand = "Kymco"
                                break;
                            case 20:
                                obj.motorbikebrand = "KTM"
                                break;
                            default:
                                obj.motorbikebrand = "Hãng khác"
                        }
                        switch (data[i].motorbikecapacity) {
                            case 1:
                                obj.motorbikecapacity = "Dưới 50 cc"
                                break;
                            case 2:
                                obj.motorbikecapacity = "50 - 100 cc"
                                break;
                            case 3:
                                obj.motorbikecapacity = "100 - 175 cc"
                                break;
                            case 4:
                                obj.motorbikecapacity = "Trên 175 cc"
                                break;
                            default:
                                obj.motorbikecapacity = "Không biết rõ"
                        }
                        result.push(obj)
                    }
                }
                for (let j = 0; j < result.length; j++) {
                    setTimeout(async function () {
                        let check = await Bike.findOne({
                            isdelete: false,
                            title: result[j].title
                        })
                        if (check == null) {
                            let newBike = Bike({
                                tennguoiban: result[j].account_name,
                                image: result[j].image,
                                title: result[j].title,
                                loaixe: result[j].type,
                                gia: result[j].price,
                                date: result[j].date,
                                diadiem: result[j].address,
                                province: result[j].province.toLowerCase(),
                                mota: result[j].description,
                                hangxe: result[j].motorbikebrand,
                                namdangky: result[j].year_registered,
                                sokm: result[j].mileage_v2,
                                sodt: result[j].phone,
                                dungtichxe: result[j].motorbikecapacity,
                                loaiCH: result[j].loaiCH,
                                trangthai: 1, //1: chua xem, 2: da lien he, 3: da ban, 4: ko nghe may, 5: da xem
                                ghichu: "",
                                isdelete: false,
                                date_import: new Date(),
                            })
                            newBike.save()
                            let messages = {
                                notification: {
                                    title: `${result[j].title}`,
                                    body: `Giá: ${result[j].price}. Địa điểm: ${result[j].address}`
                                },
                                topic: "minhhoangjsc"
                            };
                            admin.messaging().send(messages)
                                .then((response) => {
                                    console.log("Day thanh cong cua hang!")
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    }, 100 * j)
                }
            }
        })
    },
    findAll: async function (req, res) {
        let filter = {
            isdelete: false
        }
        var checkBody = ["title", "loaixe", "loaiCH"];
        for (var k in req.body) {
            if (checkBody.indexOf(k) != -1 && req.body[k]) {
                filter[k] = new RegExp(req.body[k].trim(), 'i')
            }
        }
        let diadiem = req.body.diadiem
        let province = []
        if (diadiem != null) {
            if (Array.isArray(diadiem) == true) {
                for (let i = 0; i < diadiem.length; i++) {
                    // province.push(diadiem[i].toLowerCase());
                    province.push(diadiem[i]);
                }
                filter.province = {
                    $in: province
                }
            }
            if (typeof diadiem == 'string') {
                filter.diadiem = new RegExp(diadiem.trim(), 'i')
            }
        }
        if(diadiem == null) {
            filter.isdelete = false
        }
        let newnoti = Noti({
            token: req.body.token,
            arr_city: diadiem,
        })
        let check_trung = await Noti.findOne({token: req.body.token})
        if(check_trung == null){
            let rs_save = await newnoti.save()
        }else{
            let rs_update = await Noti.findOneAndUpdate({token: req.body.token}, {arr_city: diadiem})
        }
        console.log(filter)
        const perPage = parseInt(req.body.limit);
        const page = parseInt(req.body.page || 1);
        const skip = (perPage * page) - perPage;
        let rs_find = await Bike.find(filter).skip(skip).limit(perPage).sort({
            date_import: -1
        });
        const totalDocuments = await Bike.countDocuments(filter);
        const totalPage = Math.ceil(totalDocuments / perPage);
        if (rs_find != null) {
            res.status(200).json({
                message: rs_find,
                totalDocuments: totalDocuments,
                totalPage: totalPage,
            })
        } else {
            res.status(200).json({
                message: "Lỗi! Vui lòng thử lại"
            })
        }
    },
    update: async function (req, res) {
        let status = req.body.status
        let note = req.body.note

        let filter = {
            _id: req.body.id,
            isdelete: false
        }
        let update = {
            trangthai: (status) ? status : "",
            ghichu: (note) ? note : "",
        }
        let rs_update = await Bike.findOneAndUpdate(filter, update)
        if (rs_update != null) {
            res.status(200).json({
                statuscode: 200,
                message: "Cập nhật thành công"
            })
        } else {
            res.status(400).json({
                statuscode: 400,
                message: "Cập nhật thất bại"
            })
        }
    },
    keepProducts: async function (req, res) {
        let check = await Bike.countDocuments({
            isdelete: false
        })
        if (check > 500) {
            let rs_data = check - 500
            let rs_find = await Bike.find({
                isdelete: false
            }).sort({
                date_import: 1
            }).limit(rs_data)
            for (let i = 0; i < rs_find.length; i++) {
                console.log(rs_find[i]._id);
                let rs_del = await Bike.deleteMany({
                    _id: rs_find[i]._id
                })
                if (i + 1 == rs_find.length) {
                    res.status(200).json({
                        message: "Done"
                    })
                }
            }

        }
    },
    canhan: async function (req, res) {
        let option = {
            'method': 'GET',
            'url': 'https://gateway.chotot.com/v1/public/ad-listing?o=0&f=p&cg=2020&st=s,k&limit=50&key_param_included=true',
            'headers': {
                "Host": 'gateway.chotot.com',
                "Connection": 'keep-alive',
                "sec-ch-ua": '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile": '?0',
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                "Accept": '*/*',
                "Origin": 'https://xe.chotot.com',
                "Sec-Fetch-Site": 'same-site',
                "Sec-Fetch-Mode": 'cors',
                "Sec-Fetch-User": 'empty',
                "Referer": 'https://xe.chotot.com/',
                "Accept-Encoding": '',
                "Accept-Language": 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        }
        request(option, async function (error, response) {
            if (response) {
                let data = JSON.parse(response.body)
                data = data.ads
                let result = []
                let obj = {
                    account_name: "",
                    date: "",
                    title: "", //data[i].subject
                    description: "", //data[i].body
                    address: "", //data[i].ward_name + data[i].area_name + data[i].region_name
                    province: "",
                    price: "",
                    image: "",
                    status: "", //data[i].condition_ad_name
                    phone: "",
                    mileage_v2: "", //data[i].mileage_v2
                    year_registered: "", //data[i].params[0].value
                    type: "", //data[i].params[1].value
                    motorbikebrand: "",
                    motorbikecapacity: "",
                    loaiCH: "Cá nhân"
                }
                for (let i = 0; i < data.length; i++) {
                    let descript = data[i].body.split("\n").join(".")
                    obj = {
                        account_name: data[i].account_name,
                        date: data[i].date,
                        title: data[i].subject,
                        description: descript,
                        province: data[i].region_name.toLowerCase(),
                        image: data[i].image,
                        status: data[i].condition_ad_name,
                        phone: data[i].phone,
                        mileage_v2: data[i].mileage_v2,
                        loaiCH: "Cá nhân"
                    }
                    if (typeof data[i].price === 'undefined') {
                        obj.price = 0
                    } else {
                        obj.price = data[i].price
                    }
                    if (typeof data[i].ward_name === 'undefined') {
                        obj.address = data[i].area_name + " - " + data[i].region_name
                    } else {
                        obj.address = data[i].ward_name + " - " + data[i].area_name + " - " + data[i].region_name
                    }
                    if (typeof data[i].params[0] === 'undefined') {
                        obj.year_registered = ""
                    } else {
                        obj.year_registered = data[i].params[0].value
                    }
                    if (typeof data[i].params[1] === 'undefined') {
                        obj.type = ""
                    } else {
                        obj.type = data[i].params[1].value
                    }
                    switch (data[i].motorbikebrand) {
                        case 1:
                            obj.motorbikebrand = "Honda"
                            break;
                        case 2:
                            obj.motorbikebrand = "Yamaha"
                            break;
                        case 3:
                            obj.motorbikebrand = "Piaggio"
                            break;
                        case 4:
                            obj.motorbikebrand = "Suzuki"
                            break;
                        case 5:
                            obj.motorbikebrand = "SYM"
                            break;
                        case 12:
                            obj.motorbikebrand = "Ducati"
                            break;
                        case 8:
                            obj.motorbikebrand = "Benelli"
                            break;
                        case 17:
                            obj.motorbikebrand = "Kawasaki"
                            break;
                        case 35:
                            obj.motorbikebrand = "Brixton"
                            break;
                        case 21:
                            obj.motorbikebrand = "Kymco"
                            break;
                        case 20:
                            obj.motorbikebrand = "KTM"
                            break;
                        default:
                            obj.motorbikebrand = "Hãng khác"
                    }
                    switch (data[i].motorbikecapacity) {
                        case 1:
                            obj.motorbikecapacity = "Dưới 50 cc"
                            break;
                        case 2:
                            obj.motorbikecapacity = "50 - 100 cc"
                            break;
                        case 3:
                            obj.motorbikecapacity = "100 - 175 cc"
                            break;
                        case 4:
                            obj.motorbikecapacity = "Trên 175 cc"
                            break;
                        default:
                            obj.motorbikecapacity = "Không biết rõ"
                    }
                    result.push(obj)
                }
                for (let j = 0; j < result.length; j++) {
                    setTimeout(async function () {
                        let check = await Bike.findOne({
                            isdelete: false,
                            title: result[j].title
                        })
                        if (check == null) {
                            let newBike = Bike({
                                tennguoiban: result[j].account_name,
                                image: result[j].image,
                                title: result[j].title,
                                loaixe: result[j].type,
                                gia: result[j].price,
                                date: result[j].date,
                                diadiem: result[j].address,
                                province: result[j].province.toLowerCase(),
                                mota: result[j].description,
                                hangxe: result[j].motorbikebrand,
                                namdangky: result[j].year_registered,
                                sokm: result[j].mileage_v2,
                                sodt: result[j].phone,
                                dungtichxe: result[j].motorbikecapacity,
                                loaiCH: result[j].loaiCH,
                                trangthai: 1, //1: chua xem, 2: da lien he, 3: da ban, 4: ko nghe may, 5: da xem
                                ghichu: "",
                                isdelete: false,
                                date_import: new Date(),
                            })
                            newBike.save()
                            let messages = {
                                notification: {
                                    title: `${result[j].title}`,
                                    body: `Giá: ${result[j].price}. Địa điểm: ${result[j].address}`
                                },
                                topic: "minhhoangjsc"
                            };
                            admin.messaging().send(messages)
                                .then((response) => {
                                    console.log("Day thanh cong ca nhan!")
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    }, 100 * j)
                }
            }
        })
    },
    loadbalance: async function(req, res){
        loadbalance();
    }

}