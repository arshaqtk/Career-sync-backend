import { QueryFilter } from "mongoose";
import { FindByIdOptions, FindLatestByActorOptions, FindManyOptions, UpdateByIdOptions } from "../types/interview.repository.types";
import { IInterview } from "../types/interviewModel.types";
import { InterviewPopulated } from "../types/interview.populated.type";

export interface IInterviewRepository{
    create(data:Partial<IInterview>):Promise<IInterview>;
    findOne(filter: Record<string, any>): Promise<IInterview | null>;
    findMany(options?: FindManyOptions): Promise<IInterview[]>;
    findById(options:FindByIdOptions):Promise<InterviewPopulated>;
    updateById(id:string,payload:any):Promise<IInterview|null>;
    updateByIdAndPopulate(id:string,options:UpdateByIdOptions<IInterview>):Promise<IInterview|null>;
    findLatestRound(applicationId:string):Promise<IInterview|null>
    findLatestByActor(options?: FindLatestByActorOptions): Promise<IInterview[]>;
    countByQuery(filter: QueryFilter<IInterview>): Promise<number>
}