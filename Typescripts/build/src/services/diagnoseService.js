"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnoseEntries_1 = __importDefault(require("../../data/diagnoseEntries"));
const getDiagnoses = () => {
    return diagnoseEntries_1.default;
};
exports.default = {
    getDiagnoses
};
