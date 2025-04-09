import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IForce extends Document {
    _id: ObjectId,
    id: number,
    name: string,
    supplyLimit: number,
    supplyUsed: number,
    battleTally: number,
    victories: number,
    requisitionPoints: number,
    units: [
        {
        id: number,
        name: string,
        pointsValue: number,
        crusadePoints: number
        }
    ],
    recordOfAchivement: Array<string>
}

const forceSchema:Schema = new mongoose.Schema({
    __id: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    supplyLimit: {
        type: Number,
        required: true
    },
    supplyUsed: {
        type: Number,
        required: true
    },
    battleTally: {
        type: Number,
        required: true
    },
    victories: {
        type: Number,
    },
    requisitionPoints: {
        type: Number,
    },
    units: [
        {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        pointsValue: {
            type: Number,
            required: true
        },
        crusadePoints: {
            type: Number,
        },
        }
    ],
    recordOfAchivement: {
        type: Array<string>,
    },
});

const Force = mongoose.model<IForce>('Force', forceSchema);

export default Force;