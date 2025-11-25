export interface RegisterDTO{
    name:string;
    email:string;
    phone:string;
    password:string;
    role:"candidate" | "hr" | "interviewer" | "admin";
}

export interface LoginDTO{
    email:string;
    password:string;
}