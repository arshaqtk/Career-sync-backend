interface UserQuery {
  page: number;
  limit: number;
  search?:string;
  status?: "active" | "blocked"|"all"
}