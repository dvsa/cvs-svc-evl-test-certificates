import { HTTPMethods } from "../src/assets/Enums";
import { Handler } from "aws-lambda";

export interface IParams {
    path: string,
    proxy: string,
    method: string,
    function: any
}

export interface IFunctions {
    [s: string]: IParams
}

export interface IFunctionEvent {
    name: string;
    method: HTTPMethods;
    path: string;
    function: Handler;
  }