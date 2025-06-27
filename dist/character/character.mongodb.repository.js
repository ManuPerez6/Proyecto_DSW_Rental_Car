import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/';
const mongoClient = new MongoClient(uri);
const db = mongoClient.db(process.env.MONGODB_DB || 'characters');
const characters = db.collection('characters');
export class CharacterMongoRepository {
    constructor() {
        mongoClient.connect();
    }
    async findAll() {
        return await characters.find().toArray();
    }
    async findOne(id) {
        const objectId = new ObjectId(id);
        return (await characters.findOne({ _id: objectId })) || undefined;
    }
    async add(character) {
        const id = (await characters.insertOne(character)).insertedId;
        let resultCharacter = await characters.findOne({ _id: id });
        return resultCharacter || undefined;
    }
    async update(id, character) {
        const objectId = new ObjectId(id);
        return (await characters.findOneAndUpdate({ _id: objectId }, { $set: character }, { returnDocument: 'after' })) || undefined;
    }
    async partialUpdate(id, updates) {
        const objectId = new ObjectId(id);
        return (await characters.findOneAndUpdate({ _id: objectId }, { $set: updates }, { returnDocument: 'after' })) || undefined;
    }
    async delete(id) {
        const objectId = new ObjectId(id);
        return (await characters.findOneAndDelete({ _id: objectId })) || undefined;
    }
}
//# sourceMappingURL=character.mongodb.repository.js.map