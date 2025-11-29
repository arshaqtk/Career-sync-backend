

export interface RegisterDTO{
    name:string;
    email:string;
    password:string;
    confirmPassword:string;
    role:"candidate" | "recruiter";
}

export interface LoginDTO{
    email:string;
    password:string;
    role:"candidate" | "recruiter"| "admin";
}

export interface UserDTO{
 name:string;
    email:string;
    role:"candidate" |"recruiter"| "admin";
}