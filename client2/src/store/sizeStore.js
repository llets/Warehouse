import {makeAutoObservable} from 'mobx'

class SizeStore{

    constructor(){
        this._sizes=[
            {"id": 1, "amount" : 1, "description": "h,w,d <= 20cm"},
            {"id": 2, "amount" : 2, "description": "20cm < h,w,d <= 40cm"},
            {"id": 3, "amount" : 3, "description": "40cm < h,w,d <= 60cm"},
            {"id": 4, "amount" : 4, "description": "60cm < h,w,d <= 80cm"},
            {"id": 5, "amount" : 5, "description": "80cm < h,w,d <= 100cm"},
            {"id": 6, "amount" : 6, "description": "100cm < h,w,d <= 120cm"},
            {"id": 7, "amount" : 7, "description": "120cm < h,w,d <= 140cm"},
            {"id": 8, "amount" : 8, "description": "140cm < h,w,d <= 160cm"},
            {"id": 9, "amount" : 9, "description": "160cm < h,w,d <= 180cm"}
        ]
        makeAutoObservable(this)
    }

    setSizes(sizes){
        this._sizes = sizes
    }

    get Sizes(){
        return this._sizes
    }
}

export default SizeStore