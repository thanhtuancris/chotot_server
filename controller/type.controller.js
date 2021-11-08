
let Type = require("../model/type_bike")

module.exports = {
    add: async function(req, res){
        let name = req.body.name
        let newType = Type({
            name: name,
            date_import: new Date(),
            isdelete: false,
        })
        let save = await newType.save()
        res.status(200).json({
            statuscode: 200,
            message: "Thêm thể loại thành công",
        })
    },
    getType: async function(req, res){
        let rs = await Type.find()
        if(rs != null){
            res.status(200).json({
                statuscode: 200,
                message: "Lấy danh sách thể loại thành công",
                data: rs
            })
        }else{
            res.status(400).json({
                statuscode: 400,
                message: "Lấy danh sách thể loại thất bại"
            })
        }
    },
}