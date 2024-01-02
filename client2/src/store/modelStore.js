import {makeAutoObservable} from 'mobx'
class ModelStore{

    constructor(){
        this._models=[]
        makeAutoObservable(this)
    }

    setModels(models){
        this._models = models
    }

    get Models() {
        return this._models
    }

    addModel(model){
        this._models.push(model)
    }

}

export default ModelStore