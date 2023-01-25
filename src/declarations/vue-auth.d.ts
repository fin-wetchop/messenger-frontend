import User from "@/models/User";

declare module "@websanova/vue-auth" {
  export interface UserInterface extends User {
  }
}
