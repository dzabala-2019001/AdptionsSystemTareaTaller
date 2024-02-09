'user stict'

import Animal from './animal.model.js'

export const testA = (req, res)=>{
    console.log('test is runing')
    return res.send({message: 'Test is running'})
}

export const registerA = async(req, res)=>{
    try{
        let data = req.body
        let animal = new Animal(data)
        await animal.save()
        return res.send({message: `Registered succesfully, can be logged with name ${animal.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering animal', err: err})
    }
}

export const obtenerA = async (req, res) => {
    try {
        const animals = await Animal.find();
        return res.send(animals);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error retrieving animals' });
    }
}

export const updateA = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submiited some data that cannot be update'})
        let updateAnimal = await Animal.findOneAndUpdate(
          {_id: id},
          data,
          {new: true}  
        )
    } catch (error) {
        console.error(err)
        if(err.keyValue.name) return res.status(400).send ({message: `Animal ${err.keyValue.name} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}
 
export const deleteA = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedAnimal = await Animal.findOneAndDelete({_id: id})
        if(!deletedAnimal) return res.status(404).send({message: 'Account not found and not deleted'}) 
        return res.status({message: `Account with animal ${deletedAnimal.name} delete succesfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error delting account'})
    }
}

