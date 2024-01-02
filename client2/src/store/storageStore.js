import {makeAutoObservable} from 'mobx'

class StorageStore{

    constructor(){
        this._storage=[]
        this._info = []
        this._headers = ['id of the item','name of the model','size']
        makeAutoObservable(this)
    }

    setStorage(storage){
        this._storage = storage
        this._info = []
        for (let i = 0; i <= 1024; i++) {
            this._info.push([])
            // this._info.push('Empty')
        }
        this.setInfo()
        console.log(this._info)
    }

    setInfo(){
        // this._storage.map((item) =>{
        //     // this._info[item.shelf_id].push({good_id: item.good_id, model_name: item.model_name, size: item.size})
        //     if (this._info[item.shelf_id] === 'Empty'){
        //         // this._info[item.shelf_id] = `Rack №${Math.ceil([item.shelf_id]/8)}, Shelf №${[item.shelf_id]}\n`
        //         // this._info[item.shelf_id] = `GOOD_ID\t\tMODEL_NAME\t\t\t\tSIZE\n`
        //         // this._info[item.shelf_id] = `${item.good_id}\t${item.model_name}\t${item.size}\n`
        //         this._info[item.shelf_id] = []
        //         this._info[item.shelf_id].push({good_id: item.good_id, model_name: item.model, size: item.size})
        //     } else{
        //         // this._info[item.shelf_id] += `${item.good_id}\t${item.model_name}\t${item.size}\n`
        //         this._info[item.shelf_id].push({good_id: item.good_id, model_name: item.model, size: item.size})
        //     }
        // })

        for (let i = 0; i < this._storage.length; i++) {
            this._info[this._storage[i].shelf_id].push(
                {good_id: this._storage[i].good_id,
                    model_name: this._storage[i].model_name,
                    size: this._storage[i].size})
        }
        console.log(this._info)
    }

    getInfoById(id){
        // console.log(this._storage)
        // console.log(this._info[id])
        return this._info[id]
    }
    deleteByModelName(model_name, amount){
        // console.log(`DELETE BY MODEL NAME = ${model_name}`)
        // console.log(JSON.stringify(this._info))
        let count = 0
        let new_list = []
        for (let i = 0; i < this._storage.length; i++) {
            if (count!==amount && this._storage[i].model_name === model_name){
                count += 1
            } else {
                new_list.push(this._storage[i])
            }
        }
        // console.log(JSON.stringify(this._info))
        this.setStorage(new_list)
        // console.log(JSON.stringify(this._info))
    }
    get Storage(){
        return this._storage
    }

    get Headers() {
        return this._headers
    }


}

export default StorageStore