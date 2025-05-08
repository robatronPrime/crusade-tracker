import mongoose, { Document, Schema } from "mongoose";

export interface Forces extends Document {
    id: number,
    name: string,
    supplyLimit: number,
    supplyUsed: number,
    battleTally: number,
    victories: number,
    requisitionPoints: number,
    units: [
        {
        modelCount: number;
        id: number,
        name: string,
        pointsValue: number,
        crusadePoints: number
        }
    ],
    recordOfAchivement: []
}

const forceSchema:Schema = new mongoose.Schema<Forces>({
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
        modelCount: {
            type: Number,
        },
        }
    ],
    recordOfAchivement: {
        type: [],
    },
});

export default mongoose.models.Force || mongoose.model<Forces>("Force", forceSchema);